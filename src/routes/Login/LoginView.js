import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, AsyncStorage, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import {
  Button,
  Container,
  Content,
  Header,
  Icon,
  Left,
  Body,
  Right,
  Title,
  Form,
  Item,
  Input,
  Text,
  Label,
  View,
} from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';
import { auth as authenticate, db } from '../../../firebase.config';
const loginUser = require('../../../assets/login-user.jpg');

const { width, height } = Dimensions.get('window');
// Forgot password link is not ready yet

class LoginView extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  };

  state = {
    email: '',
    password: '',
    isEmailValid: true,
    isPasswordValid: true,
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

  handleRouteChange = url => {
    this.props.navigation.navigate(url);
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
      this.setState(
        {
          isEmailValid: false,
          isPasswordValid: false,
        },
        () => {
          this.login(email, password);
        }
      );
    }
  };

  login = (e, p) => {
    const that = this;
    authenticate
      .signInWithEmailAndPassword(e, p)
      .then(() => {
        authenticate.onAuthStateChanged(user => {
          if (user) {
            const docRef = db.collection('user').doc(user.uid);
            docRef
              .get()
              .then(function(doc) {
                if (doc.exists) {
                  const data = doc.data();
                  AsyncStorage.setItem('_id', user.uid);
                  AsyncStorage.setItem('_nama', data.nama);
                  AsyncStorage.setItem('_alamat', data.alamat);
                  AsyncStorage.setItem('_email', data.email);
                  AsyncStorage.setItem('_jenisKelamin', data.jenis_kelamin);
                  AsyncStorage.setItem('_tanggalLahir', data.tanggal_lahir);
                  AsyncStorage.setItem('_photo', data.photo);
                  that.setState(
                    {
                      email: '',
                      password: '',
                      isEmailValid: true,
                      isPasswordValid: true,
                    },
                    () => {
                      that.handleRouteChange('Home');
                    }
                  );
                } else {
                  console.error('No such document!');
                }
              })
              .catch(function(error) {
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
            console.log('Tutup diaglog');
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
    const { email, password, isEmailValid, isPasswordValid } = this.state;
    return (
      <Container>
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Login</Title>
          </Body>
          <Right />
        </Header>
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
                  onPress={() => this.handleRouteChange('Register')}>
                  <Text>Daftar</Text>
                </Button>
              </Col>
              <Col style={styles.block}>
                <Button success style={styles.btn} onPress={this.handleSubmit}>
                  <Text>Login</Text>
                </Button>
              </Col>
            </Grid>
          </Form>
          <View style={styles.forgotPassword}>
            <Text>Anda lupa password? Klik di </Text>
            <TouchableOpacity onPress={() => this.handleRouteChange('Home')}>
              <Text>sini</Text>
            </TouchableOpacity>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
  },
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
