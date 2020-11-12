import MapboxGL from '@react-native-mapbox-gl/maps';
import React, { useState } from 'react';
import { View, Modal, Text } from 'react-native';

// import { Container } from './styles';

const shapeSource = ({ brewery, showModalInfo }) => {
  let icon = {
    iconImage: require('../../assets/beer.png'),
    iconAllowOverlap: true,
    iconSize: 0.3,
  }
  return (
    <View style={{ flex: 1 }}>
      <MapboxGL.ShapeSource
        id="exampleShapeSource"
        hitbox={{ width: 24, height: 24 }}
        onPress={(e) => {
          showModalInfo(e.features[0].properties)
        }}
        shape={brewery}>
        <MapboxGL.SymbolLayer
          id="exampleIconName"
          style={icon}
        />
      </MapboxGL.ShapeSource>
    </View>
  )
}

export default shapeSource;