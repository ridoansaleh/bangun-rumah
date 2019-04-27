import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Picker, Image, TextInput } from 'react-native';
import { Button, Content, Form, Item, Input, Text, Label, View, Toast } from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { ImagePicker } from 'expo';
import Loading from '../../../../components/Loading';
import styles from './Styles';
import loginUser from '../../../../../assets/default_upload.png';
import { st as storageRef, db } from '../../../../../firebase.config';
import AllCategory from '../../../Category/Data';
import initialState from './State';
import { urls } from '../../../../constant';
import { uploadImageAsync, width } from '../../../../utils';

class EditForm extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    productId: PropTypes.string,
  };

  state = {
    ...initialState,
  };

  componentDidMount() {
    this.getCategoriesData();
    this.getDataProduct(this.props.productId);
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

  validateForm = () => {
    let { name, category, price, unit, stock, description, specs, prevValues } = this.state;
    if (name && category && price && unit && stock && description && specs) {
      if (
        prevValues.name !== name ||
        prevValues.category !== category ||
        prevValues.price !== price ||
        prevValues.unit !== unit ||
        prevValues.stock !== stock ||
        prevValues.description !== description ||
        prevValues.specs !== specs
      ) {
        return true;
      }
      return false;
    }
    return false;
  };

  deletePhoto = (photo, specialAction) => {
    let photoRef = storageRef.child(this.state[photo + 'Ref']);
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
        let tempPhoto = [];
        let tempRefs = [];
        let lastCharacter = parseInt(photo.charAt(5), 10);
        tempPhoto = this.state.allPhotos;
        tempPhoto.splice(lastCharacter - 1, 1);
        tempRefs = this.state.allPhotoRefs;
        tempRefs.splice(lastCharacter - 1, 1);
        let docRef = db.collection('produk').doc(this.props.productId);
        docRef
          .get()
          .then(doc => {
            if (doc.exists) {
              docRef.update({
                photo_produk: tempPhoto,
                photo_refs: tempRefs,
              });
              console.log('Images successfully edited!');
              this.setState(
                {
                  [photo]: '',
                  [photo + 'Ref']: '',
                  [status]: false,
                },
                () => {
                  if (specialAction) {
                    const uploadImage = async () => {
                      let result = await ImagePicker.launchImageLibraryAsync({
                        allowsEditing: false,
                        aspect: [4, 3],
                      });
                      if (!result.cancelled) {
                        this.handleImagePicked(photo, status, result);
                      }
                    };
                    uploadImage();
                  }
                }
              );
            } else {
              console.log('No such document!');
            }
          })
          .catch(error => {
            console.error(`Error searching product with id ${this.props.productId} \n`, error);
          });
      })
      .catch(error => {
        console.error('Error deleting image \n', error);
      });
  };

  savePhoto = photo => {
    let tempPhoto = [];
    let tempRefs = [];
    this.setState(
      {
        allPhotos: [...this.state.allPhotos, this.state[photo]],
        allPhotoRefs: [...this.state.allPhotoRefs, this.state[photo + 'Ref']],
      },
      () => {
        tempPhoto = this.state.allPhotos;
        tempRefs = this.state.allPhotoRefs;
        let docRef = db.collection('produk').doc(this.props.productId);
        docRef
          .get()
          .then(doc => {
            if (doc.exists) {
              docRef.update({
                photo_produk: tempPhoto,
                photo_refs: tempRefs,
              });
              console.log('Images successfully saved!');
            } else {
              console.log('No such document!');
            }
          })
          .catch(error => {
            console.error(`Error searching product with id ${this.props.productId} \n`, error);
          });
      }
    );
  };

  choosePhoto = async (field, status) => {
    if (this.state[field]) {
      if (field === 'photo1') {
        this.deletePhoto(field, 1);
      } else {
        Alert.alert(
          'Peringatan',
          'Apakah Anda yakin ingin menghapus photo ini ?',
          [{ text: 'OK', onPress: () => this.deletePhoto(field) }],
          { cancelable: true }
        );
      }
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

  handleImagePicked = async (field, status, pickerResult) => {
    try {
      if (!pickerResult.cancelled) {
        const { download_url, image_ref } = await uploadImageAsync(pickerResult.uri);
        this.setState(
          {
            [field]: download_url,
            [field + 'Ref']: image_ref,
            [status]: true,
          },
          () => {
            this.savePhoto(field);
          }
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  handleEditProduct = () => {
    let { name, category, price, unit, stock, description, specs } = this.state;
    this.setState({ isSpinnerLoading: true });
    let docRef = db.collection('produk').doc(this.props.productId);
    docRef
      .get()
      .then(doc => {
        if (doc.exists) {
          docRef.update({
            nama: name,
            kategori: category,
            harga: price,
            satuan: unit,
            stok: stock,
            deskripsi: description,
            spesifikasi: specs,
          });
          console.log('Product successfully edited!');
          this.setState({ ...initialState, isSpinnerLoading: false });
          this.showToastMessage('Kamu berhasil mengubah data produk');
          setTimeout(() => {
            this.props.navigation.navigate(urls.shop, {
              add_product_succeed: true,
            });
          }, 1500);
        } else {
          console.log('No such document!');
        }
      })
      .catch(error => {
        console.error(`Error searching product with id ${this.props.productId} \n`, error);
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
                    <Text style={{ fontSize: 12 }}>{photo1 ? 'Ganti' : 'Upload'}</Text>
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
                <Button block success style={styles.btn} onPress={this.handleEditProduct}>
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

export default EditForm;
