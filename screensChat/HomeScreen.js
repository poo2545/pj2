import React, { useLayoutEffect, useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import User from "../components/User";
import { TextInput, View, StyleSheet, FlatList, Text, SafeAreaView, Image, Button, TouchableOpacity } from "react-native";
import { apiBaseUrl } from '../ApiConfig';

const HomeScreenChat = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  const [filteredUsers, setFilteredUsers] = useState([]); // State to hold filtered users

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (

        <Text style={{ padding: 10, fontSize: 20, fontFamily: 'Kanit_400Regular' }}>เพื่อน</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, padding: 10 }}>
          <Ionicons onPress={() => navigation.navigate("Chats")} name="chatbox-ellipses-outline" size={24} color="black" />
          <MaterialIcons
            onPress={() => navigation.navigate("Friends")}
            name="people-outline"
            size={24}
            color="black"
          />
        </View>
      ),
    });
  }, []);
  

  const filterUsers = () => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredUsers([]); // Clear search results if the search query is empty
    } else {
      filterUsers();
    }
  }, [searchQuery]);

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
        })
        .catch((error) => {
          console.log("error retrieving users", error);
        });
    };

    fetchUsers();
  }, []);

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isMessageVisible, setIsMessageVisible] = useState(true);
  const messages = [
    "1. ค้นหาผู้ใช้ ใช้ช่องค้นหา เพื่อค้นหาผู้ใช้หรือแพทย์จากชื่อของพวกเขา",
    "2. เพิ่มเพื่อน เมื่อคุณค้นพบผู้ใช้ที่คุณต้องการติดต่อ กดปุ่ม 'เพิ่มเพื่อน' เพื่อส่งคำขอเป็นเพื่อน ",
    "3. รอการยอมรับ หลังจากที่คุณส่งคำขอเป็นเพื่อน ผู้ใช้ที่คุณส่งคำขอจะต้องยอมรับคำขอก่อน จึงจะสามารถติดต่อกันได้ คุณอาจต้องรอสักครู่จนกว่าผู้ใช้อีกฝ่ายจะยอมรับคำขอ",
    "4. เริ่มสนทนา เมื่อคุณเป็นเพื่อนกัน คุณสามารถเริ่มสนทนาได้",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="ค้นหาผู้ใช้หรือแพทย์จากชื่อและนามสกุลเพื่อติดต่อ"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      {searchQuery ? (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <User item={item} />}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Image style={styles.logo} source={require('../assets/7.png')} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => { if (currentMessageIndex > 0) { setCurrentMessageIndex(currentMessageIndex - 1); } }}>
              <Image source={require('../assets/15.png')}
                style={{ width: 30, height: 30 }} resizeMode="cover" />
            </TouchableOpacity>
            <Text style={styles.noResultsText}>วิธีใช้งาน</Text>
            <TouchableOpacity onPress={() => { if (currentMessageIndex < messages.length - 1) { setCurrentMessageIndex(currentMessageIndex + 1); } }} style={styles.button} >
              <Image source={require('../assets/16.png')}
                style={{ width: 30, height: 30 }} resizeMode="cover" />
            </TouchableOpacity>
          </View>
          <View style={styles.rowRow}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.noResultsText}>{messages[currentMessageIndex]}</Text>
              </View>

            </View>
          </View>

        </View>

      )}

    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C2FFD3",
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginTop: 7,
    opacity: 0.5,
  },
  rowRow: {
    width: '90%',
    height: '12%',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    opacity: 0.5,
  },
  header: {
    width: '100%',
    height: 45,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "#52B788",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    marginTop: 30,
    fontFamily: 'Kanit_400Regular',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  textStyle: {
    color: '#fff',
    fontSize: 18,
  },
  logo: {
    width: 300,
    height: 300,
    marginTop: 50,
    opacity: 0.5
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'Kanit_400Regular',
    marginTop:5,
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
});

export default HomeScreenChat;
