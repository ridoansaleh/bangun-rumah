import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Content, Text, Separator, ListItem } from 'native-base';
import Header from '../../components/GrandHeader';
import Footer from '../../components/Footer';
import Authentication from '../../components/Authentication';
import { urls } from '../../constant';
import categories from './Data';

class CategoryScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
  };

  searchProductByCategory = category => {
    this.props.nav.navigation.navigate(urls.search, { cat: category });
  };

  render() {
    return (
      <Container>
        <Header
          openDrawer={() => this.props.nav.navigation.openDrawer()}
          title
          titleText="Kategori Produk"
          displaySearchIcon={false}
        />
        <Content>
          {categories.map((data, i) => {
            if (data.status === 'main') {
              return (
                <Separator key={i} bordered>
                  <Text>{data.name.toUpperCase()}</Text>
                </Separator>
              );
            } else {
              return (
                <ListItem key={i} onPress={() => this.searchProductByCategory(data.name)}>
                  <Text>{data.name}</Text>
                </ListItem>
              );
            }
          })}
        </Content>
        <Footer {...this.props.nav} pageActive={urls.category} />
      </Container>
    );
  }
}

export default Authentication(CategoryScreen);
