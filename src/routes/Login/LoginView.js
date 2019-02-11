import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image, Dimensions } from 'react-native';
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
  View,
  Form,
  Item,
  Input,
  Label,
} from 'native-base';
const loginUser = require('../../../assets/login-user.jpg');

const { width } = Dimensions.get('window');

class LoginView extends Component {
  static propTypes = {
    openDrawer: PropTypes.func,
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
        <Content padder contentContainerStyle={styles.wrapper}>
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
          </Form>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
  },
  wrapper: {
    alignItems: 'center',
    height: 300,
  },
  image: {
    width: width * 0.25,
    height: width * 0.25,
  },
});

export default LoginView;
