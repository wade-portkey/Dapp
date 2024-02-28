import WebView, { WebViewMessageEvent, WebViewProps } from 'react-native-webview';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LoadingBody } from './src/component/Loading';
import { useLogin } from './hook';
import { telegramLogin } from './src/utils/login';
const injectJavaScript = `
    const tmpFunction = window.postMessage;
    window.originalPostMessage = tmpFunction;
    window.postMessage = function(message){window.ReactNativeWebView.postMessage(message)};
`;
const injectedJavaScript = `
(function clientMethod() {
  var portkeyAPP = {
      __GLOBAL_FUNC_INDEX__: 0,
      invokeClientMethod: function (request, callback) {
          const {type, params} = request;
          var callbackName;
          if (typeof callback === 'function') {
              callbackName = '__CALLBACK__' + (portkeyAPP.__GLOBAL_FUNC_INDEX__++);
              portkeyAPP[callbackName] = callback;
          }
          window.ReactNativeWebView.postMessage(JSON.stringify({type, params, callback: callbackName }));
      },
      invokeWebMethod: function (callback, args) {
          if (typeof callback==='string') {
              var func = portkeyAPP[callback];
              if (typeof func === 'function') {
                  setTimeout(function () {
                      func.call(this, args);
                  }, 0);
              }
          }
      },
  };
  window.portkeyAPP = portkeyAPP;
  window.webviewCallback = function(data) {
      console.log('webviewCallback', data);
      window.portkeyAPP['invokeWebMethod'](data.callback, data.args);
  };
})();true;
`;
let webRef: any;

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
    source = { uri: 'http://192.168.11.126:3002' },
  } = props;
  console.log('load webview')
  const webViewRef = React.useRef<WebView>(null);
  // const [loading, setLoading] = useState(true);
  // deal with Webview(dapp) message post
  // useEffect(()=>{
  //   setTimeout(async ()=>{
  //     const token =  await telegramLogin.login();
  //     console.log('token', token);
  //   }, 10000);
  // }, []);
  const handleMessage = useCallback(
    async (content: WebViewMessageEvent) => {
      console.log('from webview msg is:', JSON.stringify(content.nativeEvent.data));
      const payload = JSON.parse(content.nativeEvent.data) as IRequest<ILoginParams>;
      try {
        if(payload.type === 'login'){
          const token  = await useLogin(payload.params?.type)
          const args: IResponse<ILoginResponse> = {
            status: 1,
            data: { token },
          }
          const callbackData = {callback: payload.callback, args};
          console.log('return to webview msg is:', JSON.stringify(callbackData));
          webViewRef.current?.injectJavaScript(`window.webviewCallback(${JSON.stringify(callbackData)})`)
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
  // const renderLoading = () => {
  //   if (!loading) return null;
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <LoadingBody iconType="loading" />
  //     </View>
  //   );
  // };
  // const loadEnd = useCallback(() => {
  //   console.log('webview load end')
  //   // setLoading(false)
  // }, []);
  // when onload , overWrite the postMessage func of Webview(dapp)
  const overWriteFuncOfWebview = () => {
    if (!webRef) throw Error('no WebViewRef');
    webRef.injectJavaScript(injectJavaScript);
  };

  return (
    <View style={styles.sectionContainer}>
      <MemoizedWebView
        ref={webViewRef}
        source={source}
        // onLoad={(event)=>{
        //   console.log('onLoad',event.nativeEvent.url);
        // }}
        onLoadEnd={(event)=>{
          console.log('onLoadEnd',event.nativeEvent.url);
        }}
        // onLoad={() => overWriteFuncOfWebview()}
        style={{ height: height, width: width, backgroundColor: 'yellow' }}
        onMessage={handleMessage}
        {...props}
        injectedJavaScript={injectedJavaScript}
      />
       {/* {renderLoading()} */}
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
