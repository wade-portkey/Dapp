import { useTelegramAuthentication } from "./telegramLogin";

interface ILoginHandler{
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

class TelegramLogin implements ILoginHandler{
  async login(): Promise<string> {
    const { telegramSign } = useTelegramAuthentication();
    const info = await telegramSign();
    return info.accessToken;
  }
}

const googleLogin = new GoogleLogin();
const appleLogin = new AppleLogin();
const telegramLogin = new TelegramLogin();
export { googleLogin, appleLogin, telegramLogin };