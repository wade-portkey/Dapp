import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Platform, StatusBar as StatusBarRN } from 'react-native';
import CommonWebView from './Home';
import { useFonts } from 'expo-font';
global.Buffer = require('buffer').Buffer;

export default function App() {
  useFonts({
    'Roboto-Regular': require('./src/assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('./src/assets/fonts/Roboto-Medium.ttf'),
  });
  return (
    <SafeAreaView style={styles.container}>
      <CommonWebView />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === "android" ? StatusBarRN.currentHeight : 0
  },
  image: {
    height: '100%',
    width: '100%',
  },
});
