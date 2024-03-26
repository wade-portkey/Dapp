import WebView, { WebViewMessageEvent, WebViewProps } from 'react-native-webview';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Linking } from 'react-native';
import { useLogin } from './hook';
import { statusBarHeight, bottomBarHeight } from './src/utils/device';
import socialShare from './src/utils/socialShare';
import { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';
import { useHostUrl } from './src/hooks/hostUrl';
import Loading from './src/component/Loading'

const injectedJavaScript = `
(function clientMethod() {
  var portkeyShellApp = {
      __GLOBAL_FUNC_INDEX__: 0,
      invokeClientMethod: function (request, callback) {
          const {type, params} = request;
          var callbackName;
          if (typeof callback === 'function') {
              callbackName = '__CALLBACK__' + (portkeyShellApp.__GLOBAL_FUNC_INDEX__++);
              portkeyShellApp[callbackName] = callback;
          }
          window.ReactNativeWebView.postMessage(JSON.stringify({type, params, callback: callbackName }));
      },
      invokeWebMethod: function (callback, args) {
          if (typeof callback==='string') {
              var func = portkeyShellApp[callback];
              if (typeof func === 'function') {
                  setTimeout(function () {
                      func.call(this, args);
                  }, 0);
              }
          }
      },
      deviceEnv: {
        statusBarHeight: ${statusBarHeight},
        bottomBarHeight: ${bottomBarHeight},
      },
  };
  window.portkeyShellApp = portkeyShellApp;
  window.webviewCallback = function(data) {
      console.log('webviewCallback', data);
      window.portkeyShellApp['invokeWebMethod'](data.callback, data.args);
  };
})();true;
`;

interface CommonWebViewProps extends WebViewProps {
  width?: number;
  height?: number;
  wallet?: any;
  aelfInstance?: any;
}

const CommonWebView: React.FC<CommonWebViewProps> = props => {
  const {
    width = '100%',
    height = '100%',
  } = props;
  const webViewRef = React.useRef<WebView>(null);
  const [loadSuccess, setLoadSuccess] = useState(false);
  const { isLoading: isLoadingHostUrl, hostUrl } = useHostUrl();
  useEffect(() => {
    if (isLoadingHostUrl) {
      Loading.show();
    } else {
      Loading.hide();
    }
    if (isLoadingHostUrl) return;
    if (loadSuccess) return;
    webViewRef?.current?.reload();
  }, [isLoadingHostUrl]);

  const handleMessage = useCallback(
    async (content: WebViewMessageEvent) => {
      console.log('from webview msg is:', JSON.stringify(content.nativeEvent.data));
      const payload = JSON.parse(content.nativeEvent.data) as IRequest<ICommonRequest>;
      try {
        if(payload.type === 'login'){
          const token  = await useLogin(payload.params?.type)
          const args: IResponse<ILoginResponse> = {
            status: 1,
            data: { token },
          }
          const callbackData = {callback: payload.callback, args};
          webViewRef.current?.injectJavaScript(`window.webviewCallback(${JSON.stringify(callbackData)})`)
        } else if (payload.type === 'socialShare') {
          const res = await socialShare(payload.params as ISocialShareParams);
          const args: IResponse<ICommonResponse> = {
            status: res ? 1 : 0,
            data: {
              desc: res ? 'share success' : 'share canceled',
            },
          }
          const callbackData = {callback: payload.callback, args};
          webViewRef.current?.injectJavaScript(`window.webviewCallback(${JSON.stringify(callbackData)})`)
        } else {
          throw new Error('Unsupported bridge method called: ' + payload.type);
        }
      } catch (err: any) {
        console.warn(err.toString());
        const args: IResponse<ILoginResponse> = {
          status: 0,
          msg: err.toString(),
        }
        const callbackData = {callback: payload.callback, args};
        console.log('return to webview msg is:', JSON.stringify(callbackData));
        webViewRef.current?.injectJavaScript(`window.webviewCallback(${JSON.stringify(callbackData)})`)
      }
    },
    [],
  );

  const isWhiteListHost = (host: string) => {
    // Google Recaptcha
    return  host.endsWith('portkey.finance') || host.endsWith('google.com')
  };

  const onShouldStartLoadWithRequest = ({ url }: ShouldStartLoadRequest) => {
    const { host } = new URL(url);
    const { host: appHost } = new URL(hostUrl);
    
    if (host.endsWith(appHost) || isWhiteListHost(host)) {
      return true;
    } else {
      Linking.openURL(url).catch(er => {
        console.log('Failed to open Link:', er.message);
      });
      return false;
    }
  };

  if (isLoadingHostUrl) {
    return (
      <View />
    );
  }
  return (
    <View style={styles.sectionContainer}>
      <MemoizedWebView
        ref={webViewRef}
        source={{ uri: hostUrl }}
        onLoadEnd={(event)=>{
          if (Boolean(event?.nativeEvent?.url)) {
            setLoadSuccess(true);
          }
        }}
        style={{ height: height, width: width }}
        onMessage={handleMessage}
        {...props}
        injectedJavaScript={injectedJavaScript}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      />
    </View>
  );
};
const MemoizedWebView = React.memo(WebView, ()=>true);
export default CommonWebView;

const styles = StyleSheet.create({
  sectionContainer: {
    height: '100%',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
