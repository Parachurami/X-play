import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { AudioList, PlayList, Player } from '../screens'
import { FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons'


const Tab = createBottomTabNavigator()
const AppNavigation = () => {
  return (
    <Tab.Navigator>
        <Tab.Screen name='AudioList' component={AudioList} options={{
            tabBarIcon:({color, size}) => (<MaterialIcons name='headset' size={size} color={color} />),
            headerShown:false,
        }} />
        <Tab.Screen name='Player' component={Player} options={{
            tabBarIcon:({color, size}) => (<FontAwesome5 name='compact-disc' size={size} color={color} />),
            headerShown: false
        }} />
        <Tab.Screen name='PlayList' component={PlayList} options={{
            tabBarIcon:({color, size}) => (<MaterialIcons name='library-music' size={size} color={color} />),
            headerShown: false
        }}/>
    </Tab.Navigator>
  )
}

export default AppNavigation

const styles = StyleSheet.create({})