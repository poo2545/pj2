import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View, SafeAreaView, Image, TouchableOpacity, Alert
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts, Kanit_400Regular } from '@expo-google-fonts/kanit';
import { apiBaseUrl } from '../ApiConfig';

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (token) {
          navigation.replace("Main");
        } else {
          // token not found , show the login screen itself
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    checkLoginStatus();
  }, []);


  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };

    axios.post(`http://${apiBaseUrl}:8000/login`, user)

      .then((response) => {
        console.log(response);
        const token = response.data.token;
        AsyncStorage.setItem("authToken", token);

        navigation.replace("Main");
      })
      .catch((error) => {
        Alert.alert("Login Error", "Invalid email or password");
        console.log("Login Error", error);
      });
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

let [fontsLoaded] = useFonts({
    Kanit_400Regular,
});

if (!fontsLoaded) {
    return null;
}

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#C2FFD3', '#FFFFFF']} // Define your gradient colors here
        style={styles.gradient}>
        <Image style={styles.logo} source={require('../assets/logo3.png')} />

        <Image style={styles.bg} source={require('../assets/7.png')} />

        <View style={styles.inputContainer}>
          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            placeholder="อีเมล"
            placeholderTextColor="#808080"
          />
          <TextInput
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={!showPassword}
            style={styles.input}
            placeholder="รหัสผ่าน"
            placeholderTextColor="#808080"
          />
          {password && (
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.toggleButton}>
              <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#808080" />
            </TouchableOpacity>
          )}
        </View>

        <View style={{ alignSelf: 'center', padding:10}} >
            <Text style={styles.buttonText1}></Text>
          </View>

        <View style={styles.gradient} >
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}>
            <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonRegis}
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.buttonTextRegis}>สร้างบัญชี</Text>
          </TouchableOpacity>
        </View>

      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#52B788',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:1,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Kanit_400Regular',
  },
  buttonText1: {
    color: '#BBBBBB',
    fontSize: 15,
    marginTop: 20,
    fontFamily: 'Kanit_400Regular',
  },
  logo: {
    width: 300,
    height: 100,
    marginTop:50,
  },
  bg: {
    width: 200,
    height: 200,
    marginTop:25,
  },
  inputContainer: {
    alignItems: 'center',
    width: '90%',
  },
  input: {
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    fontSize: 16,
    marginBottom: -20,
    marginTop: 30,
    fontFamily: 'Kanit_400Regular',
  },
  bottomButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 30,
    width: '100%',
    alignItems: 'center'
  },
  buttonRegis: {
    width: '90%',
    height: 50,
    borderWidth: 2,           // Adjust the border width as needed
    borderColor: '#52B788',  // Use the green color code you prefer
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '35%',
  },
  buttonTextRegis: {
    color: '#52B788',
    fontSize: 18,
    fontFamily: 'Kanit_400Regular',
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
    top: 105,
  },
});

export default LoginScreen