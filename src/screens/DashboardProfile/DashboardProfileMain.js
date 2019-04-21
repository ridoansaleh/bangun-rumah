import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, AsyncStorage } from 'react-native';
import { Container, Content, Text, Thumbnail, Icon } from 'native-base';
import { Row, Grid, Col } from 'react-native-easy-grid';
import Footer from '../../components/Footer';
import Authentication from '../../components/Authentication';
import { urls, user } from '../../constant';
import { auth } from '../../../firebase.config';

class DashboardProfileScreen extends Component {
  static propTypes = {
    user: PropTypes.object,
    nav: PropTypes.object,
    resetUserStatus: PropTypes.func,
  };

  changePage = url => {
    if (url === urls.logout) {
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
      this.props.nav.navigation.navigate(url);
    }
  };

  render() {
    return (
      <Container>
        <Content>
          <Grid>
            <Row
              size={20}
              style={{
                backgroundColor: '#316ED0',
                paddingTop: 50,
                paddingLeft: 25,
                paddingBottom: 25,
              }}>
              <Col size={2}>
                <Thumbnail large source={{ uri: this.props.user.photo }} />
              </Col>
              <Col size={3}>
                <Text style={{ color: 'white', paddingTop: 10 }}>{this.props.user.nama}</Text>
                <Text style={{ color: 'white', paddingTop: 10 }}>{this.props.user.email}</Text>
              </Col>
            </Row>
            <Row size={30} style={{ marginTop: 50 }}>
              <Grid>
                <Row>
                  <Col style={styles.box}>
                    <Icon
                      name="man"
                      style={styles.icon}
                      onPress={() => this.changePage(urls.profile)}
                    />
                  </Col>
                  <Col style={styles.box}>
                    <Icon
                      name="clipboard"
                      style={styles.icon}
                      onPress={() => this.changePage(urls.order_history)}
                    />
                  </Col>
                  <Col style={styles.box}>
                    <Icon
                      name="business"
                      style={styles.icon}
                      onPress={() => this.changePage(urls.shop)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col style={styles.box}>
                    <Icon
                      name="build"
                      style={styles.icon}
                      onPress={() => this.changePage(urls.change_password)}
                    />
                  </Col>
                  <Col style={styles.box}>
                    <Icon
                      name="podium"
                      style={styles.icon}
                      onPress={() => this.changePage(urls.logs)}
                    />
                  </Col>
                  <Col style={styles.box}>
                    <Icon
                      name="log-out"
                      style={styles.icon}
                      onPress={() => this.changePage(urls.logout)}
                    />
                  </Col>
                </Row>
              </Grid>
            </Row>
          </Grid>
        </Content>
        <Footer {...this.props.nav} pageActive={urls.dashboard_profile} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#316ED0',
    paddingTop: 25,
    paddingBottom: 25,
  },
  icon: {
    fontSize: 70,
    color: '#316ED0',
  },
});

export default Authentication(DashboardProfileScreen);
