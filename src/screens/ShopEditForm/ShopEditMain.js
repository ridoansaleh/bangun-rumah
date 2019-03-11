import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, Image, TextInput } from 'react-native';
import {
  Container,
  Content,
  Header,
  Icon,
  Left,
  Body,
  Right,
  Title,
  Button,
  Form,
  Item,
  Input,
  Text,
  Label,
  View,
  Toast,
  Spinner,
} from 'native-base';
import { ImagePicker } from 'expo';
import uuid from 'uuid';
import Authentication from '../../components/Authentication';
import defaultImage from '../../../assets/default-product.jpg';
import { st as storageRef, db } from '../../../firebase.config';
import { urls } from '../../constant';

const { width, height } = Dimensions.get('window');

class ShopEditScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
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

  componentDidMount() {
    const shopId = this.props.nav.navigation.getParam('id', null);
    this.getShopData(shopId);
  }

  getShopData = id => {
    db.collection('toko')
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          let data = doc.data();
          this.setState({
            shopImage: data.photo,
            isPhotoUploaded: true,
            name: data.nama,
            address: data.alamat,
            description: data.deskripsi,
          });
        } else {
          console.log('No such document!');
        }
      })
      .catch(function(error) {
        console.log(`Error getting shop data with id ${id} \n`, error);
      });
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
      if (!pickerResult.cancelled) {
        const uploadUrl = await this.uploadImageAsync(pickerResult.uri);
        this.setState({ shopImage: uploadUrl, isPhotoUploaded: true });
      }
    } catch (e) {
      console.log(e);
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
    const shopId = this.props.nav.navigation.getParam('id', null);
    let docRef = db.collection('toko').doc(shopId);
    this.setState({ isLoading: true });
    docRef
      .get()
      .then(doc => {
        if (doc.exists) {
          docRef.update({
            nama: name,
            alamat: address,
            deskripsi: description,
            photo: shopImage,
          });
          console.log('Shop successfully edited!');
          this.setState({ isLoading: false });
          this.showToastMessage('Kamu berhasil mengubah data Toko');
          setTimeout(() => {
            this.props.nav.navigation.navigate(urls.shop);
          }, 1000);
        } else {
          console.log('No such document!');
        }
      })
      .catch(error => {
        console.error(`Error searching shop with id ${shopId} \n`, error);
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
      <Container>
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => this.props.nav.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Edit Toko</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          {this.state.isLoading && (
            <View style={styles.spin}>
              <Spinner color="green" size="large" />
            </View>
          )}
          {!this.state.isLoading && (
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
                  <Input
                    value={address}
                    onChangeText={val => this.handleChangeField(val, 'address')}
                  />
                </Item>
                {!isAddressValid &&
                  isAddressChanged &&
                  this.showErrorMessage('Alamat minimal 3 huruf')}
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
                    <Text>Simpan</Text>
                  </Button>
                )}
                {!this.validateForm() && (
                  <Button block disabled style={styles.btn}>
                    <Text>Simpan</Text>
                  </Button>
                )}
              </Form>
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
  },
  spin: {
    paddingVertical: 6,
    width: width * 0.25,
    height: height * 0.25,
    marginLeft: (width * 0.75) / 2,
    marginRight: (width * 0.75) / 2,
    marginTop: (height * 0.75) / 2,
    marginBottom: (height * 0.75) / 2,
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

export default Authentication(ShopEditScreen);
