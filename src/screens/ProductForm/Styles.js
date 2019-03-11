import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
  },
  image: {
    marginTop: 10,
    width: (width - 20) * 0.3,
    height: width * 0.25,
  },
  upload: {
    marginTop: 7,
    width: '80%',
    marginLeft: '10%',
    marginRight: '10%',
  },
  customLabel: {
    fontSize: 15,
    color: 'grey',
    marginLeft: 0.03 * width,
    marginTop: 15,
  },
  textArea: {
    borderColor: 'black',
    borderWidth: 1,
    width: 0.9 * width,
    marginTop: 5,
    marginLeft: 0.03 * width,
    padding: 5,
  },
  picker: {
    marginLeft: 5,
    height: 25,
    width: width * 0.98,
  },
  date: {
    marginTop: 15,
    width: width * 0.95,
  },
  btn: {
    marginTop: 30,
    marginBottom: 50,
  },
  errorBox: {
    borderBottomWidth: 0,
  },
  errorMessage: {
    fontSize: 12,
    color: '#FF5733',
  },
});

export default styles;
