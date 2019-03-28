import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Container, Content, Text, View, Icon } from 'native-base';
import Authentication from '../../components/Authentication';
import Header from '../../components/PlainHeader';

const { width } = Dimensions.get('window');

const TermsAndConditionScreen = props => (
  <Container>
    <Header {...props} title="Syarat dan Ketentuan" />
    <Content style={styles.pageContainer}>
      {[...Array(2)].map((u, i) => (
        <View key={i} style={styles.listContainer}>
          <Text style={styles.listTitle}>Lorem Ipsum</Text>
          {[...Array(4)].map((r, j) => (
            <View key={j} style={styles.listChild}>
              <Icon name="radio-button-off" />
              <Text style={styles.listChildText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </Text>
            </View>
          ))}
        </View>
      ))}
    </Content>
  </Container>
);

const styles = StyleSheet.create({
  pageContainer: {
    padding: 10,
  },
  listContainer: {
    width: width - 20,
  },
  listTitle: {
    fontWeight: 'bold',
  },
  listChild: {
    marginLeft: 15,
  },
  listChildText: {
    marginLeft: 5,
  },
});

export default Authentication(TermsAndConditionScreen);
