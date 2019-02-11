import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import { Content, Text, List, ListItem, Icon, Container, Left, Thumbnail } from 'native-base';
import { drawerMenus as datas } from '../constant';

const defaultPhoto = require('../../assets/default_profile.jpg');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class SideBar extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  };

  state = {
    isLogin: false,
  };

  render() {
    let menuList = [];

    if (!this.state.isLogin) {
      datas.splice(8, 1);
      menuList = datas.slice(4);
    } else {
      datas.splice(6, 1);
      datas.splice(6, 1);
    }

    return (
      <Container>
        <Content
          bounces={false}
          style={{ flex: 1, backgroundColor: '#fff', top: -1, paddingTop: 25 }}>
          {this.state.isLogin && (
            <View style={styles.profile}>
              <Thumbnail small source={defaultPhoto} />
              <Text style={styles.nameText}>Ridoan Saleh Nasution</Text>
            </View>
          )}
          <List
            dataArray={menuList}
            renderRow={data => (
              <ListItem button noBorder onPress={() => this.props.navigation.navigate(data.route)}>
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