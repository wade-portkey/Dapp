import { Share } from 'react-native';
export default ({title, url, message}: {title: string, url: string, message: string}) => {
  return new Promise((resolve, reject) => {
    Share.share({
      title,
      message,
      url
    }).then((res) => {
      if (res.action === Share.sharedAction) {
        resolve(true);
      } else {
        resolve(false);
      }
    }).catch((err) => {
      reject(err);
    });
  });
};