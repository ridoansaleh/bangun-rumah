import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { auth } from '../../firebase.config';
import { user, urls, nonAuthenticatedUrls } from '../constant';

const Authentication = Wrapped => {
  return class extends Component {
    state = {
      isDataFetched: false,
      dataUser: {},
    };

    componentDidMount() {
      auth.onAuthStateChanged(user => {
        if (user) {
          this.getProfile();
        } else {
          if (nonAuthenticatedUrls.indexOf(this.props.navigation.state.routeName) === -1) {
            this.props.navigation.navigate(urls.login);
          } else {
            this.setState({
              isDataFetched: true,
            });
          }
        }
      });
    }

    getProfile = () => {
      let profile = {};
      for (let i = 0; i < user.length; i++) {
        AsyncStorage.getItem(user[i]).then(data => {
          let key = user[i].substr(1, user[i].length);
          profile[key] = data;
          if (i === user.length - 1) {
            this.setState({
              isDataFetched: true,
              dataUser: profile,
            });
          }
        });
      }
    };

    resetUserStatus = () => {
      this.setState({
        dataUser: {},
      });
    };

    render() {
      let { isDataFetched, dataUser } = this.state;
      let { state, navigate } = this.props.navigation;

      if (Object.keys(dataUser).length === 0) {
        if (state.routeName === urls.drawer && state.index === 4) {
          navigate(urls.login);
        }
      }

      if (!isDataFetched) {
        return null;
      }
      return (
        <Wrapped
          user={dataUser}
          nav={this.props}
          getProfile={this.getProfile}
          resetUserStatus={this.resetUserStatus}
        />
      );
    }
  };
};

export default Authentication;
