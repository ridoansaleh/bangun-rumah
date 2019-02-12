import React, { Component } from 'react';
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
  handleRouteChange = url => {
    this.props.navigation.navigate(url);
  };

  render() {
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
            <Item floatingLabel>
              <Label>Nama</Label>
              <Input />
            </Item>
            <Item floatingLabel>
              <Label>Alamat</Label>
              <Input />
            </Item>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input />
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input secureTextEntry />
            </Item>
            <Picker
              selectedValue={'Laki-Laki'}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => this.setState({ language: itemValue })}>
              <Picker.Item label="Laki-Laki" value="Laki-Laki" />
              <Picker.Item label="Perempuan" value="Perempuan" />
            </Picker>
            <DatePicker
              style={styles.date}
              //   date={'2019-02-12'}
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
              //   onDateChange={date => this.handleChangeDate(date)}
            />
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
});

export default RegisterView;
