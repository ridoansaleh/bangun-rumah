import React, { Component } from 'react';
import { Footer, FooterTab, Button, Icon } from 'native-base';

class BottomNavbar extends Component {
  render() {
    return (
      <Footer>
        <FooterTab>
          <Button vertical>
            <Icon active name="home" />
          </Button>
          <Button vertical>
            <Icon name="apps" />
          </Button>
          <Button vertical>
            <Icon name="cart" />
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
