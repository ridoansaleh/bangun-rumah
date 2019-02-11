import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import {
  Button,
  Container,
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
import { Grid, Col } from 'react-native-easy-grid';
const loginUser = require('../../../assets/login-user.jpg');

const { width, height } = Dimensions.get('window');
// Forgot password link is not ready yet

class LoginView extends Component {
  static propTypes = {
    openDrawer: PropTypes.func,
  };

  handleRouteChange = url => {
    this.props.navigation.navigate(url);
  };

  render() {
    console.log('props : ', this.props);
    return (
      <Container>
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Login</Title>
          </Body>
          <Right />
        </Header>
        <Content padder style={styles.contentContainer}>
          <Image source={loginUser} style={styles.image} />
          <Form>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input />
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input />
            </Item>
            <Grid style={styles.btnBox}>
              <Col style={styles.block}>
                <Button
                  danger
                  style={styles.btn}
                  onPress={() => this.handleRouteChange('Register')}>
                  <Text>Daftar</Text>
                </Button>
              </Col>
              <Col style={styles.block}>
                <Button success style={styles.btn}>
                  <Text>Login</Text>
                </Button>
              </Col>
            </Grid>
          </Form>
          <View style={styles.forgotPassword}>
            <Text>Anda lupa password? Klik di </Text>
            <TouchableOpacity onPress={() => this.handleRouteChange('Home')}>
              <Text>sini</Text>
            </TouchableOpacity>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
  },
  contentContainer: {
    marginTop: height * 0.1,
  },
  image: {
    width: width * 0.25,
    height: width * 0.25,
    marginLeft: (width * 0.75) / 2,
    marginRight: (width * 0.75) / 2,
  },
  btnBox: {
    marginTop: 30,
  },
  block: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    width: width * 0.4,
    justifyContent: 'center',
  },
  forgotPassword: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default LoginView;
