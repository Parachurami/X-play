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

    handleAudioPress = async (audio) =>{
        const {playbackObj, soundObj, currentAudio, updateState, isPlaying} = this.context
        //Playing Audio For The First Time
        if(soundObj === null){
            const playbackObj = new Audio.Sound();
            const status = await play(playbackObj, audio.uri)
            console.log(status);
            return updateState(this.context, {playbackObj: playbackObj, soundObj: status, currentAudio: audio, isPlaying: true})
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
            return updateState(this.context, {currentAudio: audio, soundObj: status})
        }
    }

    rowRenderer = (type, item) =>{
        return <AudioListItem 
        title={item.filename.slice(0, -4)} 
        duration={item.duration}
        isPlaying={this.context.isPlaying}
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
                {({dataProvider}) => {
                    return (
                        <GestureHandlerRootView style={{flex: 1}}>
                        <Screen>
                            <RecyclerListView 
                            dataProvider={dataProvider} 
                            layoutProvider={this.layoutProvider} 
                            rowRenderer={this.rowRenderer}
                            />
                            <OptionModal 
                                currentItem={this.currentItem} 
                                onClose={() => this.setState({...this.state, optionModalVisible: false})} 
                                visible={this.state.optionModalVisible}
                                onPlayPress={() => {}}
                                onPlayListPress={() =>{}}
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