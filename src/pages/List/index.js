import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, ActivityIndicator } from 'react-native';
import { SvgXml } from 'react-native-svg';
import Favorite from '../../assets/Favorite';
import FavoriteSelected from '../../assets/FavoriteSelected';
import Footer from '../../components/Footer';
import Lupa from '../../assets/Lupa';
import Modal from '../Map/Modal';
import ModalInfo from '../Map/ModalInfo';

// import { Container } from './styles';

const List = (props) => {
  const [brewery, setBrewery] = useState([])
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [dataInfo, setDataInfo] = useState({})

  const [visibleModal, setVisibleModal] = useState(false)
  const [visibleModalInfo, setVisibleModalInfo] = useState(false)
  const [filters, setFilters] = useState({ query: '', page: 1, per_page: 10, by_state: '', by_type: '',by_name:"" })

  useEffect(() => {
    getBrewey()
  }, [])
  const getBrewey = async () => {
    setLoading(true);

    Axios.get('https://api.openbrewerydb.org/breweries', { params: { ...filters } }).then(res => {
      if (filters.page == 1)
        setBrewery(res.data)
      else setBrewery([...brewery, ...res.data])
    })
    setLoading(false);
    getFavorites()
  }
  const getFilterBrewery = async (filter) => {
    setFilters(state => ({
      ...filter,
      by_name: state.by_name,
      page: 1,
    }))
    Axios.get(`https://api.openbrewerydb.org/breweries`, { params: { ...filters } }).then(res => {
      setBrewery(res.data)
    })

    setVisibleModal(false)
  }
  const getMoreBrewery = async () => {
    setFilters(state => ({
      ...state,
      page: state.page + 1,
    }))
    getBrewey();
  }
  const getFavorites = async () => {
    let res = await AsyncStorage.getItem('favorites')
    setFavorites([...JSON.parse(res)])
  }
  const addFavorite = async (item) => {
    let res = await AsyncStorage.getItem('favorites')
    let favorites = JSON.parse(res);

    const indexFavorite = favorites.findIndex(e => e.id === item.id)
    if (indexFavorite != -1) {
      favorites.splice(indexFavorite, 1);
    } else {
      favorites.push(item)
    }
    await AsyncStorage.setItem('favorites', JSON.stringify(favorites))
    getFavorites();
  }
  const isFavorite = (id) => {
    const res = favorites.findIndex(e => e.id == id)
    if (res == -1) {
      return false
    }
    else {
      return true
    }
  }
  const renderItem = ({ item }) => {
    let isFav = isFavorite(item.id)
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: "center",
          marginVertical: 5,
          paddingHorizontal: 10,
          borderBottomColor: '#AAA',
          borderBottomWidth: 1
        }}>
        <TouchableOpacity onPress={() => {
          setDataInfo(item)
          setVisibleModalInfo(true)
        }}
          style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
          <Text style={{}}>{item.city}</Text>
          <Text style={{}}>{item.street}</Text>
          <Text style={{}}>{item.state}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { addFavorite(item) }}>
          <SvgXml xml={isFav ? FavoriteSelected : Favorite} />
        </TouchableOpacity>

      </View>
    )
  }
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ alignSelf: 'center' }}>
        <ActivityIndicator color="#000" size="large" />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, }}>
      <View style={styles.headerSearch}>
        <View style={styles.headerTextInput}>
          <SvgXml xml={Lupa} width={20} height={20} />
          <TextInput placeholder="Pesquisar" value={filters.by_name} onChangeText={search => {
            setFilters(state => ({ ...state, by_name: search }))
            getFilterBrewery({ ...filters, by_name: search })

          }} placeholderTextColor="#000" style={{ flex: 1, color: '#E28703', height: 45, paddingLeft: 10 }} />
          <TouchableOpacity onPress={() => setFilters(state => ({ ...state, query: '' }))} style={{ width: 20, height: 20, alignItems: "center", borderRadius: 10, backgroundColor: '#CCC' }}><Text style={{ color: '#FFF' }}>X</Text></TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Text style={{ fontWeight: 'bold', color: '#E28703' }} onPress={() => setVisibleModal(true)}>Filtros</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        onEndReached={() => getMoreBrewery()}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        contentContainerStyle={styles.list}
        data={brewery}
        keyExtractor={e => e.id}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
      />
      <Modal
        setFilter={filter => {
          getFilterBrewery(filter)
        }}
        show={visibleModal}
        close={() => setVisibleModal(false)}
      />

      <ModalInfo
        data={dataInfo}
        show={visibleModalInfo}
        close={() => setVisibleModalInfo(false)}
      />
      {visibleModal == true || visibleModalInfo == true ?
        null
        : <Footer scene='list' />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    padding: 10,
    height: 55
  },
  headerTextInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10, height: 45,
    marginVertical: 5,
    marginRight: 10,
    borderRadius: 50
  },
});
export default List;