import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import Favorite from '../../assets/Favorite';
import FavoriteSelected from '../../assets/FavoriteSelected';
import Footer from '../../components/Footer';
import reactotron from 'reactotron-react-native';
import Lupa from '../../assets/Lupa';
import Modal from '../Map/Modal';

// import { Container } from './styles';

const Favorites = (props) => {
  const [brewery, setBrewery] = useState([])
  const [favorites, setFavorites] = useState([])
  const [search, setSearch] = useState('')
  const [visibleModal, setVisibleModal] = useState(false)
  const [filters, setFilters] = useState({ query: '', per_page: 50, by_state: '', by_type: '' })

  useEffect(() => {
    getBrewey()
  }, [])
  const getBrewey = async () => {
    getFavorites()
  }
  const getFavorites = async () => {
    let res = await AsyncStorage.getItem('favorites')
    setBrewery([...JSON.parse(res)])
  }
  const addFavorite = async (index) => {
    let res = await AsyncStorage.getItem('favorites')
    let favorites = JSON.parse(res);

    favorites.splice(index, 1);

    await AsyncStorage.setItem('favorites', JSON.stringify(favorites))
    getFavorites();
  }


  return (
    <View style={{ flex: 1, }}>

      <ScrollView scrollEnabled style={{ flex: 1 }}>
        {brewery.map((item, index) => {
          return (
            <View key={index}
              style={{
                flexDirection: 'row',
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderBottomColor: '#AAA',
                borderBottomWidth: 1
              }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                <Text style={{}}>{item.city}</Text>
                <Text style={{}}>{item.street}</Text>
                <Text style={{}}>{item.state}</Text>
              </View>
              <TouchableOpacity onPress={() => { addFavorite(index) }}>
                <SvgXml xml={FavoriteSelected} />
              </TouchableOpacity>

            </View>
          )
        })}
      </ScrollView>

      <Footer scene='favorites' />
    </View>
  )
}

export default Favorites;