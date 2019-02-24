import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Footer, FooterTab, Button, Icon } from 'native-base';
import { urls } from '../constant';

class BottomNavbar extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    pageActive: PropTypes.string,
  };

  handleRouteChange = url => {
    if (url !== this.props.pageActive) {
      this.props.navigation.navigate(url);
    }
  };

  render() {
    return (
      <Footer>
        <FooterTab>
          <Button
            active={this.props.pageActive === urls.home}
            onPress={() => this.handleRouteChange(urls.home)}>
            <Icon active name="home" />
          </Button>
          <Button
            active={this.props.pageActive === urls.category}
            onPress={() => this.handleRouteChange(urls.category)}>
            <Icon name="apps" />
          </Button>
          <Button
            active={this.props.pageActive === urls.cart}
            onPress={() => this.handleRouteChange(urls.cart)}>
            <Icon name="cart" />
          </Button>
          <Button
            active={this.props.pageActive === urls.dashboard_profile}
            onPress={() => this.handleRouteChange(urls.dashboard_profile)}>
            <Icon name="person" />
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

export default BottomNavbar;
