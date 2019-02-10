import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Content } from 'native-base';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

class HomeScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  };

  render() {
    return (
      <Container>
        <Header openDrawer={() => this.props.navigation.openDrawer()} />
        <Content />
        <Footer />
      </Container>
    );
  }
}

export default HomeScreen;
