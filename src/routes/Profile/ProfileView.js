import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Content, Text } from 'native-base';
import { Row, Grid } from 'react-native-easy-grid';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Authentication from '../../components/Authentication';

class ProfileScreen extends Component {
  render() {
    return (
      <Container>
        <Header openDrawer={() => this.props.nav.navigation.openDrawer()} />
        <Content>
          <Text>Profile Dashboard</Text>
        </Content>
        <Footer />
      </Container>
    );
  }
}

export default Authentication(ProfileScreen);
