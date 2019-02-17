import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, Text, Thumbnail, Icon } from 'native-base';
import { Row, Grid, Col } from 'react-native-easy-grid';
import Footer from '../../components/Footer';
import Authentication from '../../components/Authentication';
import defaultPhoto from '../../../assets/default_profile.jpg';
import { urls } from '../../constant';

class ProfileScreen extends Component {
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
                <Thumbnail large source={defaultPhoto} />
              </Col>
              <Col size={3}>
                <Text style={{ color: 'white', paddingTop: 10 }}>Username</Text>
                <Text style={{ color: 'white', paddingTop: 10 }}>Email</Text>
              </Col>
            </Row>
            <Row size={30} style={{ marginTop: 50 }}>
              <Grid>
                <Row>
                  <Col style={styles.box}>
                    <Icon name="man" style={styles.icon} />
                  </Col>
                  <Col style={styles.box}>
                    <Icon name="clipboard" style={styles.icon} />
                  </Col>
                  <Col style={styles.box}>
                    <Icon name="business" style={styles.icon} />
                  </Col>
                </Row>
                <Row>
                  <Col style={styles.box}>
                    <Icon name="build" style={styles.icon} />
                  </Col>
                  <Col style={styles.box}>
                    <Icon name="podium" style={styles.icon} />
                  </Col>
                  <Col style={styles.box}>
                    <Icon name="log-out" style={styles.icon} />
                  </Col>
                </Row>
              </Grid>
            </Row>
          </Grid>
        </Content>
        <Footer {...this.props.nav} pageActive={urls.profile} />
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

export default Authentication(ProfileScreen);
