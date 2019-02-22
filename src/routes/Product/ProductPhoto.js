import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, Dimensions, ScrollView } from 'react-native';
import { Icon } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';

const { width, height } = Dimensions.get('window');

class ProductPhoto extends Component {
  static propTypes = {
    data: PropTypes.object,
  };

  state = {
    images: this.props.data.photo_produk || [],
  };

  prevImage = index => {
    let totalImages = this.state.images.length;
    if (index === 0) {
      this.myScroll.scrollTo({ x: totalImages * width, y: 0, animated: true });
    } else if (index === 1) {
      this.myScroll.scrollTo({ x: 0, y: 0, animated: true });
    } else if (index === 2) {
      this.myScroll.scrollTo({ x: width, y: 0, animated: true });
    }
  };

  nextImage = index => {
    let totalImages = this.state.images.length;
    let slideTwoValue = totalImages === 2 ? -1 * width : 2 * width;
    if (index === 0) {
      this.myScroll.scrollTo({ x: width, y: 0, animated: true });
    } else if (index === 1) {
      this.myScroll.scrollTo({ x: slideTwoValue, y: 0, animated: true });
    } else if (index === 2) {
      this.myScroll.scrollTo({ x: -2 * width, y: 0, animated: true });
    }
  };

  render() {
    let { images } = this.state;
    return (
      <View style={styles.scrollContainer}>
        {images.length > 1 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            ref={e => (this.myScroll = e)}>
            {images.map((val, i) => (
              <View key={i}>
                <Grid>
                  <Col style={{ width: width * 0.05, marginTop: height * 0.13 }}>
                    <Icon name="arrow-dropleft-circle" onPress={() => this.prevImage(i)} />
                  </Col>
                  <Col>
                    <Image style={styles.image} source={{ uri: val }} key={i} />
                  </Col>
                  <Col style={{ width: width * 0.05, marginTop: height * 0.13 }}>
                    <Icon name="arrow-dropright-circle" onPress={() => this.nextImage(i)} />
                  </Col>
                </Grid>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Image style={styles.image} source={{ uri: images[0] }} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    marginTop: 10,
    height: height * 0.3,
  },
  image: {
    width: width * 0.9,
    height: height * 0.3,
  },
});

export default ProductPhoto;
