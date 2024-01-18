import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import { useNavigation } from "@react-navigation/native";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { apiBaseUrl } from '../ApiConfig';

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(null);


  useEffect(() => {
    if (route.params?.conversationId) {
      setSelectedConversationId(route.params.conversationId);
      fetchMessages(route.params.conversationId);
    }
  }, [route.params?.conversationId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        setUserId(userId);
        const response = await axios.get(`http://${apiBaseUrl}:8000/users/${userId}`);
        setUsers(response.data);
        console.log(response.data);
        console.log(userId);
      } catch (error) {
        console.log("Error retrieving users", error);
      }
    };
    fetchUsers();
  }, []);

  const fetchMessages = async (conversationId, receiver) => {
    try {
      const res = await fetch(`http://${apiBaseUrl}:8000/message/${conversationId}?senderId=${userId}&receiverId=${receiver?.receiverId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const resData = await res.json();
      console.log(resData);
      setMessages(resData);
      setSelectedConversation({ conversationId, receiver });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

const sendMessage = async () => {
  try {
    if (message.trim() !== '' && selectedConversationId) {
      const updatedMessages = [...messages, { message, user: { id: userId } }];
      setMessages(updatedMessages);
      setMessage('');

      // Log the updated messages and other relevant information
      console.log('Updated Messages:', updatedMessages);
      console.log('Sending message:', {
        conversationId: selectedConversationId,
        senderId: userId,
        receiverId: selectedConversation?.receiver?.id,
        message,
      });

      // Send the message using axios post request
      await axios.post(`http://${apiBaseUrl}:8000/message`, {
        conversationId: selectedConversationId,
        senderId: userId,
        receiverId: selectedConversation?.receiver?.id,
        message,
      });

      console.log('Message sent successfully');

      // Fetch and log messages after sending the message
      fetchMessages(selectedConversationId, selectedConversation?.receiver);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

  return (
    <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', backgroundColor:'#D8FCD0'}}>
      <ScrollView style={{ flex: 1, width: '100%' }}>
        <View style={{ padding: 5 }}>
          {messages.length > 0 ? (
            messages.map(({ message, user: { id } = {} }, index) => (
              <View
                key={index}
                style={{
                  alignSelf: id === userId ? 'flex-end' : 'flex-start',
                  backgroundColor: id === userId ? '#52B788' : 'white',
                  padding: 8,
                  maxWidth: '60%',
                  borderRadius: 7,
                  margin: 10,
                  borderColor: id === userId ? 'white' : '#52B788',
                  borderWidth: 2,
                }}
              >
                <Text style={{ color: id === userId ? 'white' : 'black' , fontFamily: 'Kanit_400Regular'}}>{message}</Text>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: 'center', fontSize: 18,  marginTop: 24 , fontFamily: 'Kanit_400Regular'}}>
              No Messages or No Conversation Selected
            </Text>
          )}
        </View>
      </ScrollView>

      <KeyboardAvoidingView style={{ padding: 10, width: '100%', flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          placeholder='พิมพ์ข้อความ...'
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{ flex: 1, padding: 15, borderWidth: 1, borderColor: '#3498db', borderRadius: 20, backgroundColor: '#ecf0f1' , fontFamily: 'Kanit_400Regular'}}
        />
<TouchableOpacity
  style={{ marginLeft: 4, padding: 8, backgroundColor: '#ecf0f1', borderRadius: 20 , }}
  onPress={sendMessage}
>
  <Text style={{ fontFamily: 'Kanit_400Regular'}}>ส่ง</Text>
</TouchableOpacity>

      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen;
