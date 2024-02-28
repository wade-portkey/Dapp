import React from 'react';
import { forwardRef, useMemo, useState, useCallback, useRef, useImperativeHandle, ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import WebView, { WebViewMessageEvent, WebViewProps } from 'react-native-webview';
import { LoadingBody } from './src/component/Loading';

export declare type AppleLoginInterface = {
  open(): void;
  close(): void;
};

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    backgroundColor: 'white',
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
  transparentHeader: {
    height: '20%',
    width: '100%',
    backgroundColor: 'transparent',
  },
});

export type AppleLoginProps = {
  headerComponent?: ReactNode;
  footerComponent?: ReactNode;
  webViewProps?: Omit<WebViewProps, 'source' | 'style' | 'onMessage' | 'ref'>;
  onVerify: (token: string) => void;
  onExpire?: (...args: any[]) => void;
  onError?: (error: string) => void;
  onClose?: (...args: any[]) => void;
  onLoad?: (...args: any[]) => void;
  theme?: 'dark' | 'light';
  size?: 'invisible' | 'normal' | 'compact';
  baseUrl: string;
  style?: StyleProp<ViewStyle>;
  enterprise?: boolean;
  appleLoginDomain?: string;
  gstaticDomain?: string;
  hideBadge?: boolean;
  action?: string;
};

const DappWebView = forwardRef(function DappWebView(
  { onVerify, onExpire, onError, onClose, onLoad, size, baseUrl, style }: AppleLoginProps,
  ref,
) {
  const isClosed = useRef(false);
  const webViewRef = useRef<WebView>();
  const [, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  const isInvisibleSize = size === 'invisible';

  const handleLoad = useCallback(
    (...args: any[]) => {
      onLoad?.(...args);

      setLoading(false);
    },
    [onLoad],
  );

  const handleClose = useCallback(
    (...args: any[]) => {
      if (isClosed.current) return;
      isClosed.current = true;
      setVisible(false);
      onClose?.(...args);
    },
    [onClose],
  );

  const handleMessage = useCallback(
    (content: WebViewMessageEvent) => {
      try {
        console.log('from webview msg', JSON.stringify(content));
        const payload = JSON.parse(content.nativeEvent.data);
        console.log('payload data type', payload.type);
        console.log('payload data callback', payload.callback);
        if(payload.type === 'RN-SDK'){
          const callbackData = {callback: payload.callback, args: 'from rn msg'};
          console.log('JSON.stringify(callbackData)', JSON.stringify(callbackData));
          webViewRef.current?.injectJavaScript(`window.webviewCallback(${JSON.stringify(callbackData)})`)
        }
        if (payload.close && isInvisibleSize) {
          handleClose();
        }
        if (payload.closeWebView) {
          handleClose();
        }
        if (payload.load) {
          handleLoad(...payload.load);
        }
        if (payload.expire) {
          onExpire?.(payload.expire);
        }
        if (payload.error) {
          handleClose();
          onError?.(payload.error[0]);
        }
        if (
          payload?.type === 'PortkeySocialLoginOnSuccess' &&
          payload?.data?.provider === 'Apple' &&
          payload?.data?.token
        ) {
          handleClose('verified');
          onVerify?.(payload?.data?.token);
        }
      } catch (err) {
        console.warn(err);
      }
    },
    [onVerify, onExpire, onError, handleClose, handleLoad, isInvisibleSize],
  );

  // useImperativeHandle(
  //   ref,
  //   () => ({
  //     open: () => {
  //       setVisible(true);
  //       setLoading(true);
  //       isClosed.current = false;
  //     },
  //     close: handleClose,
  //   }),
  //   [handleClose],
  // );

  const webViewStyles = useMemo(() => [styles.webView, style], [style]);

  const renderLoading = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingContainer}>
        <LoadingBody iconType="loading" />
      </View>
    );
  };
  return (
    <>
      <TouchableOpacity style={styles.transparentHeader} onPress={onClose} />
      <WebView
        ref={webViewRef}
        source={{ uri: baseUrl }}
        style={webViewStyles}
        onLoadEnd={() => setLoading(false)}
        onMessage={handleMessage}
        injectedJavaScript={`
        (function clientMethod() {
          var APP = {
              __GLOBAL_FUNC_INDEX__: 0,
              invokeClientMethod: function (type, params, callback) {
                  var callbackName;
                  if (typeof callback === 'function') {
                      callbackName = '__CALLBACK__' + (APP.__GLOBAL_FUNC_INDEX__++);
                      APP[callbackName] = callback;
                  }
                  window.ReactNativeWebView.postMessage(JSON.stringify({type, params, callback: callbackName }));
              },
              invokeWebMethod: function (callback, args) {
                  if (typeof callback==='string') {
                      var func = APP[callback];
                      if (typeof func === 'function') {
                          setTimeout(function () {
                              func.call(this, args);
                          }, 0);
                      }
                  }
              },
          };
          window.APP = APP;
          window.webviewCallback = function(data) {
              console.log('webviewCallback', data);
              window.APP['invokeWebMethod'](data.callback, data.args);
          };
      })();true;
      setTimeout(()=>{
        window.APP.invokeClientMethod('LOGIN', '{a: 1}', (args)=>{
          console.log('args', args);
        })
      }, 15000)
        `}
      />
      {renderLoading()}
    </>
  );
});

export default DappWebView;
