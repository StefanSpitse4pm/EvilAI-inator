import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { Text, ScrollView, StyleSheet, View, SafeAreaView, Pressable, TouchableHighlight, TouchableOpacity, Animated, Dimensions} from 'react-native';
import { MaterialCommunityIcons} from '@expo/vector-icons';


const ChatMenu = forwardRef(({ onChangeChat }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const chatMenuHandeler = () => setIsVisible(prev => !prev);
    const [chatData, setChatData] = useState([
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
    ])

    const screenwidth = Dimensions.get('window').width;
    const slideAnim = useRef(new Animated.Value(-screenwidth)).current 

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: isVisible ? 0 : -screenwidth,
            duration: 150,
            useNativeDriver: true,
        }).start();
    }, [isVisible]);

    const handleChatChange = (chat: []) => {
        onChangeChat(chat);
        chatMenuHandeler();
    }

    useImperativeHandle(ref, () => ({
        toggleChatMenu: chatMenuHandeler
    }));

    const addChat = () => {
        const newChat = {id: chatData.length + 1, name:'new Chat', messages:[], date:''}
        setChatData([...chatData, newChat]);
        handleChatChange(newChat.messages);
    }

    const deleteChat = (chatId) => {
        const updatedChats = chatData.filter(chat => chat.id !== chatId);
        setChatData(updatedChats);   
    }



    return (
        isVisible && 
        <Animated.View style={[styles.container, 
            {transform: [{ translateX:slideAnim }]}
        ]} >
            <ScrollView style={styles.sidebar}>
            <View style={styles.newIcon}>
                <Text style={{padding: 10}}>
                    Chats
                </Text>
            
                <TouchableOpacity onPress={addChat}>
                     <MaterialCommunityIcons
                    name="plus-box"
                    size={24}
                    color='#18aea9'
                    />
                </TouchableOpacity>
            </View>

            {chatData.map(chat => (
                <View key={chat.id} style={styles.newIcon}>
                    <TouchableHighlight onPress={() => { handleChatChange(chat.messages)}}>
                        <Text style={styles.menuItem}>{ chat.name }</Text>
                    </TouchableHighlight>
                    <TouchableHighlight>
                        <MaterialCommunityIcons
                        name='trash-can'
                        size={24}
                        color='#FF0000'
                        style={styles.trashcan}
                        onPress={() => {
                            deleteChat(chat.id)
                        }}
                        />
                    </TouchableHighlight>
                </View>
            ))}
            </ScrollView>
            <Pressable style={styles.overlay} onPress={chatMenuHandeler}/>
        </Animated.View>
        
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
        backgroundColor:'#f5f5f5',
    },
    
    trashcan: {
        padding:10,
        backgroundColor:'#f5f5f5',
    },
    newIcon: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        backgroundColor:'#f5f5f5',
    }




})

export default ChatMenu;