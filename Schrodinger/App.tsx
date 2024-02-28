import { StyleSheet, Image, View } from 'react-native';

export default function App() {
  console.log('load App');
  return (
    <View style={styles.container}>
      <Image source={require('../Schrodinger/src/assets/png/splashscreen_image.png')} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
  },
});
