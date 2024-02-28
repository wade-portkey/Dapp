import { appleLogin, googleLogin, telegramLogin } from "./src/utils/login"

export async function useLogin(type: 'google'| 'apple' | 'telegram' | undefined ) {
  if(type === 'google'){
    return await googleLogin.login();
  }else if(type === 'apple'){
    return await appleLogin.login();
  }else if(type === 'telegram') {
    return await telegramLogin.login();
  }
  throw 'Unsupported login method';
}