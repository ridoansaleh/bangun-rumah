import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, Text, Separator, ListItem } from 'native-base';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Authentication from '../../components/Authentication';
import categories from './Data';

class CategoryScreen extends Component {
  render() {
    return (
      <Container>
        <Header openDrawer={() => this.props.nav.navigation.openDrawer()} />
        <Content>
          <Text style={styles.header}>Kategori Produk</Text>
          {categories.map((data, i) => {
            if (data.status === 'main') {
              return (
                <Separator key={i} bordered>
                  <Text>{data.name.toUpperCase()}</Text>
                </Separator>
              );
            } else {
              return (
                <ListItem key={i}>
                  <Text>{data.name}</Text>
                </ListItem>
              );
            }
          })}
        </Content>
        <Footer />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    padding: 15,
    fontWeight: 'bold',
  },
});

export default Authentication(CategoryScreen);
