import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Constants, Location, Permissions } from 'expo';
import { Alert, AsyncStorage, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import {
  Button,
  Container,
  Content,
  Form,
  Item,
  Input,
  Text,
  Label,
  View,
  Spinner,
} from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';
import dayjs from 'dayjs';
import Header from '../../components/PlainHeader';
import loginUser from '../../../assets/login-user.jpg';
import { auth as authenticate, db } from '../../../firebase.config';
import { urls } from '../../constant';
import { width, height } from '../../utils';

class LoginView extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  };

  state = {
    email: '',
    password: '',
    isEmailValid: true,
    isPasswordValid: true,
    location: '-',
    device: '-',
    time: '-',
    isFormSubmitting: false,
  };

  componentDidMount() {
    this.checkUserPermission();
  }

  checkUserPermission = () => {
    let state = {
      time: dayjs().format('DD MMMM YYYY HH:mm:ss'),
      device: `${Constants.deviceName} - ${JSON.stringify(Constants.platform)}`,
    };
    if (Platform.OS === 'android' && !Constants.isDevice) {
      console.info(
        'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      );
      this.setState({ ...state });
    } else {
      this._getLocationAsync(state);
    }
  };

  _getLocationAsync = async state => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.info('Permission to access location was denied');
    }
    let location = await Location.getCurrentPositionAsync({});
    if (Object.keys(location).length > 0) {
      let completeLoc = await Location.reverseGeocodeAsync(location.coords);
      this.setState({
        time: state.time,
        device: state.device,
        location: `${completeLoc[0].city}, ${completeLoc[0].region} / ${completeLoc[0].country}`,
      });
    } else {
      this.setState({
        ...state,
      });
    }
  };

  handleChangeField = (val, name) => {
    if (name === 'email') {
      if (val) {
        this.setState({ email: val, isEmailValid: true });
      } else {
        this.setState({ email: val, isEmailValid: false });
      }
    } else if (name === 'password') {
      if (val) {
        this.setState({ password: val, isPasswordValid: true });
      } else {
        this.setState({ password: val, isPasswordValid: false });
      }
    }
  };

  handleRouteChange = (url, param) => {
    this.props.navigation.navigate(url, { origin: param });
  };

  handleSubmit = () => {
    const { email, password } = this.state;
    if (email === '' || password === '') {
      if (email === '' && password !== '') {
        this.setState({
          isEmailValid: false,
          isPasswordValid: true,
        });
      } else if (email === '' && password === '') {
        this.setState({
          isEmailValid: false,
          isPasswordValid: false,
        });
      } else if (email !== '' && password === '') {
        this.setState({
          isEmailValid: true,
          isPasswordValid: false,
        });
      }
    } else {
      this.setState({
        isFormSubmitting: true,
      });
      this.login(email, password);
    }
  };

  saveUserLog = uid => {
    const { location, device, time } = this.state;
    db.collection('log_user')
      .add({
        id_user: uid,
        terakhir_login: time,
        lokasi: location,
        perangkat: device,
      })
      .then(docRef => {
        console.log('Successfully save user logs with id ', docRef.id);
        this.handleRouteChange(urls.home);
      })
      .catch(error => {
        console.error('Error saving user logs \n', error);
      });
  };

  login = (e, p) => {
    authenticate
      .signInWithEmailAndPassword(e, p)
      .then(() => {
        authenticate.onAuthStateChanged(user => {
          if (user) {
            const docRef = db.collection('user').doc(user.uid);
            docRef
              .get()
              .then(doc => {
                if (doc.exists) {
                  const data = doc.data();
                  AsyncStorage.setItem('_id', user.uid);
                  AsyncStorage.setItem('_nama', data.nama);
                  AsyncStorage.setItem('_alamat', data.alamat);
                  AsyncStorage.setItem('_email', data.email);
                  AsyncStorage.setItem('_jenisKelamin', data.jenis_kelamin);
                  AsyncStorage.setItem('_tanggalLahir', data.tanggal_lahir);
                  AsyncStorage.setItem('_photo', data.photo);
                  AsyncStorage.setItem('_verfikasiEmail', user.emailVerified.toString());
                  this.setState(
                    {
                      email: '',
                      password: '',
                      isEmailValid: true,
                      isPasswordValid: true,
                      isFormSubmitting: false,
                    },
                    () => {
                      this.saveUserLog(user.uid);
                    }
                  );
                } else {
                  console.error('No such document!');
                }
              })
              .catch(error => {
                console.error('Error getting document:', error);
              });
          }
        });
      })
      .catch(error => {
        this.setState(
          {
            email: '',
            password: '',
            isEmailValid: true,
            isPasswordValid: true,
            isFormSubmitting: false,
          },
          () => {
            if (error.code === 'auth/wrong-password') {
              this.showDialogMessage(
                'Tidak Valid',
                'Email atau password Anda salah. Ingin mengatur ulang password ?',
                'Lupa password',
                'ResetPassword'
              );
            } else {
              this.showDialogMessage(
                'Error',
                'Akun ini tidak ada. Apakah Anda ingin membuat akun baru ?',
                'Daftar',
                'Register'
              );
            }
          }
        );
      });
  };

  showDialogMessage = (title, message, action, url) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Tutup',
          onPress: () => {
            console.log('Close alert diaglog');
          },
        },
        {
          text: action,
          onPress: () => {
            return this.props.navigation.navigate(url);
          },
        },
      ],
      { cancelable: true }
    );
  };

  render() {
    const { email, password, isEmailValid, isPasswordValid, isFormSubmitting } = this.state;
    return (
      <Container>
        <Header nav={this.props} title="Login" />
        <Content padder style={styles.contentContainer}>
          <Image source={loginUser} style={styles.image} />
          <Form>
            <Item floatingLabel error={!isEmailValid}>
              <Label>Email</Label>
              <Input value={email} onChangeText={val => this.handleChangeField(val, 'email')} />
            </Item>
            {!isEmailValid && (
              <Item style={styles.errorBox}>
                <Text style={styles.errorMessage}>{'Email tidak boleh kosong'}</Text>
              </Item>
            )}
            <Item floatingLabel last error={!isPasswordValid}>
              <Label>Password</Label>
              <Input
                value={password}
                secureTextEntry
                onChangeText={val => this.handleChangeField(val, 'password')}
              />
            </Item>
            {!isPasswordValid && (
              <Item style={styles.errorBox}>
                <Text style={styles.errorMessage}>{'Password tidak boleh kosong'}</Text>
              </Item>
            )}
            <Grid style={styles.btnBox}>
              <Col style={styles.block}>
                <Button
                  danger
                  style={styles.btn}
                  onPress={() => this.handleRouteChange(urls.register)}>
                  <Text>Daftar</Text>
                </Button>
              </Col>
              <Col style={styles.block}>
                <Button success style={styles.btn} onPress={this.handleSubmit}>
                  {isFormSubmitting ? <Spinner color="white" /> : <Text>Login</Text>}
                </Button>
              </Col>
            </Grid>
          </Form>
          <View style={styles.forgotPassword}>
            <Text>Anda lupa password? Klik di </Text>
            <TouchableOpacity onPress={() => this.handleRouteChange(urls.change_password, 'login')}>
              <Text>sini</Text>
            </TouchableOpacity>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: height * 0.1,
  },
  image: {
    width: width * 0.25,
    height: width * 0.25,
    marginLeft: (width * 0.75) / 2,
    marginRight: (width * 0.75) / 2,
  },
  btnBox: {
    marginTop: 30,
  },
  block: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    width: width * 0.4,
    justifyContent: 'center',
  },
  forgotPassword: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  errorBox: {
    borderBottomWidth: 0,
  },
  errorMessage: {
    fontSize: 12,
    color: '#FF5733',
  },
});

export default LoginView;
