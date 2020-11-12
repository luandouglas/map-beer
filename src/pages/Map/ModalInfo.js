import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Picker } from 'react-native'
import { SvgXml } from 'react-native-svg'
import Favorite from '../../assets/Favorite'
import FavoriteSelected from '../../assets/FavoriteSelected'
import Star from '../../assets/Star'
import StarSelected from '../../assets/StarSelected'

const { height } = Dimensions.get('window')

const ModalInfo = ({ data, show, close }) => {
  const [state, setState] = useState({
    opacity: new Animated.Value(0),
    container: new Animated.Value(height),
    modal: new Animated.Value(height)
  })
  const [favorite, setFavorite] = useState(false)

  const openModal = () => {
    Animated.sequence([
      Animated.timing(state.container, { toValue: 0, duration: 100, useNativeDriver:true }),
      Animated.timing(state.opacity, { toValue: 1, duration: 300, useNativeDriver:true }),
      Animated.spring(state.modal, { toValue: 0, bounciness: 5, useNativeDriver: true })
    ]).start()
  }

  const closeModal = () => {
    Animated.sequence([
      Animated.timing(state.modal, { toValue: height, duration: 250, useNativeDriver: true }),
      Animated.timing(state.opacity, { toValue: 0, duration: 300, useNativeDriver:true }),
      Animated.timing(state.container, { toValue: height, duration: 100, useNativeDriver:true })
    ]).start()
  }
  const addFavorite = async () => {
    let res = await AsyncStorage.getItem('favorites')
    let favorites = JSON.parse(res);

    const indexFavorite = favorites.findIndex(e => e.id === data.id)
    if (favorites.length >= 0) {
      if (indexFavorite != -1) {
        favorites.splice(indexFavorite, 1);
      } else {
        favorites.push(data)
      }
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites))
    }


    await isFavorite()
  }
  const isFavorite = async () => {
    let res = await AsyncStorage.getItem('favorites')
    let favorites = JSON.parse(res);
    if (favorites.length >= 0) {

      const indexFavorite = favorites.findIndex(e => e.id === data.id)
      if (indexFavorite === -1) {
        setFavorite(false)
      } else {
        setFavorite(true)
      }
    }

  }
  useEffect(() => {
    if (show) {
      isFavorite()
      openModal()
    } else {
      closeModal()
    }
  }, [show])

  return (
    <Animated.View
      style={[styles.container, {
        opacity: state.opacity,
        transform: [
          { translateY: state.container }
        ]
      }]}
    >
      <Animated.View
        style={[styles.modal, {
          transform: [
            { translateY: state.modal }
          ]
        }]}
      >
        <View style={styles.indicator} />
        <View style={{ flex: 1, padding: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign:"center", color:"#E28703" }}>{data.name}</Text>
            <Text>Cidade: {data.city}</Text>
            <Text>Estado: {data.state}</Text>
            <Text>Endereço: {data.street}</Text>
            <Text>País: {data.country}</Text>
            <Text>Contato: {data.phone}</Text>
            <Text>Site: {data.website_url}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: "center" }}>

          <TouchableOpacity style={styles.btn} onPress={close}>
            <Text style={{ color: '#fff' }}>Fechar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { addFavorite() }}>
            {favorite ?
              <SvgXml xml={FavoriteSelected} />
              :
              <SvgXml xml={Favorite} />
            }
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#AAA',
    borderRadius: 5,
    padding: 6,
    position: 'relative',
    marginBottom: 15
  },
  modal: {
    bottom: 0,
    position: 'absolute',
    height: '35%',
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 10
  },
  indicator: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 5
  },
  text: {
    marginTop: 50,
    textAlign: 'center'
  },
  btn: {
    flex: 1,
    marginRight: 30,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#FFB15C',
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default ModalInfo