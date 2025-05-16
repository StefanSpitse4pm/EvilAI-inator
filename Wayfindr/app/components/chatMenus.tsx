import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Text, ScrollView, StyleSheet, View, SafeAreaView, Pressable} from 'react-native';
const    ChatMenu = forwardRef((_, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const chatMenuHandeler = () => setIsVisible(prev => !prev);

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
            {testData.map(chat => (
                <Text key={chat.id}> {chat.name} </Text>
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
    }
})

export default ChatMenu;