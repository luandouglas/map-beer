import Pages from '../pages';

function createRouteConfigMap() {
  let routeConfigMap = {};

  Object.keys(Pages).forEach(key => {
    routeConfigMap[key] = Pages[key];
  });
  console.log(routerConfigMap);
  return routeConfigMap;
}

export default createRouteConfigMap();
