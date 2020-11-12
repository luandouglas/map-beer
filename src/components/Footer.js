import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import Star from '../assets/Star'
import StarSelected from '../assets/StarSelected'
import Map from '../assets/Map'
import MapSelected from '../assets/MapSelected'
import List from '../assets/List'
import ListSelected from '../assets/ListSelected'
import { Actions } from 'react-native-router-flux';
import Favorite from '../assets/Favorite';
import FavoriteSelected from '../assets/FavoriteSelected';
// import { Container } from './styles';

export default function Footer(props) {
  const [scene, setScene] = useState('map');
  useEffect(() => {
    setScene(Actions.currentScene)
  })
  return (
    <View style={{ flexDirection: 'row', alignItems: "center", height: 60 }}>
      <TouchableOpacity onPress={() => { Actions.push('list') }} style={{ flex: 1, alignItems: "center" }}>
        {scene === 'list' ?
          <SvgXml xml={ListSelected} />
          : <SvgXml xml={List} />}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { Actions.push('map') }} style={{ flex: 1, alignItems: "center" }}>
        {scene === 'map' ?
          <SvgXml xml={MapSelected} />
          : <SvgXml xml={Map} />}

      </TouchableOpacity>
      <TouchableOpacity onPress={() => { Actions.push('favorites') }} style={{ flex: 1, alignItems: "center" }}>
        {scene === 'favorites' ?
          <SvgXml xml={FavoriteSelected} />
          : <SvgXml xml={Favorite} />}

      </TouchableOpacity>

    </View>
  )
}
