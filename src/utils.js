import { Dimensions, Platform } from 'react-native';

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const wp = percentage => {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
};

const slideHeight = viewportHeight * 0.25;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

export { sliderWidth, slideHeight, itemWidth, itemHorizontalMargin, IS_IOS };
