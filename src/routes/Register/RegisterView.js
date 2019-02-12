import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, TouchableOpacity, Picker, Image } from 'react-native';
import {
  Button,
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
import DatePicker from 'react-native-datepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const loginUser = require('../../../assets/default_upload.png');
const { width } = Dimensions.get('window');

class RegisterView extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  };

  state = {
    name: '',
    address: '',
    email: '',
    password: '',
    gender: '',
    born_date: '',
    isNameValid: false,
    isAddressValid: false,
    isEmailValid: false,
    isPasswordValid: false,
    isDateValid: false,
    isNameChanged: false,
    isAddressChanged: false,
    isEmailChanged: false,
    isPasswordChanged: false,
    isDateChanged: false,
  };

  handleRouteChange = url => {
    this.props.navigation.navigate(url);
  };

  handleChangeField = (val, name) => {
    console.log('val : ', val);
    console.log('name : ', name);
    if (name === 'name') {
      if (val.length >= 3) {
        if (/^[a-zA-Z\ ]+$/.test(val)) {
          this.setState({ name: val, isNameValid: true, isNameChanged: true });
        } else {
          this.setState({ name: val, isNameValid: false, isNameChanged: true });
        }
      } else {
        this.setState({ name: val, isNameValid: false, isNameChanged: true });
      }
    } else if (name === 'address') {
      if (val.length >= 3) {
        this.setState({ address: val, isAddressValid: true, isAddressChanged: true });
      } else {
        this.setState({ address: val, isAddressValid: false, isAddressChanged: true });
      }
    } else if (name === 'email') {
      if (/(.+)@(.+){2,}\.(.+){2,}/.test(val)) {
        this.setState({ email: val, isEmailValid: true, isEmailChanged: true });
      } else {
        this.setState({ email: val, isEmailValid: false, isEmailChanged: true });
      }
    } else if (name === 'password') {
      if (val.length >= 8) {
        this.setState({ password: val, isPasswordValid: true, isPasswordChanged: true });
      } else {
        this.setState({ password: val, isPasswordValid: false, isPasswordChanged: true });
      }
    } else if (name === 'gender') {
      if (val) {
        this.setState({ gender: val, isGenderValid: true, isGenderChanged: true });
      } else {
        this.setState({ gender: val, isGenderValid: false, isGenderChanged: true });
      }
    } else if (name === 'born_date') {
      if (val) {
        this.setState({ born_date: val, isDateValid: true, isDateChanged: true });
      } else {
        this.setState({ born_date: val, isDateValid: false, isDateChanged: true });
      }
    }
  };

  render() {
    const {
      name,
      address,
      email,
      password,
      gender,
      born_date,
      isNameValid,
      isAddressValid,
      isEmailValid,
      isPasswordValid,
      isGenderValid,
      isDateValid,
      isNameChanged,
      isAddressChanged,
      isEmailChanged,
      isPasswordChanged,
      isGenderChanged,
      isDateChanged,
    } = this.state;

    return (
      <KeyboardAwareScrollView enableOnAndroid>
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Daftar</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <Image source={loginUser} style={styles.image} />
          <Button small bordered dark style={styles.upload}>
            <Text>Upload</Text>
          </Button>
          <Form>
            <Item floatingLabel error={!!(isNameChanged && !isNameValid)}>
              <Label>Nama</Label>
              <Input value={name} onChangeText={val => this.handleChangeField(val, 'name')} />
            </Item>
            {!isNameValid && isNameChanged && (
              <Item style={styles.errorBox}>
                <Text style={styles.errorMessage}>
                  {'Tidak boleh angka atau karakter spesial (min. 3 huruf)'}
                </Text>
              </Item>
            )}
            {/* end of name */}
            <Item floatingLabel error={!!(isAddressChanged && !isAddressValid)}>
              <Label>Alamat</Label>
              <Input value={address} onChangeText={val => this.handleChangeField(val, 'address')} />
            </Item>
            {!isAddressValid && isAddressChanged && (
              <Item style={styles.errorBox}>
                <Text style={styles.errorMessage}>{'Alamat minimal 3 huruf'}</Text>
              </Item>
            )}
            {/* end of address */}
            <Item floatingLabel error={!!(isEmailChanged && !isEmailValid)}>
              <Label>Email</Label>
              <Input value={email} onChangeText={val => this.handleChangeField(val, 'email')} />
            </Item>
            {!isEmailValid && isEmailChanged && (
              <Item style={styles.errorBox}>
                <Text style={styles.errorMessage}>{'Email tidak valid'}</Text>
              </Item>
            )}
            {/* end of email */}
            <Item floatingLabel last error={!!(isPasswordChanged && !isPasswordChanged)}>
              <Label>Password</Label>
              <Input
                secureTextEntry
                value={password}
                onChangeText={val => this.handleChangeField(val, 'password')}
              />
            </Item>
            {!isPasswordValid && isPasswordChanged && (
              <Item style={styles.errorBox}>
                <Text style={styles.errorMessage}>
                  {'Password minimal terdiri dari 8 karakter'}
                </Text>
              </Item>
            )}
            {/* end of password */}
            <Picker
              selectedValue={gender}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => this.handleChangeField(itemValue, 'gender')}>
              <Picker.Item label="Pilih Jenis Kelamin" value="" />
              <Picker.Item label="Laki-Laki" value="Laki-Laki" />
              <Picker.Item label="Perempuan" value="Perempuan" />
            </Picker>
            {!isGenderValid && isGenderChanged && (
              <Item style={styles.errorBox}>
                <Text style={styles.errorMessage}>{'Silahkan pilih jenis kelamin'}</Text>
              </Item>
            )}
            {/* end of gender */}
            <DatePicker
              style={styles.date}
              date={born_date}
              mode="date"
              placeholder="Tanggal Lahir"
              format="YYYY-MM-DD"
              minDate="1940-01-01"
              maxDate="2010-01-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  right: 0,
                  top: 4,
                },
              }}
              onDateChange={val => this.handleChangeField(val, 'born_date')}
            />
            {!isDateChanged && isDateValid && (
              <Item style={styles.errorBox}>
                <Text style={styles.errorMessage}>{'Tanggal lahir harus dipilih'}</Text>
              </Item>
            )}
            {/* end of date */}
            <Button block success style={styles.btn}>
              <Text>Daftar</Text>
            </Button>
          </Form>
          <View style={styles.hasAccount}>
            <Text>Sudah punya Akun? Klik di </Text>
            <TouchableOpacity onPress={() => this.handleRouteChange('Login')}>
              <Text>sini</Text>
            </TouchableOpacity>
          </View>
        </Content>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
  },
  image: {
    marginTop: 20,
    width: width * 0.3,
    height: width * 0.25,
    marginLeft: (width * 0.7) / 2,
    marginRight: (width * 0.7) / 2,
  },
  upload: {
    marginTop: 5,
    width: width * 0.25,
    marginLeft: (width * 0.75) / 2,
    marginRight: (width * 0.75) / 2,
    justifyContent: 'center',
  },
  picker: {
    marginTop: 15,
    marginLeft: 5,
    height: 50,
    width: width * 0.98,
  },
  date: {
    marginTop: 15,
    width: width * 0.95,
  },
  btn: {
    marginTop: 30,
  },
  hasAccount: {
    marginTop: 50,
    marginBottom: 100,
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
  errorBorder: {
    borderBottomColor: '#FF5733',
    borderBottomWidth: 2,
  },
  errorDate: {
    borderColor: '#FF5733',
    width: '100%',
    marginTop: 15,
  },
});

export default RegisterView;
