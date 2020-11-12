import MapboxGL from '@react-native-mapbox-gl/maps';
import React, { useEffect, useState } from 'react';
import { Alert, PermissionsAndroid, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Axios from 'axios';
import { SvgXml } from 'react-native-svg';
import Lupa from '../../assets/Lupa'
import Modal from './Modal'
import Footer from '../../components/Footer';
import ShapeSource from './shapeSource';
import Geolocation from '@react-native-community/geolocation';
import ModalInfo from './ModalInfo';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
// import { Container } from './styles';

export default function Map(props) {
  const [location, setLocation] = useState({ loaded: false, coordinates: { lat: '', lng: '' } })
  const [brewery, setBrewery] = useState([])
  const [hasLocationPermission, setHasLocationPermission] = useState(false)
  const [search, setSearch] = useState('')
  const [visibleModal, setVisibleModal] = useState(false)
  const [visibleModalInfo, setVisibleModalInfo] = useState(false)
  const [dataInfo, setDataInfo] = useState({})

  const onSuccess = location => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: location.latitude,
        lng: location.longitude
      }
    })
  }
  const onError = error => {
    setLocation({
      loaded: true,
      error
    })
  }
  const getBrewery = async () => {
    Axios.get('https://api.openbrewerydb.org/breweries', { params: { per_page: 50 } }).then(res => {
      transformToModel(res.data)
    })
  }
  const getSearchBrewery = async () => {

    Axios.get(`https://api.openbrewerydb.org/breweries/autocomplete?query=${search}`).then(res => {
      setSearchBrewery(res.data)
    })
  }
  const getBreweryId = async (id) => {

    Axios.get(`https://api.openbrewerydb.org/breweries/${id}`).then(res => {
      setDataInfo(res.data)
      setVisibleModalInfo(true);
    })


  }
  const getFilterBrewery = async (filter) => {
    setVisibleModal(false);
    Axios.get('https://api.openbrewerydb.org/breweries', { params: { ...filter, per_page: 50 } }).then(res => {
      transformToModel(res.data)
    })
  }
  const transformToModel = async (brewery) => {
    let aux = {
      type: 'FeatureCollection',
      features: []
    }
    brewery.map(item => {
      aux.features.push({
        type: 'Feature',
        id: item.name,
        properties: {
          ...item
        },
        geometry: {
          type: 'Point',
          coordinates: [Number(item.longitude), Number(item.latitude)]
        }
      })
    })
    setBrewery(aux);
  }
  useEffect(() => {
    getBrewery();
    enableLocation();
    getPermission();

    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(position =>
        onSuccess({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
        error => reactotron.log(error))
      Geolocation.watchPosition(position =>
        onSuccess({ latitude: position.coords.latitude, longitude: position.coords.longitude }))
    }
  }, [hasLocationPermission])
  const enableLocation = async () => {
    await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
  }
  const getPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'Permissão para utilizar a localização',
        message: 'O Map Beer precisa do acesso a sua localização'
      })
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasLocationPermission(true);
      } else {
        setHasLocationPermission(false);
      }

    } catch (err) {
      reactotron.log(err)
    }



  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerSearch}>
        <View style={styles.headerTextInput}>
          <SvgXml xml={Lupa} width={20} height={20} />
          <TextInput placeholder="Pesquisar" value={search} onChangeText={search => {
            setSearch(search)
            getSearchBrewery()
          }} placeholderTextColor="#000" style={{ flex: 1, color: '#E28703', height: 45, paddingLeft: 10 }} />
          <TouchableOpacity onPress={() => setSearch('')} style={{ width: 20, height: 20, alignItems: "center", borderRadius: 10, backgroundColor: '#CCC' }}><Text style={{ color: '#FFF' }}>X</Text></TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Text style={{ fontWeight: 'bold', color: '#E28703' }} onPress={() => setVisibleModal(true)}>Filtros</Text>
        </TouchableOpacity>
      </View>


      {search != '' ?
        searchBrewery.length > 0 ?
          <ScrollView scrollEnabled style={{ backgroundColor: '#FFF', maxHeight: 250 }}>
            {searchBrewery.map(item => <TouchableOpacity onPress={() => {
              getBreweryId(item.id)

            }} style={{ paddingVertical: 10, paddingLeft: 3, borderBottomColor: '#ddd', borderBottomWidth: 1 }}>
              <Text style={{ fontWeight: '800', fontSize: 16 }}>{item.name}</Text>
            </TouchableOpacity>)}

          </ScrollView> : null : null
      }
      <View style={{ flex: 1 }}>

        <MapboxGL.MapView

          rotateEnabled={false}
          centerCoordinate={[location.coordinates.lng, location.coordinates.lat]}
          style={{ flex: 1 }}
          showUserLocation
          styleURL={MapboxGL.StyleURL.TrafficDay}
        >
          <MapboxGL.UserLocation />
          {location.loaded ?
            <MapboxGL.Camera
              zoomLevel={16}
              centerCoordinate={[location.coordinates.lng, location.coordinates.lat]}
              animationMode={'flyTo'}
              animationDuration={1}
            />
            : null}
          <ShapeSource showModalInfo={e => {
            setDataInfo(e);
            setVisibleModalInfo(true)
          }
          } brewery={brewery} />
        </MapboxGL.MapView>

      </View>
      <Modal
        setFilter={filter => getFilterBrewery(filter)}
        show={visibleModal}
        close={() => setVisibleModal(false)}
      />
      {visibleModalInfo ?
        <ModalInfo
          data={dataInfo}
          show={visibleModalInfo}
          close={() => setVisibleModalInfo(false)}
        />
        : null}
      {visibleModal == true || visibleModalInfo == true
        ? null
        : <Footer scene='map' />}
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