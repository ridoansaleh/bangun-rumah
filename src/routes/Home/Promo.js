import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { View, Spinner } from 'native-base';
import Carousel from 'react-native-snap-carousel';
import SliderEntry from './SliderEntry';
import { db } from '../../../firebase.config';
import { itemWidth, sliderWidth } from '../../utils';
const { width } = Dimensions.get('window');

class Promo extends Component {
  state = {
    slider1ActiveSlide: 1,
    dataPromos: [],
    isDataFetched: false,
  };

  componentDidMount() {
    this.getPromos();
  }

  getPromos = () => {
    const promoRef = db.collection('promo');
    let promo = [];
    promoRef
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          promo.push(doc.data());
        });
        this.setState({
          isDataFetched: true,
          dataPromos: promo,
        });
      })
      .catch(error => {
        console.error("Error getting promo's collection \n", error);
      });
  };

  renderItemWithParallax = ({ item, index }, parallaxProps) => {
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={this.state.dataPromos.length > 0}
        promo={this.state.dataPromos}
        parallaxProps={parallaxProps}
      />
    );
  };

  render() {
    if (!this.state.isDataFetched) {
      return (
        <View style={styles.spin}>
          <Spinner color="green" size="large" />
        </View>
      );
    }
    return (
      <View style={styles.exampleContainer}>
        <Carousel
          ref={c => (this._slider1Ref = c)}
          data={this.state.dataPromos}
          renderItem={this.renderItemWithParallax}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages
          firstItem={this.state.slider1ActiveSlide}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          containerCustomStyle={styles.slider}
          loop
          loopClonesPerSide={2}
          autoplay={this.state.dataPromos.length > 0}
          autoplayDelay={500}
          autoplayInterval={3000}
          onSnapToItem={index => this.setState({ slider1ActiveSlide: index })}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  exampleContainer: {
    paddingVertical: 3,
  },
  spin: {
    paddingVertical: 6,
    width: width * 0.25,
    height: width * 0.25,
    marginLeft: (width * 0.75) / 2,
    marginRight: (width * 0.75) / 2,
  },
  slider: {
    overflow: 'visible',
  },
});

export default Promo;
