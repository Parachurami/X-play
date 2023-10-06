import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import { AudioContext } from '../Context/AudioProvider'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview'
import { Dimensions } from 'react-native'
import AudioListItem from '../Components/AudioListItem'
import Screen from '../Components/Screen'
import OptionModal from '../Components/OptionModal'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { pause, play, playNext, resume } from '../misc/audioController'
import { Audio } from 'expo-av'
import { storeAudioForNextOpening } from '../misc/helper'

class AudioList extends Component {
    static contextType = AudioContext

    constructor(props) {
        super(props);
        this.state = {
            optionModalVisible: false,
        }
        this.currentItem = {}
    }

    layoutProvider = new LayoutProvider((i) => 'audio', (type, dim) => {
        switch(type){
            case 'audio':
                dim.width = Dimensions.get('window').width,
                dim.height = 70
                break;

            default:
                dim.width = 0;
                dim.height = 0;
        }

    })

    // onPlaybackStatusUpdate = async (playbackStatus) =>{
    //     if(playbackStatus.isLoaded && playbackStatus.isPlaying){
    //         this.context.updateState(this.context, {
    //             playbackPosition: playbackStatus.positionMillis,
    //             playbackDuration: playbackStatus.durationMillis
    //         });
    //     }

    //     if(playbackStatus.didJustFinish){
    //         const nextAudioIndex = this.context.currentAudioIndex + 1;
    //         if(nextAudioIndex >= this.context.totalAudioCount){
    //             this.context.playbackObj.unloadAsync()
    //             this.context.updateState(this.context, {
    //                 soundObj: null,
    //                 currentAudio: this.context.audioFiles[0],
    //                 isPlaying: false,
    //                 currentAudioIndex: 0,
    //                 playbackDuration: null,
    //                 playbackPosition: null
    //             })
    //             return await storeAudioForNextOpening(this.context.audioFiles[0], 0);

    //         }
    //         const audio = this.context.audioFiles[nextAudioIndex];
    //         const status = await playNext(this.context.playbackObj, audio.uri);
    //         this.context.updateState(this.context, {
    //             soundObj: status,
    //             currentAudio: audio,
    //             isPlaying: true,
    //             currentAudioIndex: nextAudioIndex
    //         })
            
    //         await storeAudioForNextOpening(audio,nextAudioIndex);
    //     }
    // }

    handleAudioPress = async (audio) =>{
        const {playbackObj, soundObj, currentAudio, updateState, audioFiles} = this.context
        //Playing Audio For The First Time
        if(soundObj === null){
            const playbackObj = new Audio.Sound();
            const status = await play(playbackObj, audio.uri)
            const index = audioFiles.indexOf(audio)
            console.log(status);
            updateState(this.context, 
                {
                    playbackObj: playbackObj, 
                    soundObj: status, 
                    currentAudio: audio,
                    isPlaying: true,
                    currentAudioIndex: index
                }
            );
            playbackObj.setOnPlaybackStatusUpdate(this.context.onPlaybackStatusUpdate)
            return storeAudioForNextOpening(audio,index);
        }
        // pause audio
        if(soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id){
            const status = await pause(playbackObj)
            return updateState(this.context, {soundObj: status, isPlaying: false})
        }

        // resume audio
        if(soundObj.isLoaded && !soundObj.isPlaying && currentAudio.id === audio.id){
            const status =  await resume(playbackObj);
            return updateState(this.context, {soundObj: status, isPlaying: true})
        }

        // select another audio
        if(soundObj.isLoaded && currentAudio.id !== audio.id){
            const status = await playNext(playbackObj, audio.uri)
            const index = audioFiles.indexOf(audio);
            updateState(this.context, {currentAudio: audio, soundObj: status, currentAudioIndex: index, isPlaying: true})
            return storeAudioForNextOpening(audio,index);
        }
    }

    componentDidMount(){
        this.context.loadPreviousAudio();
    }

    rowRenderer = (type, item, index, extendedState) =>{
        return <AudioListItem 
        title={item.filename.slice(0, -4)} 
        duration={item.duration}
        isPlaying={extendedState.isPlaying}
        activeListItem={this.context.currentAudioIndex === index}
        onOptionPress={() => {
            this.currentItem = item.filename.slice(0, -4);
            this.setState({...this.state, optionModalVisible: true})
        }}
        onAudioPress={() => this.handleAudioPress(item)}
        />
    }
    render(){
        return (
            <AudioContext.Consumer>
                {({dataProvider, isPlaying}) => {
                    // console.log(dataProvider)
                    if(!dataProvider._data.length) return null;
                    return (
                        <GestureHandlerRootView style={{flex: 1}}>
                        <Screen>
                            <RecyclerListView 
                            dataProvider={dataProvider} 
                            layoutProvider={this.layoutProvider} 
                            rowRenderer={this.rowRenderer}
                            extendedState={{isPlaying}}
                            />
                            <OptionModal 
                                currentItem={this.currentItem} 
                                onClose={() => this.setState({...this.state, optionModalVisible: false})} 
                                visible={this.state.optionModalVisible}
                                onPlayPress={() => {}}
                                onPlayListPress={() =>{
                                    this,this.context.updateState(this.context, {
                                        addToPlayList: this.currentItem
                                    })
                                    this.props.navigation.navigate('PlayList')
                                }}
                            />
                        </Screen>
                        </GestureHandlerRootView>
                    )
                }}
            </AudioContext.Consumer>
          )
    }

}

export default AudioList

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})