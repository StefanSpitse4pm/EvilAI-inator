import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Text, Button, ScrollView, StyleSheet, View, SafeAreaView, Pressable, TouchableWithoutFeedback, TouchableHighlight} from 'react-native';
const ChatMenu = forwardRef(({ onChangeChat }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const chatMenuHandeler = () => setIsVisible(prev => !prev);

    const handleChatChange = (chat: []) => {
        onChangeChat(chat)
    }

    useImperativeHandle(ref, () => ({
        toggleChatMenu: chatMenuHandeler
    }));


    const testData = [
        {
            id:1,
            name:'first generated chat',
            messages: [{id:1, text:'what no wayyyyy' , isAI:false}, {id:2, text:'what no wayy againnnnnnnn' , isAI:true}],
            date:'16-6-2025',
        }, 
        {
            id:2,   
            name:'second generated chat',
            messages: [{id:1, text:'what no wayy jose' , isAI:false}, {id:2, text:'what no wayayayaya oh my gawd' , isAI:true}],
            date:'16-6-2025',
        }
    ] 


    return (
        isVisible && 
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.sidebar}>
            <Text style={{padding: 10}}>Chats</Text>
            {testData.map(chat => (
                <View key={chat.id}>
                    <TouchableHighlight onPress={() => { handleChatChange(chat.messages)}}>
                        <Text style={styles.menuItem}>{ chat.name }</Text>
                    </TouchableHighlight>
                </View>
            ))}
            </ScrollView>
            <Pressable style={styles.overlay} onPress={chatMenuHandeler}/>
        </SafeAreaView>
        
    )
});


export interface ChatMenuHandle {
    toggleChatMenu: () => void;
}

const styles = StyleSheet.create({ 
    container: {
        position: 'absolute',
        top: 0,
        height: '100%',
        width: '100%',

    },

    sidebar: {
        position: 'absolute',
        top:0,
        height: '100%',
        width: '80%',
        backgroundColor:'white',
        zIndex: 10,

    },
    overlay: {
        position: 'absolute',
        left: '80%',
        top:0,
        height: '100%',
        width: '20%',
        backgroundColor:'gray',
        opacity: 0.5,
        zIndex: 11,
    },
    menuItem: {
        padding:10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        backgroundColor:'#f5f5f5'

    }

})

export default ChatMenu;