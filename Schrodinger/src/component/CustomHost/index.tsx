import { DevSettings, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CustomHostStorageKey = "ai.schrodingernft.hostUrl";

DevSettings.addMenuItem('Custom Host Url', async () => {
  const hostUrl = await AsyncStorage.getItem(CustomHostStorageKey);
  Alert.prompt(
    "Enter host url",
    "Enter host url such as 'https://schrodingernft.ai/'",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      {
        text: "OK",
        onPress: text => {
          AsyncStorage.setItem(CustomHostStorageKey, text ?? '');
          Alert.alert('Host url updated, please restart the app to take effect');
        }
      }
    ],
    "plain-text",
    hostUrl ?? "https://schrodingernft.ai/"
  );
});