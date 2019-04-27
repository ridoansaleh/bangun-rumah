import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, Text, View } from 'native-base';
import Authentication from '../../../components/Authentication';
import Header from '../../../components/PlainHeader';
import { width } from '../../../utils';

const FAQScreen = props => (
  <Container>
    <Header {...props} title="Syarat dan Ketentuan" />
    <Content style={styles.pageContainer}>
      {[...Array(10)].map((u, i) => (
        <View key={i} style={styles.listContainer}>
          <Text style={styles.listTitle}>{i + 1} Lorem Ipsum ?</Text>
          <View style={styles.listChild}>
            <Text style={{ fontWeight: 'bold' }}>Answer:</Text>
            <Text style={styles.listChildText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </Text>
          </View>
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
    marginBottom: 8,
  },
  listChildText: {
    marginLeft: 5,
  },
});

export default Authentication(FAQScreen);
