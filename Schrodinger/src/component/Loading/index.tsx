import React from 'react';
import Overlay from 'rn-teaset/components/Overlay/Overlay';
import { View, StyleSheet, Keyboard, Text } from 'react-native';
import Lottie from 'lottie-react-native';
import { pTd } from '../../utils/unit';

let elements: number[] = [];
let timer: NodeJS.Timeout | null = null;
type IconType = 'loading';

type ShowOptionsType = {
  text?: string;
  iconType?: IconType;
  isMaskTransparent?: boolean;
  overlayProps?: any;
  duration?: number;
};

type LoadingPositionType = 'center' | 'bottom';

export function LoadingBody({ text }: { text?: string; position?: LoadingPositionType; iconType: IconType }) {
  return (
    <View style={[styles.center, styles.loadingWrap]}>
      <Lottie source={require('./globalLoading.json')} style={styles.loadingStyle} autoPlay loop />
      <Text style={styles.textStyles}>{text}</Text>
    </View>
  );
}

export default class Loading extends React.Component {
  static show(options?: ShowOptionsType): number {
    const { text = 'Loading...', iconType = 'loading', isMaskTransparent = true, overlayProps = {} } = options || {};
    Keyboard.dismiss();
    Loading.hide();
    const overlayView = (
      <Overlay.PopView
        modal={true}
        type="zoomIn"
        style={[styles.container, isMaskTransparent && styles.maskTransparent]}
        overlayOpacity={0}
        {...overlayProps}>
        <LoadingBody text={text} iconType={iconType} />
      </Overlay.PopView>
    );
    const key = Overlay.show(overlayView);
    elements.push(key);
    return key;
    // timer && clearBackgroundTimeout(timer);
    // timer = setBackgroundTimeout(() => {
    //   Loading.hide();
    // }, duration);
  }

  static showOnce(options?: ShowOptionsType) {
    if (elements.length) return;
    Loading.show(options);
  }

  static hide(key?: number) {
    timer && clearTimeout(timer);
    timer = null;
    elements = elements.filter(item => item); // Discard invalid data
    let keyItem: number | undefined;
    if (key !== undefined) {
      keyItem = elements.find(item => item === key);
      elements = elements.filter(item => item !== key);
    } else {
      keyItem = elements.pop();
    }
    keyItem !== undefined && Overlay.hide(keyItem);
  }

  static destroy() {
    timer && clearTimeout(timer);
    timer = null;
    elements.forEach(item => Overlay.hide(item));
    elements = [];
  }

  componentWillUnmount() {
    Loading.destroy();
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  maskTransparent: {
    backgroundColor: '#00000030',
  },
  loadingWrap: {
    width: pTd(224),
    minHeight: pTd(120),
    padding: pTd(16),
    backgroundColor: '#ffffff',
    borderRadius: pTd(6),
  },
  loadingStyle: {
    width: pTd(50),
  },
  textStyles: {
    color: '#25272A',
    marginTop: pTd(10),
    fontSize: pTd(14),
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
