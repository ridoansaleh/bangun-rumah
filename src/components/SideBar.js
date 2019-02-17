import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage, Dimensions, Platform, StyleSheet, View } from 'react-native';
import { Content, Text, List, ListItem, Icon, Container, Left, Thumbnail } from 'native-base';
// import Authentication from '../components/Authentication';
import { loginMenus, nonLoginMenus, user, urls } from '../constant';
import { auth } from '../../firebase.config';

const defaultPhoto = require('../../assets/default_profile.jpg');
const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class SideBar extends Component {
  static propTypes = {
    // nav: PropTypes.object,
    // user: PropTypes.object,
    // logout: PropTypes.func,
  };

  constructor(props) {
    super(props);

    // console.log('user : ', props.user);

    this.state = {
      // isLogin: Object.keys(props.user).length > 0,
      // drawerMenus: Object.keys(props.user).length ? loginMenus : nonLoginMenus,
      isLogin: false,
      drawerMenus: nonLoginMenus,
      userData: {},
    };
  }

  componentDidMount() {
    console.log('Side > DID MOUNT');
  }

  shouldComponentUpdate(nextProps) {
    console.log('props : ', this.props.navigation.getParam);
    // console.log('nextProps : ', nextProps.user);
    // const user1 = Object.keys(this.props.user).length;
    // const user2 = Object.keys(nextProps.user).length;
    // console.log('user1 : ', user1);
    // console.log('user2 : ', user2);
    // if (user1 !== user2 && user2 === 0) {
    //   this.setState({
    //     isLogin: false,
    //     drawerMenus: nonLoginMenus,
    //   });
    // }
    return true;
  }

  componentDidUpdate(prevProps) {
    console.log('DID UPDATE');

    console.log('Heyy : ', this.props.navigation.getParam('prevPath', 'noo'));
    console.log('Double heyy : ', this.props.navigation.state.params);

    // auth.onAuthStateChanged(res => {
    //   if (res) {
    //     this.getProfile();
    //   } else {
    //     //
    //   }
    // });
  }

  getProfile = () => {
    console.log('Get Profile ...');
    let profile = {};
    for (let i = 0; i < user.length; i++) {
      AsyncStorage.getItem(user[i]).then(data => {
        let key = user[i].substr(1, user[i].length);
        // console.log(user[i] + ' : ' + data);
        profile[key] = data;
        if (i === user.length - 1) {
          this.setState({
            isLogin: true,
            drawerMenus: loginMenus,
            userData: profile,
          });
        }
      });
    }
  };

  componentWillUnmount() {
    console.log('Side > WILL UNMOUNT');
  }

  handleMenuClick = route => {
    if (route === 'Logout') {
      auth
        .signOut()
        .then(() => {
          AsyncStorage.multiRemove(user, error => {
            error && console.error(error);
          });
          // this.props.logout();
          // console.log('this.props.nav > ', this.props.nav);
          this.setState(
            {
              isLogin: false,
              drawerMenus: nonLoginMenus,
              userData: {},
            },
            () => {
              this.props.navigation.navigate(urls.home);
            }
          );
          // this.forceUpdate();
        })
        .catch(error => console.error('Error while perform logout \n', error));
    } else {
      this.props.navigation.navigate(route);
    }
  };

  render() {
    return (
      <Container>
        <Content
          bounces={false}
          style={{ flex: 1, backgroundColor: '#fff', top: -1, paddingTop: 25 }}>
          {this.state.isLogin && (
            <View style={styles.profile}>
              {Object.keys(this.state.userData).length > 0 && (
                <Thumbnail small source={{ uri: this.state.userData.photo }} />
              )}
              {Object.keys(this.state.userData).length === 0 && (
                <Thumbnail small source={defaultPhoto} />
              )}
              <Text style={styles.nameText}>{this.state.userData.nama}</Text>
            </View>
          )}
          <List
            dataArray={this.state.drawerMenus}
            renderRow={data => (
              <ListItem button noBorder onPress={() => this.handleMenuClick(data.route)}>
                <Left>
                  <Icon
                    active
                    name={data.icon}
                    style={{ color: '#777', fontSize: 26, width: 30 }}
                  />
                  <Text style={styles.text}>{data.name}</Text>
                </Left>
              </ListItem>
            )}
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  drawerCover: {
    alignSelf: 'stretch',
    height: deviceHeight / 3.5,
    width: null,
    position: 'relative',
    marginBottom: 10,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: '#316ED0',
  },
  nameText: {
    color: 'white',
    marginLeft: 10,
  },
  drawerImage: {
    position: 'absolute',
    left: Platform.OS === 'android' ? deviceWidth / 10 : deviceWidth / 9,
    top: Platform.OS === 'android' ? deviceHeight / 13 : deviceHeight / 12,
    width: 210,
    height: 75,
    resizeMode: 'cover',
  },
  text: {
    fontWeight: Platform.OS === 'ios' ? '500' : '400',
    fontSize: 16,
    marginLeft: 20,
  },
});

export default SideBar;
