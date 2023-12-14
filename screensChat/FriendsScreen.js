import { StyleSheet, Text, View,SafeAreaView } from "react-native";
import React, { useEffect, useContext, useState , useLayoutEffect} from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import FriendRequest from "../components/FriendRequest";
import { useNavigation } from "@react-navigation/native";
import { apiBaseUrl } from '../ApiConfig';

const FriendsScreen = () => {
  const { userId, setUserId } = useContext(UserType); // Use useContext to access the context
  const [friendRequests, setFriendRequests] = useState([]);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ fontSize: 20, fontFamily: 'Kanit_400Regular', justifyContent: 'center' }}>คำขอเป็นเพื่อน</Text>
      ),
      headerStyle: {
        backgroundColor: '#FFFFFF',
      },
    });
  }, []);

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(
        `http://${apiBaseUrl}:8000/friend-request/${userId}`
      );
      if (response.status === 200) {
        const friendRequestsData = response.data.map((friendRequest) => ({
          _id: friendRequest._id,
          name: friendRequest.name,
          email: friendRequest.email,
          image: friendRequest.image,
        }));

        setFriendRequests(friendRequestsData);
      }
    } catch (err) {
      console.log("error message", err);
    }
  };

  console.log(friendRequests);

  return (
    <SafeAreaView style={{backgroundColor:'#C2FFD3' , flex: 1  }}>
      <View style={{ padding: 10, marginHorizontal: 12 }}>
      {friendRequests.length > 0 && <Text style={{fontFamily: 'Kanit_400Regular'}}>คำขอเป็นเพื่อน</Text>}

      {friendRequests.map((item, index) => (
        <FriendRequest 
          key={index}
          item={item}
          friendRequests={friendRequests}
          setFriendRequests={setFriendRequests}
        />
      ))}
      </View>
    </SafeAreaView>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({});
