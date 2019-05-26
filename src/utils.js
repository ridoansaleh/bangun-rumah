import { Dimensions, Platform } from 'react-native';
import uuid from 'uuid';
import { st as storageRef } from '../firebase.config';

const IS_IOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');

const wp = percentage => {
  const value = (percentage * width) / 100;
  return Math.round(value);
};

const slideHeight = height * 0.25;
const slideWidth = wp(100);
const itemHorizontalMargin = wp(0.5);

const sliderWidth = width;
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

const convertToDate = (val, lang) => {
  let a = new Date(val.seconds * 1000);
  let months_in = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  let months_en = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  let year = a.getFullYear();
  let month = lang ? months_en[a.getMonth()] : months_in[a.getMonth()];
  let date = a.getDate();
  let hour = a.getHours();
  let min = a.getMinutes();
  let sec = a.getSeconds();
  let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  return time;
};

const getMonthName = (val, short) => {
  let res = '';
  switch (val) {
    case 0:
      res = short ? 'Jan' : 'Januari';
      break;
    case 1:
      res = short ? 'Feb' : 'Februari';
      break;
    case 2:
      res = short ? 'Mar' : 'Maret';
      break;
    case 3:
      res = short ? 'Apr' : 'April';
      break;
    case 4:
      res = 'Mei';
      break;
    case 5:
      res = short ? 'Jun' : 'Juni';
      break;
    case 6:
      res = short ? 'Jul' : 'Juli';
      break;
    case 7:
      res = short ? 'Agu' : 'Agustus';
      break;
    case 8:
      res = short ? 'Sep' : 'September';
      break;
    case 9:
      res = short ? 'Okt' : 'Oktober';
      break;
    case 10:
      res = short ? 'Nov' : 'November';
      break;
    case 11:
      res = short ? 'Des' : 'Desember';
      break;
  }
  return res;
};

const validateEmail = email => {
  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const uploadImageAsync = async uri => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.warn(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
  const u_id = uuid.v4();
  const ref = storageRef.child(u_id);
  const snapshot = await ref.put(blob);
  blob.close();
  const downloadUrl = await snapshot.ref.getDownloadURL();
  const result = {
    download_url: downloadUrl,
    image_ref: u_id,
  };
  return result;
};

export {
  sliderWidth,
  slideHeight,
  itemWidth,
  width,
  height,
  IS_IOS,
  convertToCurrency,
  getMonthName,
  convertToDate,
  validateEmail,
  uploadImageAsync,
};
