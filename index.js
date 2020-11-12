/**
 * @format
 */
if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import MapboxGL from '@react-native-mapbox-gl/maps'

MapboxGL.setAccessToken('pk.eyJ1IjoibHVhbmRvdWdsYXMiLCJhIjoiY2toYmgxczg5MGZpeTJ1bjh4YjU2OWRpMSJ9.GXkYI57w-Whcj2Yk0q0l9A');

AppRegistry.registerComponent(appName, () => App);
