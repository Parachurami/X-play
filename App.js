import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigation from './app/navigation/AppNavigation';
import AudioProvider from './app/Context/AudioProvider';
import AudioListItem from './app/Components/AudioListItem';
import color from './app/misc/color';

const MyTheme = {
  ...DefaultTheme,
  colors:{
    ...DefaultTheme.colors,
    background: color.APP_BG,
  },
};

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer theme={MyTheme}>
        <AppNavigation/>
      </NavigationContainer>
    </AudioProvider>
  );
  // return <View style={{marginTop: 50}}>
  //   <AudioListItem/>
  // </View>
}


