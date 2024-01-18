import React, { useLayoutEffect, useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { View, Text, Image, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { apiBaseUrl } from '../ApiConfig';

const Conversation = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ padding: 10, fontSize: 20, fontFamily: 'Kanit_400Regular' }}>แชท</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, padding: 10 }}>
          <MaterialIcons
            onPress={() => navigation.navigate("Users")}
            name="people-outline"
            size={24}
            color="black"
          />
        </View>
      ),
    });
  }, []);

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

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(`http://${apiBaseUrl}:8000/conversations/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.log("Error fetching conversations", error);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    onRefresh(); // Initial fetch
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, padding: 5, backgroundColor: '#CEFADB' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {conversations.length > 0 ? (
        conversations.map((conversation) => (
          <View key={conversation.conversationId} style={{ marginHorizontal: 14, marginTop: 10 , fontFamily: 'Kanit_400Regular'}}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: '#bdc3c7',
                fontFamily: 'Kanit_400Regular',
              }}
              onPress={() => navigation.navigate('Messages', { conversationId: conversation.conversationId })}
            >
              <Image
                source={{ uri: conversation.user.image }}
                style={{ width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#06B452' }}
              />
              <View style={{ marginLeft: 6 }}>
                <Text style={{ fontSize: 18,  fontFamily: 'Kanit_400Regular'}}>{conversation.user.fullName}</Text>
                <Text style={{ fontSize: 14, color: '#7f8c8d', fontFamily: 'Kanit_400Regular' }}>{conversation.user.email}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={{ textAlign: 'center', fontSize: 16, color: '#7f8c8d', marginTop: 24 }}>No Conversations</Text>
      )}
    </ScrollView>
  );
};

export default Conversation;
