import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, Picker, Image } from 'react-native';
import { Button, Content, Form, Item, Input, Text, Label, View, Toast } from 'native-base';
import DatePicker from 'react-native-datepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImagePicker } from 'expo';
import Header from '../../components/PlainHeader';
import loginUser from '../../../assets/default_upload.png';
import { auth, db } from '../../../firebase.config';
import initialState from './State';
import { uploadImageAsync, width } from '../../utils';

class RegisterView extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  };

  state = {
    ...initialState,
  };

  handleRouteChange = url => {
    this.props.navigation.navigate(url);
  };

  handleChangeField = (val, name) => {
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

  choosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.handleImagePicked(result);
    }
  };

  handleImagePicked = async pickerResult => {
    try {
      // this.setState({ uploading: true });
      if (!pickerResult.cancelled) {
        const { download_url } = await uploadImageAsync(pickerResult.uri);
        this.setState({ userPhoto: download_url, isPhotoUploaded: true });
      }
    } catch (e) {
      console.log(e);
    } finally {
      // this.setState({ uploading: false });
    }
  };

  handleSubmit = () => {
    let { userPhoto, name, email, password, address, gender, born_date } = this.state;
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        db.collection('user')
          .doc(res.user.uid)
          .set({
            photo: userPhoto,
            nama: name,
            alamat: address,
            email,
            jenis_kelamin: gender,
            tanggal_lahir: born_date,
          })
          .then(() => {
            console.log('Document successfully written!');
          })
          .catch(error => {
            console.error('Error writing document: ', error);
          });
        this.setState({ ...initialState });
        this.showToastMessage('Kamu berhasil signup, silahkan login!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          this.showToastMessage('Email tersebut sudah digunakan akun lain');
        } else {
          this.showToastMessage('Kamu gagal signup, coba lagi!');
        }
      });
  };

  showToastMessage = message => {
    Toast.show({
      text: message,
      textStyle: { color: 'yellow' },
      buttonText: 'Close',
      duration: 3000,
    });
  };

  showErrorMessage = message => {
    return (
      <Item style={styles.errorBox}>
        <Text style={styles.errorMessage}>{message}</Text>
      </Item>
    );
  };

  render() {
    const {
      userPhoto,
      isPhotoUploaded,
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
        <Header nav={this.props} title="Daftar" />
        <Content padder>
          {!isPhotoUploaded && <Image source={loginUser} style={styles.image} />}
          {isPhotoUploaded && <Image source={{ uri: userPhoto }} style={styles.image} />}
          <Button small bordered dark style={styles.upload} onPress={this.choosePhoto}>
            <Text>Upload</Text>
          </Button>
          <Form>
            <Item floatingLabel error={!!(isNameChanged && !isNameValid)}>
              <Label>Nama</Label>
              <Input value={name} onChangeText={val => this.handleChangeField(val, 'name')} />
            </Item>
            {!isNameValid &&
              isNameChanged &&
              this.showErrorMessage('Tidak boleh angka atau karakter spesial (min. 3 huruf)')}
            {/* end of name */}
            <Item floatingLabel error={!!(isAddressChanged && !isAddressValid)}>
              <Label>Alamat</Label>
              <Input value={address} onChangeText={val => this.handleChangeField(val, 'address')} />
            </Item>
            {!isAddressValid && isAddressChanged && this.showErrorMessage('Alamat minimal 3 huruf')}
            {/* end of address */}
            <Item floatingLabel error={!!(isEmailChanged && !isEmailValid)}>
              <Label>Email</Label>
              <Input value={email} onChangeText={val => this.handleChangeField(val, 'email')} />
            </Item>
            {!isEmailValid && isEmailChanged && this.showErrorMessage('Email tidak valid')}
            {/* end of email */}
            <Item floatingLabel last error={!!(isPasswordChanged && !isPasswordChanged)}>
              <Label>Password</Label>
              <Input
                secureTextEntry
                value={password}
                onChangeText={val => this.handleChangeField(val, 'password')}
              />
            </Item>
            {!isPasswordValid &&
              isPasswordChanged &&
              this.showErrorMessage('Password minimal terdiri dari 8 karakter')}
            {/* end of password */}
            <Picker
              selectedValue={gender}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => this.handleChangeField(itemValue, 'gender')}>
              <Picker.Item label="Pilih Jenis Kelamin" value="" />
              <Picker.Item label="Laki-Laki" value="Laki-Laki" />
              <Picker.Item label="Perempuan" value="Perempuan" />
            </Picker>
            {!isGenderValid &&
              isGenderChanged &&
              this.showErrorMessage('Silahkan pilih jenis kelamin')}
            {/* end of gender */}
            <DatePicker
              style={styles.date}
              date={born_date}
              androidMode="spinner"
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
            {!isDateChanged && isDateValid && this.showErrorMessage('Tanggal lahir harus dipilih')}
            {/* end of date */}
            {isPhotoUploaded &&
              isNameValid &&
              isAddressValid &&
              isEmailValid &&
              isPasswordValid &&
              isGenderValid &&
              isDateValid && (
                <Button block success style={styles.btn} onPress={this.handleSubmit}>
                  <Text>Daftar</Text>
                </Button>
              )}
            {(!isPhotoUploaded ||
              !isNameValid ||
              !isAddressValid ||
              !isEmailValid ||
              !isPasswordValid ||
              !isGenderValid ||
              !isDateValid) && (
              <Button block disabled style={styles.btn}>
                <Text>Daftar</Text>
              </Button>
            )}
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
