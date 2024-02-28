import { isIOS } from '../utils';
import appleAuth, { appleAuthAndroid } from '@invertase/react-native-apple-authentication';

const appleLogin = async () => {
  if (isIOS) {
    return await appleLoginIOS();
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

const appleLoginIOS = async () => {
  return '';
};

export default appleLogin;