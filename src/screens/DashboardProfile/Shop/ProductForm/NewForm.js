import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Dimensions, Picker, Image, TextInput } from 'react-native';
import { Button, Content, Form, Item, Input, Text, Label, View, Toast } from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { ImagePicker } from 'expo';
import uuid from 'uuid';
import Loading from '../../../../components/Loading';
import styles from './Styles';
import loginUser from '../../../../../assets/default_upload.png';
import { st as storageRef, fbs, db } from '../../../../../firebase.config';
import AllCategory from '../../../Category/Data';
import initialState from './State';
import { urls } from '../../../../constant';

const { width } = Dimensions.get('window');

class NewForm extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  };

  state = {
    ...initialState,
  };

  componentDidMount() {
    this.getCategoriesData();
  }

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
        this.setState({
          [photo]: '',
          [photo + 'Ref']: '',
          [status]: false,
        });
      })
      .catch(error => {
        console.error('Error deleting image from storage \n', error);
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
      if (!pickerResult.cancelled) {
        const result = await this.uploadImageAsync(pickerResult.uri, f);
        this.setState({
          [f]: result,
          [s]: true,
        });
      }
    } catch (e) {
      console.log(e);
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
    const snapshot = await ref.put(blob);
    blob.close();
    this.setState({
      [f + 'Ref']: u_id,
    });
    return await snapshot.ref.getDownloadURL();
  };

  handleSaveProduct = () => {
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
    let shopId = this.props.navigation.getParam('shop_id', 0);
    let shopName = this.props.navigation.getParam('shop_name', null);

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
        console.log('Product successfully saved with id ', docRef.id);
        this.setState({ ...initialState, isSpinnerLoading: false });
        this.showToastMessage('Kamu berhasil menambahkan produk baru');
        setTimeout(() => {
          this.props.navigation.navigate(urls.shop, {
            add_product_succeed: true,
          });
        }, 1500);
      })
      .catch(error => {
        console.error('Error saving product \n', error);
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
      <View>
        {isSpinnerLoading && (
          <Content>
            <Loading />
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
                <Button block success style={styles.btn} onPress={this.handleSaveProduct}>
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
      </View>
    );
  }
}

export default NewForm;
