import React from 'react';
import Map from '../pages/Map'
import List from '../pages/List'
import Favorites from '../pages/Favorites'
import { Scene, Router, Stack } from 'react-native-router-flux'

// import { Container } from './styles';

const router = () => {
  return <>
    <Router>
      <Stack hideNavBar key="root">
        <Scene key="map" component={Map} title="map" />
        <Scene key="list" component={List} title="list" />
        <Scene key="favorites" component={Favorites} title="favorites" />
      </Stack>
    </Router>
  </>
}

export default router;