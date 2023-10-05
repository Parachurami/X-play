import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PlayList = () => {
    const {container} = styles;
  return (
    <View style={container}>
      <Text>PlayList</Text>
    </View>
  )
}

export default PlayList

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})