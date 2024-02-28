import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import CommonWebView from './Home';
import { useFonts } from 'expo-font';
global.Buffer = require('buffer').Buffer;

export default function App() {
  console.log('load App');
  useFonts({
    'Roboto-Regular': require('./src/assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('./src/assets/fonts/Roboto-Medium.ttf'),
  });
  return (
    <View style={styles.container}>
      {/* <Text>Open up App.tsx to start working on your app!</Text> */}
      {/* <CommonWebView source={{uri: 'https://beangotown.com/'}}/> */}
      <CommonWebView />
      {/* <StatusBar style="auto" /> */}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f00',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
