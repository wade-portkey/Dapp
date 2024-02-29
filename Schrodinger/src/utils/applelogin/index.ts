import { isIOS } from '../utils';
import appleAuth, { appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { appleLoginOnIOS } from './ios';

const appleLogin = async () => {
  if (isIOS) {
    const token = (await appleLoginOnIOS()) as string;
    return token;
  } else {
    return await appleLoginAndroid();
  }
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