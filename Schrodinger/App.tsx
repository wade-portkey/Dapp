import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import CommonWebView from './Home';
import { useFonts } from 'expo-font';
import app from './app.json';
global.Buffer = require('buffer').Buffer;

export default function App() {
  useFonts({
    'Roboto-Regular': require('./src/assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('./src/assets/fonts/Roboto-Medium.ttf'),
  });
  return (
    <View style={styles.container}>
      <CommonWebView source={{ uri: app.hostUrl }} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
  },
});
