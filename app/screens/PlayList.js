import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native';
import color from '../misc/color';

const PlayList = () => {
    const {container} = styles;
  return (
    <ScrollView contentContainerStyle={container}>
      <TouchableOpacity style={styles.playListBanner}>
        <Text>My Favourites</Text>
        <Text style={styles.audioCount}>0 songs</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}} style={{marginTop: 15}}>
        <Text style={styles.playListBtn}>+ Add New Playlist</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default PlayList

const styles = StyleSheet.create({
    container:{
      padding: 20
    },
    playListBanner:{
      padding:5,
      backgroundColor: 'rgba(204, 204, 204, 0.3)',
      borderRadius: 5
    },
    audioCount:{
      marginTop: 3,
      opacity: 0.5,
      fontSize: 14.
    },
    playListBtn:{
      color: color.ACTIVE_BG,
      letterSpacing: 1,
      fontWeight: 'bold',
      fontSize: 14,
      padding: 5
    }
})