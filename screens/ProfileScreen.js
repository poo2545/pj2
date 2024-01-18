import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import { View, Text, Image, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import NutrientsGraph from '../components/NutrientsGraph';
import { apiBaseUrl } from '../ApiConfig';

const ProfileScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();
  const [user, setUser] = useState({});
  const [userImage, setUserImage] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [weight, setWeight] = useState("");
  const [fullName, setFullName] = useState("");
  const [height, setHeight] = useState("");
  const [diabetesType, setDiabetesType] = useState("");

  const [isRefreshing, setIsRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ fontSize: 20, fontFamily: 'Kanit_400Regular', justifyContent: 'center' }}>โปร์ไฟล์</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, padding: 10 }}>
          <TouchableOpacity onPress={logout}>
            <Ionicons name="log-out-outline" size={24} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRefresh}>
            <Ionicons name="refresh-outline" size={24} color="#000000" />
          </TouchableOpacity>
        </View>
      ),
      headerStyle: {
        backgroundColor: '#FFFFFF',
      },
    });
  }, [navigation, handleRefresh]);

  const logout = () => {
    clearAuthToken();
  }

  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken");
    console.log("Cleared auth token");
    navigation.replace("Login");
  }
  const editProfile = () => {
    navigation.navigate("EditProfileScreen");
  };
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProfile(userId);
    setIsRefreshing(false);
  };
  useEffect(() => {
    fetchProfile(userId);
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `http://${apiBaseUrl}:8000/profile/${userId}`
      );
      const { user, fullName, image, dateOfBirth, weight, height, diabetesType } = response.data;

      setUser(user);
      setUserImage(image);  // Ensure that this is correctly set
      setFullName(fullName);
      setDateOfBirth(dateOfBirth);
      setHeight(height);
      setWeight(weight);
      console.log('img', response.data);
      setDiabetesType(diabetesType);
    } catch (error) {
      console.log("error", error);
    }
  };


  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "ไม่ระบุ";
    const birthDate = new Date(dateOfBirth);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const isSameMonth = currentDate.getMonth() === birthDate.getMonth();
    const isSameDay = currentDate.getDate() === birthDate.getDate();

    if (!isSameMonth || !isSameDay) {
      if (currentDate < new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate())) {
        return age - 1;
      }
    }
    return age;
  };

  const calculateBMI = () => {
    if (!weight || !height) {
      return "ไม่สามารถคำนวณได้";
    }
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    if (bmi < 18.5) {
      return `${bmi} (น้ำหนักต่ำ)`;
    } else if (bmi >= 18.5 && bmi < 24.9) {
      return `${bmi} (น้ำหนักปกติ)`;
    } else if (bmi >= 25 && bmi < 29.9) {
      return `${bmi} (น้ำหนักเกิน)`;
    } else {
      return `${bmi} (อ้วน)`;
    }
  };

  const renderBMI = () => (
    <Text style={styles.bio}>BMI: {calculateBMI()}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>


      <View style={styles.medicationContainer}>
        <View style={styles.leftContainer}>
      <Image
        style={styles.profileImage}
        source={{ uri: userImage }}
      />
          <Text style={{ fontSize: 20, fontFamily: 'Kanit_400Regular' }}>{fullName}</Text>
          <Text style={styles.bio}>อายุ {calculateAge(dateOfBirth)} ปี</Text>
          <Text style={styles.bio}>{renderBMI()}</Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.bio}>น้ำหนัก {weight} กิโลกรัม</Text>
          <Text style={styles.bio}>ส่วนสูง {height} เซนติเมตร</Text>
          <Text style={styles.bio}>เบาหวาน: {diabetesType}</Text>
          <Pressable
            style={{ justifyContent: "center", alignItems: "center", padding: 10, borderColor: "#D0D0D0", borderWidth: 1, borderRadius: 5, marginBottom: 10 }}
            onPress={editProfile}
          >
            <Text>Edit Profile</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.graph}>
        <View style={styles.containerGraph}>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
            <NutrientsGraph />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C2FFD3',
    alignItems: 'center',
  },
  medicationContainer: {
    flexDirection: 'row',
    width: '95%',
    height: '32%',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  leftContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 15
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  bio: {
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
    margin: 5,
  },
  buttonContainer: {
    flexDirection: 'flex-end',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#52B788',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  graph: {
    width: '95%',
    height: '60%',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  containerGraph: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 15,
  },
});

export default ProfileScreen;
