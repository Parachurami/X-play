import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Modal } from 'react-native'
import { StatusBar } from 'react-native'
import color from '../misc/color'
import { TouchableWithoutFeedback } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

const OptionModal = ({visible, onClose, currentItem, onPlayPress, onPlayListPress}) => {
    const percentWidth = value =>{
        let newWidth = (value / 100) * width;
        return newWidth
    }
  return (
    <>
    <StatusBar hidden/>
    <Modal animationType='slide' transparent visible={visible}>
        <View style={styles.modal}>
            {/* <View style={styles.line}/> */}
            <Text numberOfLines={2} style={styles.title}>{currentItem}</Text>
            <View style={styles.optionContainer}>
                <TouchableOpacity onPress={onPlayPress} style={styles.optionItem(percentWidth(10))}>
                    <MaterialIcons name='play-circle-fill' size={24}/>
                    <Text style={styles.option}>Play</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPlayListPress} style={styles.optionItem(percentWidth(30))}>
                    <MaterialIcons name='playlist-add' size={24}/>
                    <Text style={styles.option}>Add to PlayList</Text>
                </TouchableOpacity>
                
            </View>
        </View>
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.modalBg}/>
        </TouchableWithoutFeedback>
    </Modal>
    </>
  )
}

export default OptionModal

const {width} = Dimensions.get('window')
const styles = StyleSheet.create({
    modal:{
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: color.APP_BG,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        zIndex: 999,
        // width: "90%",
        marginHorizontal: 20
    },
    optionContainer:{
        padding: 20
    },
    title:{
        fontSize: 18,
        fontWeight: 'bold',
        padding: 20,
        paddingBottom: 0,
        color: color.FONT_MEDIUM
    },
    option:{
        fontSize: 16,
        fontWeight: 'bold',
        color: color.FONT,
        paddingVertical: 10,
        letterSpacing: 1
    },
    modalBg:{
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: color.MODAL_BG
    },
    optionItem: (width) =>({
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 10,
        width: width
    }),
    line:{
        width: 80,
        backgroundColor: color.FONT_MEDIUM,
        height: 5,
        alignSelf: 'center',
        borderRadius: 20,
        marginTop: 10
    }
})