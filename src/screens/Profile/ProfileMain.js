import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import {
  Button,
  Container,
  Content,
  Header,
  Icon,
  Left,
  Body,
  Right,
  Title,
  Text,
} from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import Authentication from '../../components/Authentication';
import { urls } from '../../constant';

class ProfileScreen extends Component {
  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
  };

  state = {
    name: this.props.user.nama,
    gender: this.props.user.jenisKelamin,
    bornDate: this.props.user.tanggalLahir,
    email: this.props.user.email,
    address: this.props.user.alamat,
  };

  static getDerivedStateFromProps(nextProps) {
    let state = {
      name: nextProps.user.nama,
      gender: nextProps.user.jenisKelamin,
      bornDate: nextProps.user.tanggalLahir,
      email: nextProps.user.email,
      address: nextProps.user.alamat,
    };
    return state;
  }

  render() {
    return (
      <Container>
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => this.props.nav.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Profil</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Grid>
            <Row
              style={{
                padding: 15,
                borderBottomColor: '#EBE5E4',
                borderBottomWidth: 1,
                borderTopColor: '#EBE5E4',
                borderTopWidth: 1,
              }}>
              <Grid>
                <Col>
                  <Text>Nama</Text>
                </Col>
                <Col>
                  <Text>{this.state.name}</Text>
                </Col>
              </Grid>
            </Row>
            <Row
              style={{
                padding: 15,
                borderBottomColor: '#EBE5E4',
                borderBottomWidth: 1,
              }}>
              <Grid>
                <Col>
                  <Text>Jenis Kelamin</Text>
                </Col>
                <Col>
                  <Text>{this.state.gender}</Text>
                </Col>
              </Grid>
            </Row>
            <Row
              style={{
                padding: 15,
                borderBottomColor: '#EBE5E4',
                borderBottomWidth: 1,
              }}>
              <Grid>
                <Col>
                  <Text>Tanggal Lahir</Text>
                </Col>
                <Col>
                  <Text>{this.state.bornDate}</Text>
                </Col>
              </Grid>
            </Row>
            <Row
              style={{
                padding: 15,
                borderBottomColor: '#EBE5E4',
                borderBottomWidth: 1,
              }}>
              <Grid>
                <Col>
                  <Text>Email</Text>
                </Col>
                <Col>
                  <Text>{this.state.email}</Text>
                </Col>
              </Grid>
            </Row>
            <Row
              style={{
                padding: 15,
                borderBottomColor: '#EBE5E4',
                borderBottomWidth: 1,
              }}>
              <Grid>
                <Col>
                  <Text>Alamat</Text>
                </Col>
                <Col>
                  <Text>{this.state.address}</Text>
                </Col>
              </Grid>
            </Row>
            <Row style={{ flex: 1, justifyContent: 'center', marginTop: 30 }}>
              <Button small onPress={() => this.props.nav.navigation.navigate(urls.edit_profile)}>
                <Text>Ubah Data Profil</Text>
              </Button>
            </Row>
          </Grid>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
  },
});

export default Authentication(ProfileScreen);
