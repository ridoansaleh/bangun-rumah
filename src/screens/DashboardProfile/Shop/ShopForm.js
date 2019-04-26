import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, Image, TextInput } from 'react-native';
import { Button, Form, Item, Input, Text, Label, View, Toast } from 'native-base';
import { ImagePicker } from 'expo';
import uuid from 'uuid';
import defaultImage from '../../../../assets/default-product.jpg';
import { st as storageRef, db } from '../../../../firebase.config';

const { width, height } = Dimensions.get('window');

class ShopForm extends Component {
  static propTypes = {
    nav: PropTypes.object,
    checkUserHaveShop: PropTypes.func,
    setLoading: PropTypes.func,
  };

  state = {
    shopImage: '',
    isPhotoUploaded: false,
    name: '',
    address: '',
    description: '',
    isNameValid: false,
    isAddressValid: false,
    isDescriptionValid: false,
    isNameChanged: false,
    isAddressChanged: false,
    isDescriptionChanged: false,
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
    } else if (name === 'description') {
      if (val.length >= 15) {
        this.setState({ description: val, isDescriptionValid: true, isDescriptionChanged: true });
      } else {
        this.setState({ description: val, isDescriptionValid: false, isDescriptionChanged: true });
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
        const uploadUrl = await this.uploadImageAsync(pickerResult.uri);
        this.setState({ shopImage: uploadUrl, isPhotoUploaded: true });
      }
    } catch (e) {
      console.log(e);
    } finally {
      // this.setState({ uploading: false });
    }
  };

  uploadImageAsync = async uri => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const ref = storageRef.child(uuid.v4());
    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  handleSubmit = () => {
    let { shopImage, name, address, description } = this.state;
    this.props.setLoading(false);
    db.collection('toko')
      .add({
        id_user: this.props.user.id,
        nama: name,
        alamat: address,
        deskripsi: description,
        photo: shopImage,
      })
      .then(docRef => {
        console.log('Document written with ID: ', docRef.id);
        this.props.setLoading(true);
        this.showToastMessage('Kamu berhasil membuat Toko baru');
        setTimeout(() => {
          this.props.checkUserHaveShop();
        }, 1000);
      })
      .catch(error => {
        console.error('Error adding document: ', error);
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

  validateForm = () => {
    const { isPhotoUploaded, isNameValid, isAddressValid, isDescriptionValid } = this.state;
    if (isPhotoUploaded && isNameValid && isAddressValid && isDescriptionValid) {
      return true;
    }
    return false;
  };

  render() {
    const {
      shopImage,
      isPhotoUploaded,
      name,
      address,
      description,
      isNameValid,
      isAddressValid,
      isDescriptionValid,
      isNameChanged,
      isAddressChanged,
      isDescriptionChanged,
    } = this.state;

    return (
      <View>
        {!isPhotoUploaded && <Image source={defaultImage} style={styles.image} />}
        {isPhotoUploaded && <Image source={{ uri: shopImage }} style={styles.image} />}
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
          <Item>
            <TextInput
              multiline
              numberOfLines={4}
              onChangeText={val => this.handleChangeField(val, 'description')}
              value={description}
              placeholder={'Deskripsi Toko Anda'}
              style={styles.description}
            />
          </Item>
          {!isDescriptionValid &&
            isDescriptionChanged &&
            this.showErrorMessage('Deskripsi minimal terdiri dari 15 karakter')}
          {/* end of description */}
          {this.validateForm() && (
            <Button block success style={styles.btn} onPress={this.handleSubmit}>
              <Text>Buat Toko</Text>
            </Button>
          )}
          {!this.validateForm() && (
            <Button block disabled style={styles.btn}>
              <Text>Buat Toko</Text>
            </Button>
          )}
        </Form>
      </View>
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
  description: {
    marginTop: 30,
    borderColor: 'black',
    borderWidth: 1,
    width: 0.95 * width,
    padding: 5,
  },
  btn: {
    marginTop: 30,
    width: 0.95 * width,
    marginLeft: 0.025 * width,
    marginRight: 0.025 * width,
  },
  errorBox: {
    borderBottomWidth: 0,
  },
  errorMessage: {
    fontSize: 12,
    color: '#FF5733',
  },
});

export default ShopForm;
