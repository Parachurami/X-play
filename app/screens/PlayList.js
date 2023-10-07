import { StyleSheet, Text, View, ScrollView, FlatList, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native';
import color from '../misc/color';
import PlayListInputModal from '../Components/PlayListInputModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AudioContext } from '../Context/AudioProvider';

const PlayList = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const context = useContext(AudioContext);

    const {playList, addToPlayList, updateState} = context

    const createPlayList = async (playListName) =>{
      try {
        const result = await AsyncStorage.getItem('playlist');
        if(result !== null){
          const audios = [];
          if(addToPlayList){
            audios.push(addToPlayList);
          }
          const newList = {
            id: Date.now(),
            title: playListName,
            audios: audios
          }
  
          const updatedList = [...playList, newList];
          updateState(context, {addToPlayList: null, playList: updatedList});
  
          await AsyncStorage.setItem('playlist', JSON.stringify(updatedList))
          console.log('====================================');
          console.log('Data Stored');
          console.log('====================================');
        }
        setModalVisible(false)        
      } catch (error) {
        console.log('An error occured', error)
      }

    }

    const renderPlayList = async() =>{
      const result = await AsyncStorage.getItem('playlist');
      if(result === null){
        const defaultPlayList = {
          id: Date.now(),
          title: 'My Favourites',
          audios: []
        }
        const newPlayList = [...playList, defaultPlayList];
        updateState(context, {playList: [...newPlayList]});
        return await AsyncStorage.setItem('playlist', JSON.stringify([...newPlayList]))
      }
      updateState(context, {playList: JSON.parse(result)});
    }

    useEffect(() =>{
      if(!playList.length){
        renderPlayList()
      }
    }, [])

    const handleBannerPress = async (playList) =>{
      // update playlist if there is any selected animationDuration
      if(addToPlayList){
        const result = await AsyncStorage.getItem('playlist')

        let oldList = []
        let updatedList = [];
        let sameAudio = false
        if(result !== null){
          oldList = JSON.parse(result);
          updatedList = oldList.filter(list =>{
            if(list.id === playList.id){
              // we want to check if that same audio is already inside 
              // our list or not  
              for(let audio of list.audios){
                if(audio.id === addToPlayList.id){
                  // alert with some message
                  sameAudio = true;
                  return;
                }
              }
              // otherwise update the playlist
              list.audios = [...list.audios, addToPlayList];
            }
            return list;

          })
          console.log(oldList);
        }
        if(sameAudio){
          Alert.alert('Found same audio!',
           `${addToPlayList.filename.slice(0, -4)} is already inside ${playList.title}`
          )
          sameAudio = false
          return updateState(context, {addToPlayList: null})
        }
        updateState(context, {addToPlayList: null, playList: [...updatedList]})
        return AsyncStorage.setItem('playlist', JSON.stringify([...updatedList]))
      }

      // if there is no audio
      console.log('opening list');
    }
  return (
    <ScrollView contentContainerStyle={styles.container}>

      {playList.length ?
      playList.map((item) => (
        <TouchableOpacity key={item.id.toString()} style={styles.playListBanner} onPress={() => handleBannerPress(item)}>
          <Text>{item.title}</Text>
          <Text style={styles.audioCount}>{item.audios.length > 1? `${item.audios.length} Songs`: `${item.audios.length} Song`}</Text>
      </TouchableOpacity>
      )):
      <></>
      }
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{marginTop: 15}}>
        <Text style={styles.playListBtn}>+ Add New Playlist</Text>
      </TouchableOpacity>
      <PlayListInputModal onSubmit={createPlayList} onClose={() => setModalVisible(false)} visible={modalVisible}/>
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
      borderRadius: 5,
      marginBottom: 15,
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