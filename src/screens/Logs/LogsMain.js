import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, AsyncStorage, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
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
import Authentication from '../../components/Authentication';
import loginUser from '../../../assets/login-user.jpg';
import { auth as authenticate, db } from '../../../firebase.config';
import { urls } from '../../constant';

const { width, height } = Dimensions.get('window');
// Forgot password link is not ready yet

class LogScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
  };

  render() {
    return (
      <Container>
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => this.props.nav.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Logs</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Text>Logs User</Text>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
  },
});

export default Authentication(LogScreen);
