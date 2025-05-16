import React, {useRef, useState} from "react";
import { View, ScrollView, TextInput, StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons} from '@expo/vector-icons';



const Message = () => {
    <View >
        
    </View>
}

export default function Chatbot() {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        {id: 1,text:'dit is een test', isAI:true}
    ])
    
    
    

    // const scrollViewRef = useRef();
    const sendMessage = async () => {
       const userMessage = {
           id: messages.length + 1, 
           isAI: false,
           text: input.trim(),
       }
       setMessages(prev => [...prev, userMessage])
       setInput('');

    }

    const MessageWrapper = ({ message }) => {
        return(
            <View style= {[styles.messageContent, message.isAI ? styles.aiMessage : styles.userMessage]}>
                <Text>{ message.text }</Text>
            </View>
        )
    }

    return (
    <SafeAreaView style={styles.container}>


        <ScrollView style={styles.messageContainer}
>
            {messages.map(message => (
          <MessageWrapper key={message.id} message={message} />
        ))}
        </ScrollView>


        <KeyboardAvoidingView style={styles.inputContainer}>
            <TextInput style={styles.mainInput} value={input} onChangeText={setInput} multiline onSubmitEditing={sendMessage} placeholder="Wat is je vraag?" />
            
            <TouchableOpacity onPress={sendMessage}>
            <MaterialCommunityIcons
              name="send"
              size={24}
              color='#18aea9'
            />
            </TouchableOpacity>
        </KeyboardAvoidingView>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    messageContainer: {
        display: 'flex',
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainInput: {
        
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 12,
        margin: 12,
        width: '80%',
        maxHeight: 100,
    },
    sendButtton: {
        width: 44, 
        height: 44,
    },
    userMessage: {
        alignSelf: 'flex-end'
    },
    aiMessage: {
        alignSelf: 'flex-start'
    },
    messageContent: {
        backgroundColor:'white',
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: 'gray',
        maxWidth: '50%',
        marginBottom: 20,
    }

})
