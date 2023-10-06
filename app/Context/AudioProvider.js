import { Text, View, Alert} from 'react-native'
import React, { Component, createContext } from 'react'
import * as MediaLibrary from 'expo-media-library'
import { DataProvider } from 'recyclerlistview';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AudioContext = createContext();

export class AudioProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            audioFiles:[],
            permissionError: false,
            dataProvider: new DataProvider((r1, r2) => r1 !== r2),
            playbackObj: null,
            soundObj: null,
            currentAudio:{},
            isPlaying: false,
            currentAudioIndex: null,
            playbackPosition: null,
            playbackDuration: null,
        }
        this.totalAudioCount = 0
    }
    

    permissionAlert(){
        Alert.alert('Permission Required', 'This app needs to read audio files', [
            {
                text: 'I am ready',
                onPress:() => this.getPermission()
            },
            {
                text: 'cancel',
                onPress: () => this.permissionAlert()
            }
        ])
    }


    loadPreviousAudio = async () =>{
        let previousAudio = await AsyncStorage.getItem('previousAudio');
        let currentAudio;
        let currentAudioIndex;

        if(previousAudio === null){
            currentAudio = this.state.audioFiles[0]
            currentAudioIndex = 0
        }else{
            previousAudio = JSON.parse(previousAudio);
            currentAudio = previousAudio.audio;
            currentAudioIndex = previousAudio.index;
        }

        this.setState({...this.state, currentAudio, currentAudioIndex})
    }

    getPermission = async() =>{
        const permission = await MediaLibrary.getPermissionsAsync();
        // console.log(permission)
        if(permission.granted){
            // get all audio files
            this.getAudioFiles()
        }

        if(!permission.canAskAgain && !permission.granted){
            this.setState({...this.state, permissionError: true})
        }

        if(!permission.granted && permission.canAskAgain){
           const {status, canAskAgain} = await MediaLibrary.requestPermissionsAsync();
           if(status === 'denied' && canAskAgain){
            // display alert that user must allow permission to use this app
            this.permissionAlert()

           }
           if(status === 'granted'){
            // get all the audio files
            this.getAudioFiles()
           }
           if(status === 'denied' && !canAskAgain){
            // display some error to the user
            this.setState({...this.state, permissionError: true})
           }
        }
    }

    getAudioFiles = async() =>{
        const {dataProvider, audioFiles} = this.state
        let media = MediaLibrary.getAssetsAsync({
            mediaType: 'audio'
        })

        media = MediaLibrary.getAssetsAsync({
            mediaType: 'audio',
            first: (await media).totalCount
        })

        this.totalAudioCount = (await media).totalCount

        this.setState({...this.state, dataProvider: dataProvider.cloneWithRows([...audioFiles, ...(await media).assets]), audioFiles: [...audioFiles, ...(await media).assets]})
    }

    componentDidMount(){
        this.getPermission()
    }

    updateState = (prevState, newState={}) =>{
        this.setState({...prevState, ...newState})
    }

  render() {
    const {permissionError, dataProvider, audioFiles, playbackObj, soundObj, currentAudio, isPlaying, currentAudioIndex, playbackDuration, playbackPosition} = this.state
    if(permissionError){
        return(
            <View style={{        
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',}}>
                <Text style={{fontSize: 25, textAlign: 'center', color: 'red'}}>It looks like you haven't accepted the permission</Text>
            </View>
        )
    }
    return (
      <AudioContext.Provider value={{audioFiles, dataProvider, playbackObj, soundObj, currentAudio, updateState:this.updateState, isPlaying, currentAudioIndex, totalAudioCount:this.totalAudioCount, playbackDuration, playbackPosition, loadPreviousAudio:this.loadPreviousAudio}}>
        {this.props.children}
      </AudioContext.Provider>
    )
  }
}

export default AudioProvider