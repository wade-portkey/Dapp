import * as Google from 'expo-auth-session/providers/google';
import * as Application from 'expo-application';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { isIOS } from './utils';
import { AccessTokenRequest, makeRedirectUri, AuthRequest } from 'expo-auth-session';
import { sleep } from '.';

const Config = {
  GOOGLE_IOS_CLIENT_ID: '183226380326-38oi8hev1fug9js9gpbtdicgqgb81a78.apps.googleusercontent.com',
  GOOGLE_ANDROID_CLIENT_ID: '183226380326-em97svk5eeu86qu8u4vu3qmeqmvrvmb9.apps.googleusercontent.com',
  GOOGLE_WEB_CLIENT_ID: '183226380326-ei86f6dh7v541u6m8c5karu57g00mu56.apps.googleusercontent.com',
};

if (!isIOS) {
  GoogleSignin.configure({
    offlineAccess: true,
    webClientId: Config.GOOGLE_WEB_CLIENT_ID,
  });
}

const googleLogin = async () => {
  const request = new AuthRequest({
    clientId: isIOS ? Config.GOOGLE_IOS_CLIENT_ID : Config.GOOGLE_ANDROID_CLIENT_ID,
    redirectUri: makeRedirectUri({
      native: `${Application.applicationId}:/oauthredirect`,
    }),
    scopes: ['openid', 'profile', 'email'],
  });
  const iosPromptAsync: () => Promise<string> = async () => {
    const info = await request.promptAsync(Google.discovery);
    if (info.type === 'success') {
      const exchangeRequest = new AccessTokenRequest({
        clientId: Config.GOOGLE_IOS_CLIENT_ID ?? '',
        redirectUri: makeRedirectUri({
          native: `${Application.applicationId}:/oauthredirect`,
        }),
        code: info.params.code,
        extraParams: {
          code_verifier: request?.codeVerifier || '',
        },
      });
      const authentication = await exchangeRequest.performAsync(Google.discovery);

      return authentication?.accessToken;
    }
    const message =
      info.type === 'cancel' ? '' : 'It seems that the authorization with your Google account has failed.';
    throw { ...info, message };
  };

  const androidPromptAsync = async () => {
    await sleep(500);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // google services are available
    } catch (err) {
      throw Error('Portkey‘s services are not available in your device.');
    }
    const userInfo = await GoogleSignin.signIn();
    const token = await GoogleSignin.getTokens();
    await GoogleSignin.signOut();
    return token.accessToken;
  };

  if (isIOS) {
    return iosPromptAsync();
  } else {
    return androidPromptAsync();
  }
};

export default googleLogin;
