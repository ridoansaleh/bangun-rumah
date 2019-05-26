import React, { Component } from 'react';
import { YellowBox } from 'react-native';
import { Root } from 'native-base';
import { Font } from 'expo';
import AppContainer from './src/screens';

class App extends Component {
  constructor(props) {
    super(props);

    YellowBox.ignoreWarnings(['Setting a timer']);

    this.state = {
      isFontsLoaded: false,
    };
  }

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
      console.warn(error);
    }
  };

  render() {
    if (!this.state.isFontsLoaded) {
      return null;
    }
    return (
      <Root>
        <AppContainer />
      </Root>
    );
  }
}

export default App;
