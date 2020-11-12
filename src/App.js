import AnimatedSplash from "react-native-animated-splash-screen";
import React, { useEffect, useState } from 'react';
import { StatusBar }from 'react-native';
import Router from './router'
import AsyncStorage from "@react-native-async-storage/async-storage";

// import { Container } from './styles';

const App = () => {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    setFavorites()
    setTimeout(() => {
      setLoaded(true);
    }, 2000)
  }, [])
  const setFavorites = async () => {
    if(await AsyncStorage.getItem('favorites') == null){
      await AsyncStorage.setItem('favorites', JSON.stringify([]))
    }
  }
  return (
    <AnimatedSplash
      isLoaded={loaded}
      logoImage={require("./assets/Logo.png")}
      backgroundColor={"#FFF"}
      logoHeight={150}
      logoWidth={150}
    >
      <StatusBar animated barStyle="dark-content" />
      <Router />
    </AnimatedSplash>
  )
}

export default App;