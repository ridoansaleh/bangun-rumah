import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Button, Container, Content, Text, View } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';
import Authentication from '../../components/Authentication';
import Header from '../../components/PlainHeader';
import { db } from '../../../firebase.config';
import { urls } from '../../constant';

const { width, height } = Dimensions.get('window');

class ChangePasswordScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
  };

  render() {
    return (
      <Container>
        <Header {...this.props} title="Ganti Password" />
        <Content>
          <Text>Ubah Password</Text>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({});

export default Authentication(ChangePasswordScreen);
