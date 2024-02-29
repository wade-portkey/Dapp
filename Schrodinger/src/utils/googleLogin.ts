import { useCallback } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as Application from 'expo-application';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { isIOS } from './utils';
import { AccessTokenRequest, makeRedirectUri } from 'expo-auth-session';

const Config = {
  GOOGLE_IOS_CLIENT_ID: '',
  GOOGLE_ANDROID_CLIENT_ID: '',
};

const googleLogin = async () => {
  const [googleRequest, response, promptAsync] = Google.useAuthRequest({
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
    androidClientId: Config.GOOGLE_ANDROID_CLIENT_ID,
    shouldAutoExchangeCode: false,
  });
  const iosPromptAsync: () => Promise<string> = useCallback(async () => {
    const info = await promptAsync();
    if (info.type === 'success') {
      const exchangeRequest = new AccessTokenRequest({
        clientId: Config.GOOGLE_IOS_CLIENT_ID ?? '',
        redirectUri: makeRedirectUri({
          native: `${Application.applicationId}:/oauthredirect`,
        }),
        code: info.params.code,
        extraParams: {
          code_verifier: googleRequest?.codeVerifier || '',
        },
      });
      const authentication = await exchangeRequest.performAsync(Google.discovery);

      return authentication?.accessToken;
    }
    const message =
      info.type === 'cancel' ? '' : 'It seems that the authorization with your Google account has failed.';
    throw { ...info, message };
  }, [promptAsync, googleRequest?.codeVerifier]);

  const androidPromptAsync = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // google services are available
    } catch (err) {
      throw Error('Portkey‘s services are not available in your device.');
    }
    const userInfo = await GoogleSignin.signIn();
    const token = await GoogleSignin.getTokens();
    return token.accessToken;
  }, []);

  if (isIOS) {
    return iosPromptAsync();
  } else {
    return androidPromptAsync();
  }
};

export default googleLogin;