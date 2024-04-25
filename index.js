/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import InventoryService from "./src/services/InventoryService";

InventoryService.init();
AppRegistry.registerComponent(appName, () => App);
