import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect, useContext } from 'react';
import { Text, ScrollView, StyleSheet, View, SafeAreaView, Pressable, TouchableHighlight, TouchableOpacity, Animated, Dimensions} from 'react-native';
import { MaterialCommunityIcons} from '@expo/vector-icons';
import { AuthContext } from '@/context/AuthContext';

// Define the API base URL here
const API_BASE_URL = 'http://141.252.152.11:8000';

interface ChatMenuProps {
    onChangeChat: (chat: any[], conversationId: number) => void;
}

const ChatMenu = forwardRef(({ onChangeChat }: ChatMenuProps, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const chatMenuHandeler = () => setIsVisible(prev => !prev);
    const [isLoading, setIsLoading] = useState(true);

    interface Chat {
        id: number;
        messages: any[];
        date: string;
    }
    const [chatData, setChatData] = useState<Chat[]>([])
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (isVisible) {
            fetchChats();
        }
    }, [isVisible]);    
    const screenwidth = Dimensions.get('window').width;
    const slideAnim = useRef(new Animated.Value(-screenwidth)).current 

    const fetchChats = () => {
        setIsLoading(true)
        console.log("Fetching chats with token: ", token);
        fetch(`${API_BASE_URL}/conversations`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
        ).then(response => response.json())
        .then((data: any[]) => {
            Promise.all(
                data.map(async (chat: any, index: number) => {
                    const response = await fetch(`${API_BASE_URL}/prompts/` + chat['ConversationID'], {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });
                    if (response.ok) {
                        const messages = await response.json();
                        const chatMessages = messages.flatMap((prompt: any) => [
                            {
                                id: prompt.PromptID * 2 - 1,
                                isAI: false,
                                text: prompt.Message,
                            },
                            {
                                id: prompt.PromptID * 2,
                                isAI: true,
                                text: prompt.Response.replace(/<think>[\s\S]*?<\/think>/gi, '').trim(),
                            }
                        ]);
                        return {
                            id: chat.ConversationID,
                            messages: chatMessages,
                            date: chat.Created_at,
                        };
                    } else if (response.status === 404) {
                        return {
                            id: chat.ConversationID,
                            messages: [],
                            date: chat.Created_at,
                        };
                    }
                })
            ).then((chats) => {
                setChatData(chats.filter(Boolean) as Chat[]);
                setIsLoading(false);
            });
        });
    }

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: isVisible ? 0 : -screenwidth,
            duration: 150,
            useNativeDriver: true,
        }).start();
    }, [isVisible]);

    const handleChatChange = (chat: Chat) => {
        onChangeChat(chat.messages, chat.id);
        chatMenuHandeler();
    }

    useImperativeHandle(ref, () => ({
        toggleChatMenu: chatMenuHandeler
    }));

    const addChat = () => {
        fetch(`${API_BASE_URL}/conversation`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then((data: any) => {
            const newChat: Chat = {
                id: data.conversation_id,
                messages: [],
                date: data.Created_at,
            };
            setChatData(prevChats => [...prevChats, newChat]);
            handleChatChange(newChat);
        })
        .catch(error => {
            console.error('Error creating new chat:', error);
        });
    }

    const deleteChat = (chatId: number) => {
        const updatedChats = chatData.filter(chat => chat.id !== chatId);
        
        const response = fetch(`${API_BASE_URL}/conversation/${chatId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })



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
            {isLoading ? (
                <Text>Loading...</Text>
            ) : (
            chatData.map(chat => (
                <View key={chat.id} style={styles.newIcon}>
                    <TouchableHighlight onPress={() => { handleChatChange(chat)}}>
                        <Text style={styles.menuItem}>{ chat.date }</Text>
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
            )))}
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
