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
      console.log('Authentication > DID MOUNT');
      this.checkUserLogin();
    }

    checkUserLogin = () => {
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
    };

    getProfile = () => {
      let profile = {};
      for (let i = 0; i < user.length; i++) {
        AsyncStorage.getItem(user[i]).then(data => {
          let key = user[i].substr(1, user[i].length);
          console.log(user[i] + ' : ' + data);
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

    logout = () => {
      auth.onAuthStateChanged(user => {
        if (user) {
          console.log("WTF. You're still login");
        } else {
          console.log("You're not login anymore");
          this.setState(
            {
              isDataFetched: true,
              dataUser: {},
            },
            () => {
              if (this.props.navigation.state.routeName !== urls.home) {
                this.props.navigation.navigate(urls.home);
              }
            }
          );
        }
      });
    };

    login = () => {
      console.log('Login..........');
      auth.onAuthStateChanged(user => {
        if (user) {
          console.log("You're login");
          this.getProfile();
        } else {
          console.log("What!! You're not login");
        }
      });
    };

    render() {
      if (!this.state.isDataFetched) {
        return null;
      }
      console.log('render : ', this.state.dataUser);
      return (
        <Wrapped
          user={this.state.dataUser}
          nav={this.props}
          logout={this.logout}
          login={this.login}
        />
      );
    }
  };
};

export default Authentication;
