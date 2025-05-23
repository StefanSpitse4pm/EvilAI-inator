import React, { useRef, useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Animated,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ChatMenu, { ChatMenuHandle } from "../components/chatMenus";

export default function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'dit is een test', isAI: true }
  ]);

  const chatMenuRef = useRef<ChatMenuHandle | null>(null);
  const heightAnim = useRef(new Animated.Value(60)).current;

  const focusInputHandler = () => {
    Animated.timing(heightAnim, {
      toValue: 120,
      duration: 150,
      useNativeDriver: false
    }).start(); // Start the animation!
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      isAI: false,
      text: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
  };

  const newChat = (chat: []) => {
    setMessages(chat);
  };

  const MessageWrapper = ({ message }) => {
    return (
      <View style={[
        styles.messageContent,
        message.isAI ? styles.aiMessage : styles.userMessage
      ]}>
        <Text>{message.text}</Text>
      </View>
    );
  };

  const handleClick = () => {
    chatMenuRef.current?.toggleChatMenu();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.messageContainer}>
        {messages.map(message => (
          <MessageWrapper key={message.id} message={message} />
        ))}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View style={[styles.inputContainer, { height: heightAnim }]}>
          <TouchableOpacity onPress={handleClick}>
            <MaterialCommunityIcons
              name="folder-open"
              size={24}
              color="#18aea9"
            />
          </TouchableOpacity>

          <TextInput
            style={styles.mainInput}
            value={input}
            onChangeText={setInput}
            multiline
            onSubmitEditing={sendMessage}
            placeholder="Wat is je vraag?"
            onFocus={focusInputHandler}
          />

          <TouchableOpacity onPress={sendMessage}>
            <MaterialCommunityIcons
              name="send"
              size={24}
              color="#18aea9"
            />
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>

      <ChatMenu ref={chatMenuRef} onChangeChat={newChat} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  mainInput: {
    backgroundColor: 'white',
    margin: 12,
    flex: 1,
    maxHeight: 100,
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  messageContent: {
    backgroundColor: 'white',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'gray',
    maxWidth: '70%',
    marginBottom: 20,
  },
});
