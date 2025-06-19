import React, { useRef, useState, useContext } from "react";
import { View, ScrollView, TextInput, StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ChatMenu, { ChatMenuHandle } from "../components/chatMenus";
import UniversalHeader from "../components/universalHeader";
import { AuthContext } from '@/context/AuthContext';


const API_BASE_URL = 'https://api.tobiasschipper.tech';

export default function Chatbot() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Wat is je vraag?', isAI: true }
  ]);
  const chatMenuRef = useRef<ChatMenuHandle | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const { token } = useContext(AuthContext);

  const sendMessage = async () => {
    const userMessage = {
      id: messages.length + 1,
      isAI: false,
      text: input.trim(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true)

    let currentConversationId = conversationId

    if (!currentConversationId) {
      try {
        const response = await fetch(`${API_BASE_URL}/conversation`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        const data = await response.json();
        currentConversationId = data.conversation_id;
        setConversationId(currentConversationId);
      }
      catch (error) {
        console.log("Error creating new chat: ", error);
        setIsLoading(false)
        return
      }

      
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/ask?message=${encodeURIComponent(input.trim())}&conversation_id=${currentConversationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      let aiMessageId = messages.length + 2;
      setMessages(prev => [
        ...prev,
        { id: aiMessageId, isAI: true, text: '' }
      ]);

      // Check if streaming is supported (web only)
      if (response.body && typeof response.body.getReader === "function") {
        const reader = response.body.getReader();
        let aiText = '';
        let done = false;
        while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;
          if (value) {
            const chunk = new TextDecoder().decode(value);
            aiText += chunk;
            setMessages(prev =>
              prev.map(msg =>
                msg.id === aiMessageId ? { ...msg, text: aiText } : msg
              )
            );
          }
        }
      } else {
        // Fallback for React Native (mobile): no streaming, just update once
        const aiText = await response.text();
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId ? { ...msg, text: aiText } : msg
          )
        );
      }
    } catch (error) {
      console.log(error)
      setMessages(prev => [
        ...prev,
        { id: messages.length + 2, isAI: true, text: 'Er is een fout opgetreden.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const newChat = (chat: any[] = [], conversationId: number) => {
    setMessages(chat);
    setConversationId(conversationId)
  };

  type Message = {
    id: number;
    text: string;
    isAI: boolean;
  };

  const MessageWrapper = ({ message }: { message: Message }) => {
    return (
      <View style={[
        styles.messageContent,
        message.isAI ? styles.aiMessage : styles.userMessage,
        message.isAI ? styles.aiBubble : styles.userBubble
      ]}>
        <Text style={message.isAI ? styles.aiText : styles.userText}>{message.text}</Text>
      </View>
    );
  };

  const handleClick = () => {
    if (chatMenuRef.current) {
      chatMenuRef.current?.toggleChatMenu();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 90}
    >
      <UniversalHeader
        title="Chatbot"
        rightButton={{
          onPress: handleClick,
          icon: <MaterialCommunityIcons name="folder-open" size={28} color="#18aea9" />,
          style: { padding: 8 },
        }}
      />

      <ScrollView style={styles.messageContainer} contentContainerStyle={{ paddingBottom: 16 }}>
        {messages.map(message => (
          <MessageWrapper key={message.id} message={message} />
        ))}
      </ScrollView>
      <View style={styles.inputBarShadow}>
        <View style={styles.inputContainerModern}>
          {/* Removed the folder icon button from here */}
          <View style={styles.inputBoxModern}>
            <TextInput
              style={styles.mainInputModern}
              value={input}
              onChangeText={setInput}
              multiline
              placeholder="Stel een vraag..."
              placeholderTextColor="#888"
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity
              onPress={sendMessage}
              style={[
                styles.sendButtonModern,
                input.trim() ? styles.sendButtonActive : styles.sendButtonDisabled
              ]}
              disabled={!input.trim()}
            >
              <MaterialCommunityIcons
                name="send"
                size={22}
                color={input.trim() ? '#fff' : '#b0b0b0'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ChatMenu ref={chatMenuRef} onChangeChat={newChat} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  messageContainer: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  inputBarShadow: {
    backgroundColor: '#f7f8fa',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 8,
  },
  inputContainerModern: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: '#f7f8fa',
  },
  // iconButtonModern: removed from usage
  inputBoxModern: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  mainInputModern: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 0,
    minHeight: 36,
    maxHeight: 100,
  },
  sendButtonModern: {
    marginLeft: 8,
    borderRadius: 20,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  sendButtonActive: {
    backgroundColor: '#18aea9',
  },
  sendButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#18aea9',
    borderTopRightRadius: 0,
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 16,
    borderColor: '#18aea9',
    marginBottom: 12,
    maxWidth: '80%',
  },
  aiBubble: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 16,
    borderColor: '#e0e0e0',
    marginBottom: 12,
    maxWidth: '80%',
    borderWidth: 1,
  },
  userText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  aiText: {
    color: '#222',
    fontSize: 16,
    lineHeight: 22,
  },
  messageContent: {
    padding: 14,
    borderWidth: 0,
    marginBottom: 0,
  },
});
