import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { auth, db } from '../../firebase.config';
import { urls, nonAuthenticatedUrls } from '../constant';

const Authentication = Wrapped => {
  return class extends Component {
    state = {
      isDataFetched: false,
      dataUser: {},
      isLogin: false,
    };

    async componentDidMount() {
      const { navigation } = this.props;

      const userId = await AsyncStorage.getItem('_id')
        .then(id => id)
        .catch(error => console.warn(error));

      const email = await AsyncStorage.getItem('_email')
        .then(e_mail => e_mail)
        .catch(error => console.warn(error));

      auth.onAuthStateChanged(user => {
        if (user) {
          this.getProfile(userId, email);
          this.didFocusSubscription = navigation.addListener('didFocus', payload => {
            this.getProfile(userId, email);
          });
        } else {
          if (nonAuthenticatedUrls.indexOf(navigation.state.routeName) === -1) {
            navigation.navigate(urls.login);
          } else {
            this.setState({
              isDataFetched: true,
              isLogin: false,
            });
          }
        }
      });
    }

    componentWillUnmount() {
      this.didFocusSubscription && this.didFocusSubscription.remove();
    }

    getProfile = (userId, email) => {
      db.collection('user')
        .doc(userId)
        .get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data();
            this.setState({
              isDataFetched: true,
              isLogin: true,
              dataUser: {
                id: userId,
                email,
                nama: data.nama,
                alamat: data.alamat,
                jenisKelamin: data.jenis_kelamin,
                tanggalLahir: data.tanggal_lahir,
                photo: data.photo,
              },
            });
          } else {
            console.warn('No such document!');
          }
        })
        .catch(error => {
          console.warn('Error getting profil data \n', error);
        });
    };

    resetUserStatus = () => {
      this.setState({
        dataUser: {},
      });
    };

    render() {
      let { isDataFetched, dataUser, isLogin } = this.state;
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
          isLogin={isLogin}
          nav={this.props}
          getProfile={this.getProfile}
          resetUserStatus={this.resetUserStatus}
        />
      );
    }
  };
};

export default Authentication;
