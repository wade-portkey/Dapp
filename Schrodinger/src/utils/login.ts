interface ILoginHandler{
  login(): Promise<string>;
}

class GoogleLogin implements ILoginHandler{
  login(): Promise<string> {
    throw new Error("Method not implemented.");
  }
}

class AppleLogin implements ILoginHandler{
  login(): Promise<string> {
    throw new Error("Method not implemented.");
  }
}

class TelegramLogin implements ILoginHandler{
  login(): Promise<string> {
    throw new Error("Method not implemented.");
  }
}

const googleLogin = new GoogleLogin();
const appleLogin = new AppleLogin();
const telegramLogin = new TelegramLogin();
export { googleLogin, appleLogin, telegramLogin };