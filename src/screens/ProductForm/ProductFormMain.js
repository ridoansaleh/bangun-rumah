import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, StyleSheet, Dimensions, Picker, Image, TextInput } from 'react-native';
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
  Spinner,
  View,
  Toast,
} from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImagePicker } from 'expo';
import uuid from 'uuid';
import Authentication from '../../components/Authentication';
import loginUser from '../../../assets/default_upload.png';
import { st as storageRef, fbs, db } from '../../../firebase.config';
import AllCategory from '../Category/Data';
import initialState from './State';
import { urls } from '../../constant';

const { width, height } = Dimensions.get('window');

class ProductFormScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  };

  state = {
    ...initialState,
  };

  componentDidMount() {
    let product_id = this.props.nav.navigation.getParam('product_id', 0);
    if (product_id !== 0) {
      this.getDataProduct(product_id);
    }
    this.getCategoriesData();
  }

  getDataProduct = id => {
    db.collection('produk')
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          const data = doc.data();
          const photos = data.photo_produk;
          const photoRefs = data.photo_refs;

          let state = {
            allPhotos: photos,
            allPhotoRefs: photoRefs,
            name: data.nama,
            category: data.kategori,
            price: data.harga,
            unit: data.satuan,
            stock: data.stok,
            description: data.deskripsi,
            specs: data.spesifikasi,
            isNameValid: true,
            isCategoryValid: true,
            isPriceValid: true,
            isUnitValid: true,
            isStockValid: true,
            isDescriptionValid: true,
            isSpecsValid: true,
            isNameChanged: true,
            isCategoryChanged: true,
            isPriceChanged: true,
            isUnitChanged: true,
            isStockChanged: true,
            isDescriptionChanged: true,
            isSpecsChanged: true,
          };
          if (photos.length === 1) {
            state.photo1 = photos[0];
            state.photo1Ref = photoRefs[0];
            state.isPhotoOneUploaded = true;
          } else if (photos.length === 2) {
            state.photo1 = photos[0];
            state.photo2 = photos[1];
            state.photo1Ref = photoRefs[0];
            state.photo2Ref = photoRefs[1];
            state.isPhotoOneUploaded = true;
            state.isPhotoTwoUploaded = true;
          } else if (photos.length === 3) {
            state.photo1 = photos[0];
            state.photo2 = photos[1];
            state.photo3 = photos[2];
            state.photo1Ref = photoRefs[0];
            state.photo2Ref = photoRefs[1];
            state.photo3Ref = photoRefs[2];
            state.isPhotoOneUploaded = true;
            state.isPhotoTwoUploaded = true;
            state.isPhotoThreeUploaded = true;
          }
          this.setState({
            ...state,
            prevValues: state,
          });
        } else {
          console.log('No such document!');
        }
      })
      .catch(error => {
        console.error(`Error getting product with id ${id} \n`, error);
      });
  };

  getCategoriesData = () => {
    let data = AllCategory.filter(data => data.status !== 'main');
    data.unshift({
      name: 'Pilih Kategori',
      status: 'default',
    });
    this.setState({
      categories: data,
    });
  };

  handleChangeField = (val, name) => {
    if (name === 'name') {
      if (val.length >= 10) {
        if (/^[a-zA-Z\ ]+$/.test(val)) {
          this.setState({ name: val, isNameValid: true, isNameChanged: true });
        } else {
          this.setState({ name: val, isNameValid: false, isNameChanged: true });
        }
      } else {
        this.setState({ name: val, isNameValid: false, isNameChanged: true });
      }
    } else if (name === 'category') {
      if (val) {
        this.setState({ category: val, isCategoryValid: true, isCategoryChanged: true });
      } else {
        this.setState({ category: val, isCategoryValid: false, isCategoryChanged: true });
      }
    } else if (name === 'price') {
      if (/^[0-9]+$/.test(val)) {
        this.setState({ price: val, isPriceValid: true, isPriceChanged: true });
      } else {
        this.setState({ price: val, isPriceValid: false, isPriceChanged: true });
      }
    } else if (name === 'unit') {
      if (val) {
        this.setState({ unit: val, isUnitValid: true, isUnitChanged: true });
      } else {
        this.setState({ unit: val, isUnitValid: false, isUnitChanged: true });
      }
    } else if (name === 'stock') {
      if (/^[0-9]+$/.test(val)) {
        this.setState({ stock: val, isStockValid: true, isStockChanged: true });
      } else {
        this.setState({ stock: val, isStockValid: false, isStockChanged: true });
      }
    } else if (name === 'description') {
      if (val.length >= 10) {
        this.setState({ description: val, isDescriptionValid: true, isDescriptionChanged: true });
      } else {
        this.setState({ description: val, isDescriptionValid: false, isDescriptionChanged: true });
      }
    } else if (name === 'specs') {
      if (val) {
        this.setState({ specs: val, isSpecsValid: true, isSpecsChanged: true });
      } else {
        this.setState({ specs: val, isSpecsValid: false, isSpecsChanged: true });
      }
    }
  };

  validatePhoto = () => {
    let { photo1, photo2, photo3 } = this.state;
    if (photo1 || photo2 || photo3) {
      return true;
    }
    return false;
  };

  validateForm = () => {
    let { name, category, price, unit, stock, description, specs } = this.state;
    if (
      this.validatePhoto() &&
      name &&
      category &&
      price &&
      unit &&
      stock &&
      description &&
      specs
    ) {
      return true;
    }
    return false;
  };

  deletePhoto = photo => {
    let myRef = fbs.ref();
    let photoRef = myRef.child(this.state[photo + 'Ref']);
    photoRef
      .delete()
      .then(() => {
        console.log('Succeed deleted the photo');
        let status = 'isPhotoOneUploaded';
        if (photo === 'photo2') {
          status = 'isPhotoTwoUploaded';
        } else if (photo === 'photo3') {
          status = 'isPhotoThreeUploaded';
        }
        const productId = this.props.nav.navigation.getParam('product_id', 0);
        let tempPhoto = [];
        let tempRefs = [];
        let lastCharacter = parseInt(photo.charAt(5), 10);
        tempPhoto = this.state.allPhotos.splice(lastCharacter - 1, 1);
        tempRefs = this.state.allPhotoRefs.splice(lastCharacter - 1, 1);
        let docRef = db.collection('produk').doc(productId);
        docRef
          .get()
          .then(doc => {
            if (doc.exists) {
              docRef.update({
                photo_produk: tempPhoto,
                photo_refs: tempRefs,
              });
              console.log('Document successfully edited!');
              this.setState({
                [photo]: '',
                [photo + 'Ref']: '',
                [status]: false,
              });
            } else {
              console.log('No such document!');
            }
          })
          .catch(error => {
            console.error(`Error searching review with id ${productId} \n`, error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  };

  choosePhoto = async (field, status) => {
    if (this.state[field]) {
      Alert.alert(
        'Peringatan',
        'Apakah Anda yakin ingin menghapus photo ini ?',
        [{ text: 'OK', onPress: () => this.deletePhoto(field) }],
        { cancelable: true }
      );
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        aspect: [4, 3],
      });
      if (!result.cancelled) {
        this.handleImagePicked(field, status, result);
      }
    }
  };

  handleImagePicked = async (f, s, pickerResult) => {
    try {
      // this.setState({ uploading: true });
      if (!pickerResult.cancelled) {
        const result = await this.uploadImageAsync(pickerResult.uri, f);
        this.setState({
          [f]: result,
          // [f + 'Ref']: result.fileRef,
          [s]: true,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      // this.setState({ uploading: false });
    }
  };

  uploadImageAsync = async (uri, f) => {
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

    const u_id = uuid.v4();

    const ref = storageRef.child(u_id);

    this.setState({
      [f + 'Ref']: u_id,
    });

    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  handleSubmit = () => {
    let {
      photo1,
      photo2,
      photo3,
      photo1Ref,
      photo2Ref,
      photo3Ref,
      name,
      category,
      price,
      unit,
      stock,
      description,
      specs,
      prevValues,
    } = this.state;

    let allPhotos = [];
    let allPhotoRefs = [];
    if (photo1) {
      allPhotos.push(photo1);
      allPhotoRefs.push(photo1Ref);
    }
    if (photo2) {
      allPhotos.push(photo2);
      allPhotoRefs.push(photo2Ref);
    }
    if (photo3) {
      allPhotos.push(photo3);
      allPhotoRefs.push(photo3Ref);
    }
    let shopId = this.props.nav.navigation.getParam('shop_id', 0);
    let shopName = this.props.nav.navigation.getParam('shop_name', null);

    const productId = this.props.nav.navigation.getParam('product_id', 0);

    if (!productId) {
      this.setState({ isSpinnerLoading: true });
      db.collection('produk')
        .add({
          id_toko: shopId,
          nama_toko: shopName,
          bintang: 0,
          dibeli: 0,
          tanggal_posting: new Date(),
          nama: name,
          photo_produk: allPhotos,
          photo_refs: allPhotoRefs,
          kategori: category,
          harga: price,
          satuan: unit,
          stok: stock,
          deskripsi: description,
          spesifikasi: specs,
        })
        .then(docRef => {
          console.log('Document successfully written with id ', docRef.id);
          this.setState({ ...initialState, isSpinnerLoading: false });
          this.showToastMessage('Kamu berhasil menambahkan produk baru');
          setTimeout(() => {
            this.props.nav.navigation.navigate(urls.shop, {
              add_product_succeed: true,
            });
          }, 1500);
        })
        .catch(error => {
          console.error('Error writing document: ', error);
        });
    } else {
      if (
        (prevValues.photo1 !== undefined && prevValues.photo1 !== photo1) ||
        (prevValues.photo2 !== undefined && prevValues.photo2 !== photo2) ||
        (prevValues.photo3 !== undefined && prevValues.photo3 !== photo3) ||
        prevValues.name !== name ||
        prevValues.category !== category ||
        prevValues.price !== price ||
        prevValues.unit !== unit ||
        prevValues.stock !== stock ||
        prevValues.description !== description ||
        prevValues.specs !== specs
      ) {
        this.setState({ isSpinnerLoading: true });
        let docRef = db.collection('produk').doc(productId);
        docRef
          .get()
          .then(doc => {
            if (doc.exists) {
              docRef.update({
                nama_toko: shopName,
                nama: name,
                photo_produk: allPhotos,
                photo_refs: allPhotoRefs,
                kategori: category,
                harga: price,
                satuan: unit,
                stok: stock,
                deskripsi: description,
                spesifikasi: specs,
              });
              console.log('Document successfully edited!');
              this.setState({ ...initialState, isSpinnerLoading: false });
              this.showToastMessage('Kamu berhasil mengubah produk');
              setTimeout(() => {
                this.props.nav.navigation.navigate(urls.shop, {
                  add_product_succeed: true,
                });
              }, 1500);
            } else {
              console.log('No such document!');
            }
          })
          .catch(error => {
            console.error(`Error searching review with id ${productId} \n`, error);
          });
      } else {
        Alert.alert(
          'Peringatan',
          'Data masih sama dengan sebelumnya. Tidak ada perubahan.',
          [{ text: 'OK', onPress: () => console.log('Close the dialog') }],
          { cancelable: true }
        );
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
      isSpinnerLoading,
      photo1,
      photo2,
      photo3,
      isPhotoOneUploaded,
      isPhotoTwoUploaded,
      isPhotoThreeUploaded,
      name,
      category,
      price,
      unit,
      stock,
      description,
      specs,
      isNameValid,
      isCategoryValid,
      isPriceValid,
      isUnitValid,
      isStockValid,
      isDescriptionValid,
      isSpecsValid,
      isNameChanged,
      isCategoryChanged,
      isPriceChanged,
      isUnitChanged,
      isStockChanged,
      isDescriptionChanged,
      isSpecsChanged,
    } = this.state;

    return (
      <KeyboardAwareScrollView enableOnAndroid>
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => this.props.nav.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Produk Baru</Title>
          </Body>
          <Right />
        </Header>
        {isSpinnerLoading && (
          <Content>
            <View style={styles.spin}>
              <Spinner color="green" size="large" />
            </View>
          </Content>
        )}
        {!isSpinnerLoading && (
          <Content style={{ padding: 10 }}>
            <Grid style={{ width: width - 20 }}>
              <Row>
                <Col style={{ margin: 5, alignItems: 'center' }}>
                  {!isPhotoOneUploaded && <Image source={loginUser} style={styles.image} />}
                  {isPhotoOneUploaded && <Image source={{ uri: photo1 }} style={styles.image} />}
                  <Button
                    small
                    bordered
                    dark
                    style={styles.upload}
                    onPress={() => this.choosePhoto('photo1', 'isPhotoOneUploaded')}>
                    <Text style={{ fontSize: 12 }}>{photo1 ? 'Hapus' : 'Upload'}</Text>
                  </Button>
                </Col>
                <Col style={{ margin: 5 }}>
                  {!isPhotoTwoUploaded && <Image source={loginUser} style={styles.image} />}
                  {isPhotoTwoUploaded && <Image source={{ uri: photo2 }} style={styles.image} />}
                  <Button
                    small
                    bordered
                    dark
                    disabled={photo1 === ''}
                    style={styles.upload}
                    onPress={() => this.choosePhoto('photo2', 'isPhotoTwoUploaded')}>
                    <Text style={{ fontSize: 12 }}>{photo2 ? 'Hapus' : 'Upload'}</Text>
                  </Button>
                </Col>
                <Col style={{ margin: 5 }}>
                  {!isPhotoThreeUploaded && <Image source={loginUser} style={styles.image} />}
                  {isPhotoThreeUploaded && <Image source={{ uri: photo3 }} style={styles.image} />}
                  <Button
                    small
                    bordered
                    dark
                    disabled={photo2 === ''}
                    style={styles.upload}
                    onPress={() => this.choosePhoto('photo3', 'isPhotoThreeUploaded')}>
                    <Text style={{ fontSize: 12 }}>{photo3 ? 'Hapus' : 'Upload'}</Text>
                  </Button>
                </Col>
              </Row>
            </Grid>
            <Form>
              <Item floatingLabel error={!!(isNameChanged && !isNameValid)}>
                <Label>Nama</Label>
                <Input value={name} onChangeText={val => this.handleChangeField(val, 'name')} />
              </Item>
              {!isNameValid &&
                isNameChanged &&
                this.showErrorMessage('Tidak boleh angka atau karakter spesial (min. 10 huruf)')}
              {/* end of name */}
              <Text style={styles.customLabel}>Kategori</Text>
              <Picker
                selectedValue={category}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) =>
                  this.handleChangeField(itemValue, 'category')
                }>
                {this.state.categories.map((data, i) => {
                  return (
                    <Picker.Item
                      key={i}
                      label={data.name}
                      value={data.name !== 'Pilih Kategori' ? data.name : ''}
                    />
                  );
                })}
              </Picker>
              {!isCategoryValid &&
                isCategoryChanged &&
                this.showErrorMessage('Silahkan pilih kategori')}
              {/* end of category */}
              <Item
                floatingLabel
                error={!!(isPriceChanged && !isPriceValid)}
                style={{ marginTop: 15 }}>
                <Label>Harga</Label>
                <Input value={price} onChangeText={val => this.handleChangeField(val, 'price')} />
              </Item>
              {!isPriceValid &&
                isPriceChanged &&
                this.showErrorMessage('Hanya diperbolehkan angka')}
              {/* end of price */}
              <Text style={styles.customLabel}>Satuan</Text>
              <Picker
                selectedValue={unit}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => this.handleChangeField(itemValue, 'unit')}>
                <Picker.Item label={'Pilih Satuan'} value={''} />
                <Picker.Item label={'Lusin'} value={'Lusin'} />
                <Picker.Item label={'Kg'} value={'Kg'} />
                <Picker.Item label={'Karung'} value={'Karung'} />
                <Picker.Item label={'Buah'} value={'Buah'} />
              </Picker>
              {!isUnitValid && isUnitChanged && this.showErrorMessage('Silahkan pilih satuan')}
              {/* end of unit */}
              <Item
                floatingLabel
                error={!!(isStockChanged && !isStockValid)}
                style={{ marginTop: 15 }}>
                <Label>Stok</Label>
                <Input value={stock} onChangeText={val => this.handleChangeField(val, 'stock')} />
              </Item>
              {!isStockValid &&
                isStockChanged &&
                this.showErrorMessage('Hanya diperbolehkan angka')}
              {/* end of stock */}
              <Text style={styles.customLabel}>Deskripsi</Text>
              <TextInput
                multiline
                numberOfLines={4}
                onChangeText={val => this.handleChangeField(val, 'description')}
                value={description}
                placeholder={'Deskripsi'}
                style={styles.textArea}
              />
              {!isDescriptionValid &&
                isDescriptionChanged &&
                this.showErrorMessage('Tidak boleh kurang dari 10 karakter')}
              {/* end of description */}
              <Text style={styles.customLabel}>Spesifikasi</Text>
              <TextInput
                multiline
                numberOfLines={4}
                onChangeText={val => this.handleChangeField(val, 'specs')}
                value={specs}
                placeholder={'Spesifikasi'}
                style={styles.textArea}
              />
              <Text style={{ fontSize: 12, fontStyle: 'italic', marginLeft: 15 }}>
                *Pisah dengan koma
              </Text>
              {!isSpecsValid &&
                isSpecsChanged &&
                this.showErrorMessage('Tidak boleh kurang dari 15 karakter')}
              {/* end of specs */}
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
          </Content>
        )}
      </KeyboardAwareScrollView>
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

export default Authentication(ProductFormScreen);
