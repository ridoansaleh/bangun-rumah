import React, { Component } from 'react';
import { Font } from 'expo';
import AppContainer from './src/routes';

class App extends Component {
  state = {
    isFontsLoaded: false,
  };

  componentDidMount() {
    this.loadFonts();
  }

  loadFonts = async () => {
    try {
      await Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      });
      this.setState({
        isFontsLoaded: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    if (!this.state.isFontsLoaded) {
      return null;
    }
    return <AppContainer />;
  }
}

export default App;
