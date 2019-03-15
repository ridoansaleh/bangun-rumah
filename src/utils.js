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

const getMonthName = val => {
  let res = '';
  switch (val) {
    case 0:
      res = 'Januari';
      break;
    case 1:
      res = 'Februari';
      break;
    case 2:
      res = 'Maret';
      break;
    case 3:
      res = 'April';
      break;
    case 4:
      res = 'Mei';
      break;
    case 5:
      res = 'Juni';
      break;
    case 6:
      res = 'Juli';
      break;
    case 7:
      res = 'Agustus';
      break;
    case 8:
      res = 'September';
      break;
    case 9:
      res = 'Oktober';
      break;
    case 10:
      res = 'November';
      break;
    case 11:
      res = 'Desember';
      break;
  }
  return res;
};

export { sliderWidth, slideHeight, itemWidth, IS_IOS, convertToCurrency, getMonthName };
