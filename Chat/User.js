import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { apiBaseUrl } from "../ApiConfig";

const PeopleList = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      axios
        .get(`http://${apiBaseUrl}:8000/users/${userId}`)
        .then((response) => {
          setUsers(response.data);
          console.log(response.data);
          console.log(userId);
        })
        .catch((error) => {
          console.log("error retrieving users", error);
        });
    };

    fetchUsers();
  }, []);

  const handleUserPress = (user) => {
    const senderId = userId; // Assuming senderId is the current user's ID
    const receiverId = user._id; // Assuming receiverId is the selected user's ID

    createConversation(senderId, receiverId, user.fullName);
  };

  const createConversation = async (senderId, receiverId, receiverName) => {
    try {
      const response = await axios.post(`http://${apiBaseUrl}:8000/conversation`, {
        senderId,
        receiverId,
      });
      const conversationId = response.data; // Assuming the API returns the conversationId
      console.log(conversationId);

      navigation.goBack({ userId: senderId, receiverId, receiverName, conversationId });
    } catch (error) {
      console.error('Error creating conversation:', error);
      // Handle error appropriately
    }
  };

  return (
    <View style={{ flex: 1, padding: 5, backgroundColor: "#CEFADB" }}>
      <Text style={{ color: "#3498db", fontSize: 18, fontWeight: "bold" }}>
        People
      </Text>
      <ScrollView>
        {users.map((user) => (
          <TouchableOpacity
            key={user._id}
            onPress={() => handleUserPress(user)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: "#bdc3c7",
            }}
          >

            <Image
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                borderWidth: 2,
                borderColor: "#3498db",
              }}
              source={{ uri: user.image }}
            />
            <View style={{ marginLeft: 6 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {user.fullName}
              </Text>
              <Text style={{ fontSize: 12, color: "#7f8c8d" }}>{user.email}</Text>
            </View>


          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default PeopleList;
