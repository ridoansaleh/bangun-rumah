import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Header, Button, Body, Title, Icon, Left } from 'native-base';

const PlainHeader = props => (
  <Header style={styles.header}>
    <Left>
      <Button transparent onPress={() => props.nav.navigation.goBack()}>
        <Icon name="arrow-back" />
      </Button>
    </Left>
    <Body>
      <Title>Review</Title>
    </Body>
  </Header>
);

PlainHeader.propTypes = {
  nav: PropTypes.object,
  title: PropTypes.string,
};

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
  },
});

export default PlainHeader;
