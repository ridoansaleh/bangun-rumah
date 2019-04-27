import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Picker, Image, AsyncStorage } from 'react-native';
import { Button, Content, Form, Item, Input, Text, Label, View, Toast } from 'native-base';
import DatePicker from 'react-native-datepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImagePicker } from 'expo';
import Authentication from '../../../components/Authentication';
import Header from '../../../components/PlainHeader';
import Loading from '../../../components/Loading';
import { db } from '../../../../firebase.config';
import { uploadImageAsync, width } from '../../../utils';

class EditProfileScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
    getProfile: PropTypes.func,
  };

  state = {
    name: this.props.user.nama,
    address: this.props.user.alamat,
    gender: this.props.user.jenisKelamin,
    born_date: this.props.user.tanggalLahir,
    userPhoto: this.props.user.photo,
    isNameValid: false,
    isAddressValid: false,
    isGendervalid: false,
    isDateValid: false,
    isPhotoUploaded: false,
    isNameChanged: false,
    isAddressChanged: false,
    isGenderChanged: false,
    isDateChanged: false,
    isSubmit: false,
    showWarning: false,
  };

  shouldComponentUpdate(nextProps) {
    return true;
  }

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
    let { userPhoto, name, address, gender, born_date } = this.state;
    let { nama, alamat, jenisKelamin, tanggalLahir, photo } = this.props.user;
    if (name && address && gender && born_date && userPhoto) {
      let userRef = db.collection('user').doc(this.props.user.id);
      if (
        name === nama &&
        address === alamat &&
        gender === jenisKelamin &&
        born_date === tanggalLahir &&
        userPhoto === photo
      ) {
        this.setState({ showWarning: true });
      } else {
        this.setState({ isSubmit: true, showWarning: false });
        userRef
          .get()
          .then(doc => {
            if (doc.exists) {
              userRef.update({
                nama: name,
                alamat: address,
                jenis_kelamin: gender,
                tanggal_lahir: born_date,
                photo: userPhoto,
              });
              AsyncStorage.setItem('_nama', name);
              AsyncStorage.setItem('_alamat', address);
              AsyncStorage.setItem('_jenisKelamin', gender);
              AsyncStorage.setItem('_tanggalLahir', born_date);
              AsyncStorage.setItem('_photo', userPhoto);
              this.props.getProfile();
              this.setState({
                isSubmit: false,
              });
              this.showToastMessage('Kamu berhasil mengubah data profil');
            } else {
              console.log('No such document!');
            }
          })
          .catch(error => {
            console.log(`Error searching user with id ${this.props.user.id} \n`, error);
          });
      }
    }
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
      gender,
      born_date,
      isNameValid,
      isAddressValid,
      isGenderValid,
      isDateValid,
      isNameChanged,
      isAddressChanged,
      isGenderChanged,
      isDateChanged,
      isSubmit,
      showWarning,
    } = this.state;

    return (
      <KeyboardAwareScrollView enableOnAndroid>
        <Header {...this.props} title="Edit Profil" />
        {isSubmit && <Loading />}
        {!isSubmit && (
          <Content padder>
            {/* {!isPhotoUploaded && <Image source={loginUser} style={styles.image} />} */}
            <Image source={{ uri: userPhoto }} style={styles.image} />
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
                <Input
                  value={address}
                  onChangeText={val => this.handleChangeField(val, 'address')}
                />
              </Item>
              {!isAddressValid &&
                isAddressChanged &&
                this.showErrorMessage('Alamat minimal 3 huruf')}
              {/* end of address */}
              <Picker
                selectedValue={gender}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) =>
                  this.handleChangeField(itemValue, 'gender')
                }>
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
              {!isDateChanged &&
                isDateValid &&
                this.showErrorMessage('Tanggal lahir harus dipilih')}
              {/* end of date */}
              {showWarning && (
                <View style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 12, color: 'red' }}>
                    Data masih sama dengan sebelumnya. Tidak ada perubahan.
                  </Text>
                </View>
              )}
              <Button block success style={styles.btn} onPress={this.handleSubmit}>
                <Text>Simpan</Text>
              </Button>
            </Form>
          </Content>
        )}
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

export default Authentication(EditProfileScreen);
