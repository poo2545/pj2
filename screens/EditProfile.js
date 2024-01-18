import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';  // Import expo-image-picker
import axios from "axios";
import { UserType } from "../UserContext";
import { apiBaseUrl } from '../ApiConfig';


const EditProfileScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ fontSize: 20, fontFamily: 'Kanit_400Regular', justifyContent: 'center' }}>แก้ไขข้อมูลส่วนตัว</Text>
      ),
      headerStyle: {
        backgroundColor: '#FFFFFF',
      },
    });
  }, []);

  const { userId, setUserId } = useContext(UserType);
  const [image, setUserImage] = useState(null);
  const [fullName, setFullName] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [diabetesType, setDiabetesType] = useState("");
  const [challengeCalorie, setChallengeCalorie] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      setUserImage(selectedImageUri);
    }
  };

  const saveChanges = () => {
    const updatedProfile = {
      fullName,
      weight: parseFloat(weight),
      height: parseFloat(height),
      dateOfBirth,
      email,
      password,
      image,
      diabetesType,
      challengeCalorie,
    };

    axios
      .put(`http://${apiBaseUrl}:8000/profile/${userId}`, updatedProfile)
      .then((response) => {
        navigation.navigate("Profile");
      })
      .catch((error) => {
        console.log("Error updating profile:", error);
      });
      alert({
        title: "แก้ไขสำเร็จ",
        message: "ข้อมูลของคุณได้รับการแก้ไขเรียบร้อยแล้ว",
        buttons: [{ text: "ตกลง" }],
        type: 'success', // You can customize the alert type
        style: { backgroundColor: '#52B788' }, // Customize the background color
        textStyle: { color: 'white' }, // Customize the text color
      });
  };


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://${apiBaseUrl}:8000/profile/${userId}`
        );
        const {
          fullName,
          email,
          password,
          image,
          dateOfBirth,
          weight,
          height,
          diabetesType,
          challengeCalorie,
        } = response.data;

        setFullName(fullName);
        setEmail(email);
        setPassword(password);
        setUserImage(image);
        setDateOfBirth(dateOfBirth);
        setWeight(weight);
        setHeight(height);
        setDiabetesType(diabetesType);
        setChallengeCalorie(challengeCalorie);

        console.log("profile weght", response.data);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchProfile();
  }, [userId]);

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        {image ? (
          <Image style={styles.profileImage} source={{ uri: image }} />
        ) : (
          <Image source={{ uri: image }} style={styles.profileImage} />
        )}

        <TouchableOpacity style={{ alignItems: 'center' }} onPress={pickImage}>
          <Text style={{ color: '#969696', fontSize: 15, fontFamily: 'Kanit_400Regular', marginBottom: 5 }}>แก้ไขรูปภาพ</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <Text style={styles.label}>ชื่อ-สกุล</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={(text) => setFullName(text)}
            placeholder="กรอกชื่อของคุณที่นี่"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>อีเมล</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>รหัสผ่าน</Text>
          <TextInput
            style={styles.input}
            placeholder="รหัสผ่าน"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label1}>น้ำหนัก</Text>
          <TextInput
            style={styles.input1}
            value={weight.toString()}
            onChangeText={(text) => setWeight(text)}
          />
          <Text style={styles.label1}>กิโลกรัม</Text>

          <Text style={styles.label1}>ส่วนสูง</Text>
          <TextInput
            style={styles.input}
            value={height.toString()}
            onChangeText={(text) => setHeight(text)}
          />
          <Text style={styles.label1}>เซนติเมตร</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>วัน เดือน ปีเกิด</Text>
          <TextInput
            style={styles.input}
            value={dateOfBirth}
            onChangeText={(text) => setDateOfBirth(text)}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>ประเภทเบาหวาน</Text>
          <TextInput
            style={styles.input}
            placeholder="ประเภทเบาหวาน"
            value={diabetesType}
            onChangeText={(text) => setDiabetesType(text)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={saveChanges}>
          <Text style={styles.buttonText}>บันทึก</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C2FFD3',
    padding: 20,
  },
  container2: {
    flex: 1,
    alignItems: 'center',
  }, 
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 5,
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#52B788',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Kanit_400Regular',
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    marginRight: 20,
    fontFamily: 'Kanit_400Regular',
  },
  label1: {
    fontSize: 18,
    marginRight: 10,
    fontFamily: 'Kanit_400Regular',
  },
  input1: {
    flex: 1,
    fontSize: 18,
    height: 50,
    borderBottomWidth: 1,

    paddingLeft: 1,
    fontFamily: 'Kanit_400Regular',
  },
  input: {
    flex: 1,
    fontSize: 18,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    paddingLeft: 1,
    fontFamily: 'Kanit_400Regular',
  },

});

export default EditProfileScreen;