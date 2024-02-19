/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {StatusBar} from "react-native";
import React from "react";
import AppStack from "./src/navigation";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {Provider} from "react-redux";
import {store} from "./src/store/store";
import {AlertNotificationRoot} from "react-native-alert-notification";
const App=()=> {

  return (
      <Provider store={store}>
          <SafeAreaProvider>
              <StatusBar
                  animated={true}
                  backgroundColor="#fe7918"
                  barStyle="light-content"
              />
              <AlertNotificationRoot>
                <AppStack />
              </AlertNotificationRoot>
          </SafeAreaProvider>
      </Provider>

  );
}
export default App;

