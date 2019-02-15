import { Dimensions, Platform } from 'react-native';

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const wp = percentage => {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
};

const slideHeight = viewportHeight * 0.25;
const slideWidth = wp(100);
const itemHorizontalMargin = wp(0.5);

const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

const convertToCurrency = numb => {
  let number_string = numb.toString();
  let remains = number_string.length % 3;
  let result = number_string.substr(0, remains);
  let ribuan = number_string.substr(remains).match(/\d{3}/g);

  if (ribuan) {
    let separator = remains ? '.' : '';
    result += separator + ribuan.join('.');
  }

  return result;
};

export { sliderWidth, slideHeight, itemWidth, IS_IOS, convertToCurrency };
