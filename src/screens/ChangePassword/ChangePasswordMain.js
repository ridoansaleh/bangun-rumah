import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, StyleSheet, Dimensions, AsyncStorage } from 'react-native';
import {
  Button,
  Container,
  Content,
  Text,
  Form,
  Item,
  Input,
  Label,
  View,
  Toast,
  Spinner,
} from 'native-base';
import Authentication from '../../components/Authentication';
import Header from '../../components/PlainHeader';
import { auth } from '../../../firebase.config';
import { urls, user } from '../../constant';

const { width, height } = Dimensions.get('window');

class ChangePasswordScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    resetUserStatus: PropTypes.func,
  };

  state = {
    password: '',
    isPasswordChanged: false,
    isPasswordValid: false,
    retypePassword: '',
    isRepasswordChanged: false,
    isRepasswordValid: false,
    isLoading: false,
  };

  handleChangeField = (val, field) => {
    if (field === 'password') {
      if (val.length >= 8) {
        this.setState({
          password: val,
          isPasswordChanged: true,
          isPasswordValid: true,
        });
      } else {
        this.setState({
          password: val,
          isPasswordChanged: true,
          isPasswordValid: false,
        });
      }
    } else {
      if (val === this.state.password) {
        this.setState({
          retypePassword: val,
          isRepasswordChanged: true,
          isRepasswordValid: true,
        });
      } else {
        this.setState({
          retypePassword: val,
          isRepasswordChanged: true,
          isRepasswordValid: false,
        });
      }
    }
  };

  logOut = () => {
    auth
      .signOut()
      .then(() => {
        AsyncStorage.multiRemove(user, error => {
          error && console.error(error);
        });
        this.props.resetUserStatus();
      })
      .catch(error => console.error('Error while perform logout \n', error));
  };

  showToastMessage = message => {
    Toast.show({
      text: message,
      textStyle: { color: 'yellow' },
      buttonText: 'Close',
      duration: 2500,
    });
  };

  handleSubmit = () => {
    let user = auth.currentUser;
    this.setState({
      isLoading: true,
    });
    user
      .updatePassword(this.state.password)
      .then(() => {
        this.showToastMessage('Berhasil update password');
        this.setState({
          password: '',
          isPasswordChanged: false,
          isPasswordValid: false,
          retypePassword: '',
          isRepasswordChanged: false,
          isRepasswordValid: false,
          isLoading: false,
        });
        setTimeout(() => {
          this.props.nav.navigation.navigate(urls.dashboard_profile);
        }, 3000);
      })
      .catch(error => {
        Alert.alert(
          'Error',
          'Silahkan logout dan login lagi untuk mengubah password',
          [{ text: 'OK', onPress: () => this.logOut() }],
          { cancelable: true }
        );
        console.log('Error while updating password \n ', error);
      });
  };

  render() {
    const {
      password,
      retypePassword,
      isPasswordChanged,
      isPasswordValid,
      isRepasswordChanged,
      isRepasswordValid,
      isLoading,
    } = this.state;
    return (
      <Container>
        <Header {...this.props} title="Ganti Password" />
        <Content style={{ padding: 10 }}>
          <Form style={{ marginTop: 0.2 * height }}>
            <Item floatingLabel error={isPasswordChanged && !isPasswordValid}>
              <Label>Password</Label>
              <Input
                value={password}
                secureTextEntry
                onChangeText={val => this.handleChangeField(val, 'password')}
              />
            </Item>
            {isPasswordChanged && !isPasswordValid && (
              <Item style={styles.errorBox}>
                <Text style={styles.errorMessage}>
                  {'Password tidak boleh kosong dan min. 8 karakter'}
                </Text>
              </Item>
            )}
            <Item floatingLabel last error={isRepasswordChanged && !isRepasswordValid}>
              <Label>Retype Password</Label>
              <Input
                value={retypePassword}
                secureTextEntry
                onChangeText={val => this.handleChangeField(val, 'retypePassword')}
              />
            </Item>
            {isRepasswordChanged && !isRepasswordValid && (
              <Item style={styles.errorBox}>
                <Text style={styles.errorMessage}>
                  {'Retype password harus sama dengan password sebelumnya'}
                </Text>
              </Item>
            )}
            <View>
              {isPasswordValid && isRepasswordValid ? (
                <Button success style={styles.btn} onPress={() => this.handleSubmit()}>
                  {isLoading ? <Spinner color="white" /> : <Text>Submit</Text>}
                </Button>
              ) : (
                <Button style={styles.btn} disabled>
                  <Text>Submit</Text>
                </Button>
              )}
            </View>
          </Form>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  errorBox: {
    borderBottomWidth: 0,
  },
  errorMessage: {
    fontSize: 12,
    color: '#FF5733',
  },
  btn: {
    width: width - 20,
    marginTop: 15,
    justifyContent: 'center',
  },
});

export default Authentication(ChangePasswordScreen);
