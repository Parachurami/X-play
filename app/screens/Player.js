import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Player = () => {
    const {container} = styles;
  return (
    <View style={container}>
      <Text>Player</Text>
    </View>
  )
}

export default Player

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})