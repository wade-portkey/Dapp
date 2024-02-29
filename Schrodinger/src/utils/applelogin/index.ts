import { appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import appleLoginOnIOS from './ios';

const appleLogin = async () => {
  const token = (await appleLoginOnIOS()) as string;
  return token;
};

const appleLoginAndroid = async () => {
  appleAuthAndroid.configure({
    clientId: '', // todo_wade
    redirectUri: '', // todo_wade
    scope: appleAuthAndroid.Scope.ALL,
    responseType: appleAuthAndroid.ResponseType.ALL,
  });
  const appleInfo = await appleAuthAndroid.signIn();
  return appleInfo.id_token ?? '';
};

export default appleLogin;