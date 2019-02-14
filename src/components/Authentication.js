import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { auth } from '../../firebase.config';
import { user } from '../constant';

const Authentication = Wrapped => {
  return class extends Component {
    state = {
      isDataFetched: false,
      user: [],
    };

    componentDidMount() {
      auth.onAuthStateChanged(user => {
        if (user) {
          this.getProfile();
        } else {
          this.setState({
            isDataFetched: true,
          });
        }
      });
    }

    getProfile = () => {
      let profile = [];
      for (let i = 0; i < user.length; i++) {
        AsyncStorage.getItem(user[i]).then(data => profile.push(data));
      }
      this.setState({
        isDataFetched: true,
        user: profile,
      });
    };

    render() {
      let { isDataFetched, user } = this.state;
      if (!isDataFetched) {
        return null;
      }
      return <Wrapped user={user} nav={this.props} />;
    }
  };
};

export default Authentication;
