import React from 'react';
import { StyleSheet, Dimensions, FlatList } from 'react-native';
import { Container, Content, Text, View } from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
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
          <FlatList
            data={[
              {
                key: '1',
                val:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
              },
              {
                key: '2',
                val:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
              },
              {
                key: '3',
                val:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
              },
              {
                key: '4',
                val:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
              },
            ]}
            renderItem={({ item }) => (
              <Grid style={{ marginBottom: 8 }}>
                <Row>
                  <Col style={{ width: 0.075 * width }}>
                    <Text style={{ marginLeft: 3 }}>{item.key}.</Text>
                  </Col>
                  <Col>
                    <Text>{item.val}</Text>
                  </Col>
                </Row>
              </Grid>
            )}
            keyExtractor={item => item.key}
          />
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
});

export default Authentication(TermsAndConditionScreen);
