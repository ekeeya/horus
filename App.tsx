import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppNavigation from './src/navigation/AppNavigation.js';
import {AlertNotificationRoot} from 'react-native-alert-notification';
import {PaperProvider} from 'react-native-paper';
function App(): React.JSX.Element {

  return (
    <SafeAreaView>
      <StatusBar backgroundColor="#e9e9eb" barStyle="dark-content" />

      <LinearGradient
        className="h-full"
        locations={[0, 0.5, 0.6]}
        colors={['#e9e9eb', '#f5f5f7', '#f8f8fa']}>
        <AlertNotificationRoot>
          <PaperProvider>
            <AppNavigation />
          </PaperProvider>
        </AlertNotificationRoot>
      </LinearGradient>
    </SafeAreaView>
  );
}

export default App;
