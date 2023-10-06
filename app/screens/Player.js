import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import Screen from '../Components/Screen';
import color from '../misc/color';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Dimensions } from 'react-native';
import PlayerButton from '../Components/PlayerButton';
import { AudioContext } from '../Context/AudioProvider';

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
            <PlayerButton size={percentSize(3.6)} iconType={'PREV'}/>
            <PlayerButton size={percentSize(3.6)} onPress ={() => console.log('pause')} style={{marginHorizontal: percentWidth(8)}} iconType={!context.isPlaying ? 'PAUSE' : 'PLAY'}/>
            <PlayerButton size={percentSize(3.6)} iconType={'NEXT'}/>
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