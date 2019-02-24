import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage, Dimensions, Platform, StyleSheet, View } from 'react-native';
import { Content, Text, List, ListItem, Icon, Container, Left, Thumbnail } from 'native-base';
import Authentication from '../components/Authentication';
import defaultPhoto from '../../assets/default_profile.jpg';
import { loginMenus, nonLoginMenus, user } from '../constant';
import { auth } from '../../firebase.config';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class SideBar extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
    isLogin: PropTypes.bool,
    getProfile: PropTypes.func,
    resetUserStatus: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLogin: props.isLogin,
      drawerMenus: props.isLogin ? loginMenus : nonLoginMenus,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    let state = {
      isLogin: nextProps.isLogin,
      drawerMenus: nextProps.isLogin ? loginMenus : nonLoginMenus,
    };
    return state;
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.isLogin && nextProps.user.nama === null) {
      this.props.getProfile();
    }
    return true;
  }

  handleMenuClick = route => {
    if (route === 'Logout') {
      auth
        .signOut()
        .then(() => {
          AsyncStorage.multiRemove(user, error => {
            error && console.error(error);
          });
          this.props.resetUserStatus();
        })
        .catch(error => console.error('Error while perform logout \n', error));
    } else {
      this.props.nav.navigation.navigate(route);
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
              {Object.keys(this.props.user).length > 0 && (
                <Thumbnail small source={{ uri: this.props.user.photo }} />
              )}
              {Object.keys(this.props.user).length === 0 && (
                <Thumbnail small source={defaultPhoto} />
              )}
              <Text style={styles.nameText}>{this.props.user.nama}</Text>
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

export default Authentication(SideBar);
