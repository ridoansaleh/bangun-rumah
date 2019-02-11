import React, { Component } from 'react';
import { Footer, FooterTab, Button, Icon } from 'native-base';

class BottomNavbar extends Component {
  render() {
    return (
      <Footer>
        <FooterTab>
          <Button active>
            <Icon active name="home" />
          </Button>
          <Button>
            <Icon name="apps" />
          </Button>
          <Button>
            <Icon name="cart" />
          </Button>
          <Button>
            <Icon name="person" />
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

export default BottomNavbar;
