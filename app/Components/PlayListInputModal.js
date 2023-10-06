import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Modal } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import color from '../misc/color'
import { Dimensions } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native'

const PlayListInputModal = ({visible, onClose, onSubmit}) => {
    const [playListName, setPlayListName] = useState('');

    const handleOnSubmit = () =>{
        if(!playListName.trim()){
            onClose()
        }else{
            onSubmit(playListName);
            onClose();
            setPlayListName('');
        }
    }
  return (
    <Modal visible={visible} animationType='fade' transparent>
        <View style={styles.modalContainer}>
            <View style={styles.inputContainer}>
                <Text style={{color: color.ACTIVE_BG}}>Create New PlayList</Text>
                <TextInput value={playListName} style={styles.input} onChangeText={(text) => setPlayListName(text)}/>
                <MaterialIcons 
                    name='add-circle' 
                    size={40} 
                    color={color.ACTIVE_BG} 
                    style={styles.submitIcon}
                    onPress={handleOnSubmit}
                />
            </View>
        </View>
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={[StyleSheet.absoluteFillObject, styles.modalBG]}/>
        </TouchableWithoutFeedback>
    </Modal>
  )
}

export default PlayListInputModal

const {width} = Dimensions.get('window')
const styles = StyleSheet.create({
    modalContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer:{
        width: width - 20,
        height: 200,
        borderRadius: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input:{
        width: width - 40,
        borderBottomColor: color.ACTIVE_BG,
        borderBottomWidth: 1,
        fontSize: 18,
        paddingVertical: 5
    },
    submitIcon:{
        marginTop: 15
    },
    modalBG:{
        backgroundColor: color.MODAL_BG,
        zIndex: -1,
    }
})