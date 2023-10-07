import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import Screen from '../Components/Screen';
import color from '../misc/color';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Dimensions } from 'react-native';
import PlayerButton from '../Components/PlayerButton';
import { AudioContext } from '../Context/AudioProvider';
import { changeAudio, pause, play, playNext, resume, selectAudio } from '../misc/audioController';
import { storeAudioForNextOpening } from '../misc/helper';

const {width, height} = Dimensions.get('window')
const Player = () => {
  const context = useContext(AudioContext);

  const { playbackDuration, playbackPosition } = context;

  const calculateSeekBar = () =>{
    if(playbackPosition !== null && playbackDuration !== null){
      return playbackPosition / playbackDuration;
    }
    return 0;
  }
  const percentWidth = value =>{
    let newWidth = (value / 100) * width;
    return newWidth
  }
  const percentSize = value =>{
    let size = height
    let newSize = (value / 100) * size;
    return newSize;
  }

  useEffect(() =>{
    context.loadPreviousAudio()
  }, [])

  const handlePlayPause =  async() =>{
    await selectAudio(context.currentAudio, context)
    // //PLAY
    // if(context.soundObj === null){
    //   const audio = context.currentAudio;
    //   const status = await play(context.playbackObj, audio.uri);
    //   context.playbackObj.setOnPlaybackStatusUpdate(
    //     context.OnPlaybackStatusUpdate
    //   )
    //   return context.updateState(context, {
    //     soundObj: status,
    //     currentAudio: audio,
    //     isPlaying: true,
    //     currentAudioIndex: context.currentAudioIndex
    //   })
    // }
    // //PAUSE
    // if(context.soundObj && context.soundObj.isPlaying){
    //   const status = await pause(context.playbackObj)
    //   return context.updateState(context, {
    //     soundObj: status,
    //     isPlaying: false,
    //   })
    // }

    // //RESUME
    // if(context.soundObj && !context.soundObj.isPlaying){
    //   const status = await resume(context.playbackObj)
    //   return context.updateState(context, {
    //     soundObj: status,
    //     isPlaying: true,
    //   })
    // }
  }

  const handleNext = async () =>{
    await changeAudio(context, 'next')
    // const {isLoaded} = await context.playbackObj.getStatusAsync();
    // const isLastAudio = context.currentAudioIndex + 1 === context.totalAudioCount;
    // let audio = context.audioFiles[context.currentAudioIndex + 1];
    // let index;
    // let status;

    // if(!isLoaded && !isLastAudio){
    //   index = context.currentAudioIndex + 1;
    //   status = await play(context.playbackObj, audio.uri);
    // }

    // if(isLoaded && !isLastAudio){
    //   index = context.currentAudioIndex + 1;
    //   status = await playNext(context.playbackObj, audio.uri);
    // }

    // if(isLastAudio){
    //   index = 0;
    //   audio = context.audioFiles[index];
    //   if(isLoaded){
    //     status = await playNext(context.playbackObj, audio.uri)
    //   }else{
    //     status = await play(context.playbackObj, audio.uri);
    //   }
    // }
    // context.updateState(context, 
    //   {
    //       playbackObj: context.playbackObj, 
    //       soundObj: status, 
    //       currentAudio: audio, 
    //       isPlaying: true, 
    //       currentAudioIndex: index,
    //       playbackPosition: null,
    //       playbackDuration: null,
    //   }
    // );
    // storeAudioForNextOpening(audio, index)
    
  }
  const handlePrevious = async () =>{
    await changeAudio(context, 'previous')
    // const {isLoaded} = await context.playbackObj.getStatusAsync();
    // const isFirstAudio = context.currentAudioIndex <= 0;
    // let audio = context.audioFiles[context.currentAudioIndex - 1];
    // let index;
    // let status;

    // if(!isLoaded && !isFirstAudio){
    //   index = context.currentAudioIndex - 1;
    //   status = await play(context.playbackObj, audio.uri);
    // }

    // if(isLoaded && !isFirstAudio){
    //   index = context.currentAudioIndex - 1;
    //   status = await playNext(context.playbackObj, audio.uri);
    // }

    // if(isFirstAudio){
    //   index = context.totalAudioCount-1;
    //   audio = context.audioFiles[index];
    //   if(isLoaded){
    //     status = await playNext(context.playbackObj, audio.uri)
    //   }else{
    //     status = await play(context.playbackObj, audio.uri);
    //   }
    // }
    // context.updateState(context, 
    //   {
    //       playbackObj: context.playbackObj, 
    //       soundObj: status, 
    //       currentAudio: audio, 
    //       isPlaying: true, 
    //       currentAudioIndex: index,
    //       playbackPosition: null,
    //       playbackDuration: null,
    //   }
    // );
    // storeAudioForNextOpening(audio, index)
    
  }


  if(!context.currentAudio) return null

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.audioCount}>{`${context.currentAudioIndex + 1} / ${context.totalAudioCount}`}</Text>
        <View style={styles.midBannerContainer}>
          <MaterialCommunityIcons name='music-circle' size={300} color={context.isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM}/>
        </View>
        <View style={styles.audioPlayerContainer}>
          <Text numberOfLines={1} style={styles.audioTitle}>{context.currentAudio.filename.slice(0, -4)}</Text>
          <Slider
            style={{width: width, height: 40}}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor={color.ACTIVE_BG}
            maximumTrackTintColor='#000000'
            thumbTintColor={color.ACTIVE_BG}
            value={calculateSeekBar()}
          />
          <View style={styles.audioControllers}>
            <PlayerButton size={percentSize(3.6)} onPress={handlePrevious} iconType={'PREV'}/>
            <PlayerButton size={percentSize(3.6)} onPress ={handlePlayPause} style={{marginHorizontal: percentWidth(8)}} iconType={!context.isPlaying ? 'PAUSE' : 'PLAY'}/>
            <PlayerButton size={percentSize(3.6)} onPress={handleNext} iconType={'NEXT'}/>
          </View>
        </View>
      </View>
    </Screen>
  )
}

export default Player

const styles = StyleSheet.create({
    audioControllers:{
      width,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20
    },
    container:{
        flex: 1,
    },
    audioCount:{
      textAlign: 'right',
      padding: 15,
      color: color.FONT_LIGHT,
      fontSize: 14
    },
    midBannerContainer:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    audioTitle:{
      fontSize: 16,
      color: color.FONT,
      padding: 50
    }
})