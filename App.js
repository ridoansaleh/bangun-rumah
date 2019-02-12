import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Font } from 'expo';
import createStore from './src/redux/store';
import AppContainer from './src/routes';

const storeValue = createStore();

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
    return (
      <Provider store={storeValue}>
        <AppContainer />
      </Provider>
    );
  }
}

export default App;
