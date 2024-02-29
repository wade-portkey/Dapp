import TelegramOverlay from "../component/TelegramOverlay";
import { TelegramLogin } from "./telegramLogin";
import appleLoginCall from './applelogin';

export interface ILoginHandler{
  login(): Promise<string>;
}

class GoogleLogin implements ILoginHandler{
  async login(): Promise<string> {
    return 'xiofjoksafj';
  }
}

class AppleLogin implements ILoginHandler{
  login(): Promise<string> {
    return appleLoginCall();
  }
}

const googleLogin = new GoogleLogin();
const appleLogin = new AppleLogin();
const telegramLogin = new TelegramLogin();
export { googleLogin, appleLogin, telegramLogin };