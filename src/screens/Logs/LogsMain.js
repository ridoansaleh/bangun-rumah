import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions } from 'react-native';
import { Button, Container, Content, Text, View } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';
import Authentication from '../../components/Authentication';
import Header from '../../components/PlainHeader';
import loginUser from '../../../assets/login-user.jpg';
import { auth as authenticate, db } from '../../../firebase.config';
import { urls } from '../../constant';

const { width, height } = Dimensions.get('window');

class LogScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
  };

  render() {
    return (
      <Container>
        <Header {...this.props} title="Logs" />
        <Content>
          <Text>Logs User</Text>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({});

export default Authentication(LogScreen);
