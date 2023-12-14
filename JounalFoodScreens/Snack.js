import React, { useState, useLayoutEffect , useContext , useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, SafeAreaView , ActivityIndicator , FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import { UserType } from '../UserContext';
import axios from 'axios';

const TabMenu = () => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ fontSize: 20,  fontFamily: 'Kanit_400Regular', justifyContent: 'center' }}>อาหารว่าง</Text>
      ),
      headerStyle: {
        backgroundColor: 'white',
      },
    });
  }, []);
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Tab1'); // Initial active tab
  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };

  const [mealNameState, setMealName] = useState('');
  const [caloriesState, setCalories] = useState('');
  const [nutrientsProtienState, setNutrientsProtien] = useState('');
  const [nutrientsFatState, setNutrientsFat] = useState('');
  const [nutrientsCabohidratState, setNutrientsCabohidrat] = useState('');
  const [nutrientsFiberState, setNutrientsFiber] = useState('');
  const { userId, setUserId } = useContext(UserType);

  const recordMeal = async () => {
    try {
      const response = await axios.post('http://10.0.14.153:8000/patientMeals', {
        userId,
        mealName: mealNameState, // Use correct variable names here
        calories: caloriesState,
        nutrientsProtien: nutrientsProtienState,
        nutrientsFat: nutrientsFatState,
        nutrientsCabohidrat: nutrientsCabohidratState,
        nutrientsFiber:nutrientsFiberState,
      });
      console.log('Created:', response.data);
      setMealName('');
      setCalories('');
      setNutrientsProtien('');
      setNutrientsFat('');
      setNutrientsCabohidrat('');
      setNutrientsFiber('');
      alert('บันทึกสำเร็จ');
    } catch (error) {
      console.error('Error creating:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status code:', error.response?.status);
      alert('An error occurred while recording medication. Please try again later.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabMenu}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Tab1' && styles.activeTab]}
          onPress={() => handleTabPress('Tab1')}
        >
          <Text style={styles.tabText}>ค้นหา</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'Tab2' && styles.activeTab]}
          onPress={() => handleTabPress('Tab2')}
        >
          <Text style={styles.tabText}>เพิ่มรายการอาหาร</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'Tab1' &&
        <View>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={24}
              color="gray"
              onPress={() => navigation.navigate("calendar")}
              style={styles.calendarIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="ค้นหารายการอาหาร..."
            />
          </View>
        </View>
      }

      {activeTab === 'Tab2' &&
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={styles.rectangle4179}>
            <Text style={{ fontSize: 20, fontFamily: 'Kanit_400Regular', color: 'white', marginTop: 2 }}> เพิ่มรายการอาหาร</Text>
            <TextInput
              style={styles.input}
              placeholder="กรอกชื่ออาหาร"
              placeholderTextColor="#808080"
              value={mealNameState}
              onChangeText={setMealName}
            />
            <TextInput
              style={styles.input}
              placeholder="แคลอรี่"
              placeholderTextColor="#808080"
              value={caloriesState}
              onChangeText={setCalories}
            />
          </View>

          <View style={styles.rectangle4178}>
            <Text style={{ fontSize: 20, fontFamily: 'Kanit_400Regular', color: 'white' }}>สารอาหาร (กรัม)</Text>
            <TextInput
              style={styles.input}
              placeholder="โปรตีน"
              placeholderTextColor="#808080"
              value={nutrientsProtienState}
              onChangeText={setNutrientsProtien}
            />
            <TextInput
              style={styles.input}
              placeholder="ไขมัน"
              placeholderTextColor="#808080"
              value={nutrientsFatState}
              onChangeText={setNutrientsFat}
            />
            <TextInput
              style={styles.input}
              placeholder="คาร์โบไฮเดรต"
              placeholderTextColor="#808080"
              value={nutrientsCabohidratState}
              onChangeText={setNutrientsCabohidrat}
            />
            <TextInput
              style={styles.input}
              placeholder="ไฟเบอร์"
              placeholderTextColor="#808080"
              value={nutrientsFiberState}
              onChangeText={setNutrientsFiber}
            />
          </View>

          <TouchableOpacity
            style={{ marginTop: 20, width: 257, height: 46, flexShrink: 0, backgroundColor: '#233145', borderRadius: 30, alignItems: 'center', justifyContent: 'center', fontFamily: 'Kanit_400Regular' }} 
            onPress={recordMeal}>
            <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', fontFamily: 'Kanit_400Regular' }}> บันทึก</Text>
          </TouchableOpacity>
        </View>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#C2FFD3',
  },
  tabMenu: {
    flexDirection: 'row',
    marginBottom: 5,
    fontFamily: 'Kanit_400Regular',
  },
  tab: {
    width: '45%',
    padding: 10,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
    borderRadius: 5,
    marginTop: 20,
    fontFamily: 'Kanit_400Regular',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#52B788',
  },
  tabText: {
    color: 'white',
    fontFamily: 'Kanit_400Regular',
  },
  circle1: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  circle2: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#E4E4E4',
    borderRadius: 30,
    paddingHorizontal: 10,
    fontSize: 20,
    height: 45,
    width: '90%',
    marginTop: 10,

  },
  calendarIcon: {
    marginRight: 8, // ระยะห่างระหว่างไอคอนและ TextInput
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Kanit_400Regular',
  },
  input: {
    backgroundColor: '#fff',
    height: 45,
    borderRadius: 5,
    marginVertical: 5,
    paddingHorizontal: 20,
    width: '80%',
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
  },
  rectangle4179: {
    width: 350,
    height: 180,
    flexShrink: 0,
    backgroundColor: '#A8DEB0',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  rectangle4178: {
    width: 350,
    height: 280,
    flexShrink: 0,
    backgroundColor: '#A8DEB0',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default TabMenu;
