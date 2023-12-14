import React, { useLayoutEffect, useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import User from "../components/User";
import { UserType } from "../UserContext";
import { apiBaseUrl } from '../ApiConfig';

const HomePage = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ fontSize: 20,fontFamily: 'Kanit_400Regular', justifyContent: 'center' }}>คำแนะนำ</Text>
      ),
      headerStyle: {
        backgroundColor: '#FFFFFF',
      },
    });
  }, []);
  
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
  return (
    <>
    <SafeAreaView style={styles.container}>
      <View style={styles.krop}>
        <Text style={styles.buttonText1}>สำหรับคุณ</Text>
        <Image style={styles.logo1} source={require('../assets/food.png')} />

        <Text style={styles.fonts}>
          ควรได้รับพลังงานจากอาหาร
        </Text>
        <Text style={styles.fonts}>
        วันละ 1,200-1,600 กิโลแคลอรี่
        </Text>

        <View style={styles.container2}>
          <View style={styles.circle}>
            <Text style={styles.text}>โปรตีน</Text>
          </View>
          <View style={styles.circle1}>
            <Text style={styles.text}>ไขมัน</Text>
          </View>
          <View style={styles.circle2}>
            <Text style={styles.text}>คาร์โบ</Text>
            <Text style={styles.text}>ไฮเดรต</Text>
          </View>
        </View>

        <View style={styles.container2}>
          <View>
            <Text style={styles.detailText}>
              ร้อยละ 12-15 ของพลังงานที่ได้รับ
            </Text>
          </View>
          <View>
            <Text style={styles.detailText}>
              ไม่เกินร้อยละ 30 ของพลังงานที่ได้รับ
            </Text>
          </View>
          <View>
            <Text style={styles.detailText}>
              ร้อยละ 55-60 ของพลังงานที่ได้รับ
            </Text>
          </View>
        </View>
      </View>

      <Text style={{fontFamily: 'Kanit_400Regular', marginTop:20 , }}>แนะนำอื่นๆ</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RecommendFood')}>
        <Text style={styles.buttonText}>อาหารที่ควรงด</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RecommendFood2')}>
        <Text style={styles.buttonText}>อาหารและปริมาณที่แนะนำ</Text>
      </TouchableOpacity> */}
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C2FFD3',
    alignItems: 'center',
  },
  krop: {
    width: '95%',
    height: '60%',
    flexShrink: 0,
    backgroundColor: '#FFF',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    width: 300,
    height: 50,
    backgroundColor: '#52B788',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10, // Add some spacing between buttons
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Kanit_400Regular',
    fontSize: 18,
  },
  buttonText1: {
    fontSize: 20,
    color: '#000',
    marginTop: 10,
    fontFamily: 'Kanit_400Regular'
  },

  fonts: {
    color: '#5C5C5C',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '400',
    fontFamily: 'Kanit_400Regular'
  },
  logo1: {
    width: 250,
    height: 150,
    borderRadius: 5,
    marginTop: 5,
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    gap: 30,
    flexDirection: 'row',
    marginTop: 15,
  },
  circle: {
    width: 75,
    height: 75,
    borderRadius: 75,
    backgroundColor: 'white', // Change to your desired background color
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 7,
    borderColor: '#FF88F3',
  },

  circle1: {
    width: 75,
    height: 75,
    borderRadius: 75,
    backgroundColor: 'white', // Change to your desired background color
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 7,
    borderColor: '#FFE68C',
  },

  circle2: {
    width: 75,
    height: 75,
    borderRadius: 75,
    backgroundColor: 'white', // Change to your desired background color
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 7,
    borderColor: '#A6E4FF',
  },
  text: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Kanit_400Regular'
  },
  detailText: {
    color: 'black',
    textAlign: 'center',
    fontFamily: 'Kanit_400Regular',
    fontSize: 12,
    width: 95,
    height: 50,
  },
  textStyle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    padding: 7,
    fontFamily: 'Kanit_400Regular'
  },
});
export default HomePage;