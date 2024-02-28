import React from 'react';
import AppleLogin from './AppleLogin';
import OverlayModal from 'components/OverlayModal';
import { screenWidth } from 'packages/utils/mobile/device';

async function appleLogin() {
  let timer: undefined | NodeJS.Timer;
  return new Promise((resolve, reject) => {
    const key = OverlayModal.show(
      <AppleLogin
        headerComponent={null}
        baseUrl={'https://openlogin.portkey.finance/social-login/Apple'}
        onVerify={token => {
          OverlayModal.hideKey(key);
          resolve(token as string);
        }}
        onExpire={() => {
          reject('expire');
        }}
        onClose={type => {
          OverlayModal.hideKey(key);
          if (type !== 'verified') reject('You closed the prompt without any action.');
        }}
        webViewProps={{
          onLoadEnd: () => {},
          onLoadStart: () => {},
        }}
        onError={error => {
          reject(error);
        }}
      />,
      {
        modal: true,
        type: 'zoomOut',
        position: 'bottom',
        containerStyle: {
          width: screenWidth,
          height: '100%',
          backgroundColor: 'transparent',
        },
      },
    );
  });
}

export { appleLogin };
