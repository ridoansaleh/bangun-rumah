import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';
import Carousel from 'react-native-snap-carousel';
import SliderEntry from './SliderEntry';
import { ENTRIES1 } from './entries';
import { itemWidth, sliderWidth } from '../../utils';

class Promo extends Component {
  state = {
    slider1ActiveSlide: 1,
  };

  renderItemWithParallax = ({ item, index }, parallaxProps) => {
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        parallax
        parallaxProps={parallaxProps}
      />
    );
  };

  render() {
    return (
      <View style={styles.exampleContainer}>
        <Carousel
          ref={c => (this._slider1Ref = c)}
          data={ENTRIES1}
          renderItem={this.renderItemWithParallax}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages
          firstItem={this.state.slider1ActiveSlide}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          loop
          loopClonesPerSide={2}
          autoplay
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
  slider: {
    // marginTop: 15,
    overflow: 'visible', // for custom animations
  },
  sliderContentContainer: {
    // paddingVertical: 10, // for custom animation
  },
});

export default Promo;
