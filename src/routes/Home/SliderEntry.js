import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ParallaxImage } from 'react-native-snap-carousel';
import colors from '../../colors';
import { itemWidth, itemHorizontalMargin, slideHeight, IS_IOS } from '../../utils';

class SliderEntry extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    even: PropTypes.bool,
    parallax: PropTypes.bool,
    parallaxProps: PropTypes.object,
  };

  get image() {
    const {
      data: { illustration },
      parallax,
      parallaxProps,
      even,
    } = this.props;

    return parallax ? (
      <ParallaxImage
        source={{ uri: illustration }}
        containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
        style={styles.image}
        parallaxFactor={0.35}
        showSpinner
        spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
        {...parallaxProps}
      />
    ) : (
      <Image source={{ uri: illustration }} style={styles.image} />
    );
  }

  render() {
    const { even } = this.props;

    return (
      <TouchableOpacity activeOpacity={1} style={styles.slideInnerContainer}>
        <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
          {this.image}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    paddingHorizontal: itemHorizontalMargin,
  },
  imageContainer: {
    flex: 1,
    marginBottom: IS_IOS ? 0 : -1, //Prevent a random Android rendering issue
    backgroundColor: 'white',
  },
  imageContainerEven: {
    backgroundColor: colors.black,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
});

export default SliderEntry;
