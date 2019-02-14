import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Authentication from '../../components/Authentication';

class CategoryScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Category Screen</Text>
      </View>
    );
  }
}

export default Authentication(CategoryScreen);
