import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { View, Spinner } from 'native-base';

const { width, height } = Dimensions.get('window');

const Loading = () => (
  <View style={styles.spin}>
    <Spinner color="green" size="large" />
  </View>
);

const styles = StyleSheet.create({
  spin: {
    paddingVertical: 6,
    width: width * 0.25,
    height: height * 0.25,
    marginLeft: (width * 0.75) / 2,
    marginRight: (width * 0.75) / 2,
    marginTop: (height * 0.75) / 2,
    marginBottom: (height * 0.75) / 2,
  },
});

export default Loading;
