import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext  , useLayoutEffect } from "react";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import { apiBaseUrl } from '../ApiConfig';

const FriendRequest = ({ item, friendRequests, setFriendRequests }) => {
  const { userId, setUserId } = useContext(UserType);
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

  const acceptRequest = async (friendRequestId) => {
    try {
      const response = await fetch(
        `http://${apiBaseUrl}:8000/friend-request/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: friendRequestId,
            recepientId: userId,
          }),
        }
      );

      if (response.ok) {
        setFriendRequests(
          friendRequests.filter((request) => request._id !== friendRequestId)
        );
        navigation.navigate("Chats");
      }
    } catch (err) {
      console.log("error acceptin the friend request", err);
    }
  };

  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor:'white',
        borderWidth: 0.7,
        borderColor: "#D0D0D0",
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        padding: 10,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25 }}
        source={{ uri: item.image }}
      />

      <Text
        style={{ fontSize: 15, marginLeft: 10, flex: 1 ,  fontFamily: 'Kanit_400Regular', }}>
        {item?.name} ส่งคำร้องขอเป็นเพื่อนกับคุณ 
      </Text>

      <Pressable
        onPress={() => acceptRequest(item._id)}
        style={{ backgroundColor: "#52B788", padding: 10, borderRadius: 6 }}
      >
        <Text style={{ textAlign: "center", color: "white" ,  fontFamily: 'Kanit_400Regular' }}> ยอมรับคำขอ </Text>
      </Pressable>
    </Pressable>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({});
