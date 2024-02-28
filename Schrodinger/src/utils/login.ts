import TelegramOverlay from "../component/TelegramOverlay";
import { TelegramLogin } from "./telegramLogin";

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
    throw new Error("Method not implemented.");
  }
}

const googleLogin = new GoogleLogin();
const appleLogin = new AppleLogin();
const telegramLogin = new TelegramLogin();
export { googleLogin, appleLogin, telegramLogin };