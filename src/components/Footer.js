import React, { Component } from 'react';
import { Footer, FooterTab, Button, Icon, Text } from 'native-base';

class BottomNavbar extends Component {
  render() {
    return (
      <Footer>
        <FooterTab>
          <Button vertical active>
            <Icon name="home" />
          </Button>
          <Button vertical>
            <Icon name="apps" />
          </Button>
          <Button vertical>
            <Icon active name="cart" />
          </Button>
          <Button vertical>
            <Icon name="person" />
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

export default BottomNavbar;
