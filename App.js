import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigation from './app/navigation/AppNavigation';
import AudioProvider from './app/Context/AudioProvider';
import AudioListItem from './app/Components/AudioListItem';

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer>
        <AppNavigation/>
      </NavigationContainer>
    </AudioProvider>
  );
  // return <View style={{marginTop: 50}}>
  //   <AudioListItem/>
  // </View>
}


