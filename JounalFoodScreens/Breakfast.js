import React, { useState, useLayoutEffect, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, SafeAreaView, FlatList, Modal, Image, Button, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from 'axios';
import { UserType } from '../UserContext';
import { apiBaseUrl } from '../ApiConfig';
import { Calendar } from 'react-native-calendars';

const TabMenu = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Tab1');
  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Initialize with the current date
  const [breakfastName, setBreakfastName] = useState('');
  const [breakfastCalories, setBreakfastCalories] = useState('');
  const [breakfastProtein, setBreakfastProtein] = useState('');
  const [breakfastFat, setBreakfastFat] = useState('');
  const [breakfastCarbohydrate, setBreakfastCarbohydrate] = useState('');
  const [breakfastFiber, setBreakfastFiber] = useState('');


  const { userId } = useContext(UserType);
  const [isCalendarVisible, setCalendarVisible] = useState(false);


  const saveMeal = async () => {
    try {
      const response = await axios.post(`http://${apiBaseUrl}:8000/meals`, {
        date,
        BName: breakfastName,
        Bcalories: breakfastCalories,
        BProtein: breakfastProtein,
        BFat: breakfastFat,
        BCarbohydrate: breakfastCarbohydrate,
        BFiber: breakfastFiber,
        userId,
      });
  
      // Update state values after saving the meal
      setBreakfastName('');
      setBreakfastCalories('');
      setBreakfastProtein('');
      setBreakfastFat('');
      setBreakfastCarbohydrate('');
      setBreakfastFiber('');
  
      console.log('Meal saved:', response.data);
    } catch (error) {
      console.error('Error saving meal:', error.response ? error.response.data : error.message);
    }
  };
  
  

  // บันทึกผ่าน Search
  const recordMeal2 = async (foodItem) => {
    try {
      const response = await axios.post(`http://${apiBaseUrl}:8000/meals`, {
        userId,
        date,
          BName: foodItem.FoodName,
          Bcalories: foodItem.FoodCalorie,
          BProtein: foodItem.FoodProtien,
          BFat: foodItem.FoodFat,
          BCarbohydrate: foodItem.FoodCarbo,
          BFiber: foodItem.FoodFiber,
      });

      setBreakfastName;
      setBreakfastCalories;
      setBreakfastProtein;
      setBreakfastFat;
      setBreakfastCarbohydrate;
      setBreakfastFiber;

      console.log('Created:', response.data);
      alert('บันทึกสำเร็จ');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status code:', error.response?.status);
      alert('An error occurred while recording the meal. Please try again later.');
    }
  };


  const [searchQuery, setSearchQuery] = useState("");
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFoodData() {
      try {
        const response = await fetch(`http://${apiBaseUrl}:8000/food`);
        const data = await response.json();
        console.log('data', data);  // Log the actual data

        if (response.status === 200) {
          setFoods(data);
        } else {
          console.error('Failed to fetch food data');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFoodData();
  }, []);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ fontSize: 20, fontFamily: 'Kanit_400Regular', justifyContent: 'center' }}>
          {activeTab === 'Tab1' ? 'ค้นหา' : 'เพิ่มรายการอาหาร'}
        </Text>
      ),
      headerStyle: {
        backgroundColor: 'white',
      },
    });
  }, [activeTab, navigation]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleEditModal = () => {
    setEditModalVisible(!isEditModalVisible);
  };


  const handleCalendarClick = () => {
    setCalendarVisible(true);
  };
  const handleDateClick = (date) => {
    setDate(date.dateString);
    setCalendarVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>

      <Ionicons onPress={handleCalendarClick} name="calendar" size={24} color="black" />
      <Modal
        animationType="slide"
        transparent={false}
        visible={isCalendarVisible}
        onRequestClose={() => {
          setCalendarVisible(false);
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Button title="Close Calendar" onPress={() => setCalendarVisible(false)} />
          <Calendar
            markedDates={{
              [date]: {
                selected: true,
                selectedColor: 'blue',
              },
            }}
            onDayPress={handleDateClick}
          />

        </SafeAreaView>
      </Modal>

      <TextInput
        style={styles.input}
        placeholder="Date"
        onChangeText={(text) => setDate(text)}
        value={date}
      />

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

      {activeTab === 'Tab1' && (
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={24}
            color="gray"
            style={styles.calendarIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหารายการอาหาร..."
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
      )}

      {searchQuery && activeTab === 'Tab1' && (
        <FlatList
          style={styles.flatListContainer}
          data={foods.filter((food) =>
            food && food.FoodName && food.FoodName.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          keyExtractor={(food) => food.FoodName}
          renderItem={({ item }) => (
            <View style={styles.medicationContainer}>
              {item?.imageFood && (
                <TouchableOpacity onPress={() => {
                  setSelectedItem(item);
                  toggleModal();
                }}>
                  <Image
                    source={{ uri: item.imageFood }}
                    style={{ width: 90, height: 90, resizeMode: 'cover', borderRadius: 8 }}
                  />
                </TouchableOpacity>
              )}

              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={styles.foodName}>{item?.FoodName}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, fontFamily: 'Kanit_400Regular', color: 'red' }}>{item?.FoodCalorie}</Text>
                  <Text style={{ fontSize: 14, fontFamily: 'Kanit_400Regular', color: 'black' }}>  แคลอรี่</Text>
                </View>

              </View>

              <MaterialIcons name="add-box" size={45} color="#52B788"
                onPress={() => {
                  setSelectedItem(selectedItem);
                  recordMeal2(selectedItem);
                }} />

            </View>
          )}
        />
      )}

      {activeTab === 'Tab2' &&
        <View>
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.rectangle4179}>
              <Text style={{ fontSize: 20, fontFamily: 'Kanit_400Regular', color: 'white', marginTop: 2 }}> อาหารเช้า </Text>

              <TextInput
                style={styles.input}
                placeholder="กรอกชื่ออาหาร"
                placeholderTextColor="#808080"
                onChangeText={(text) => setBreakfastName(text)}
                value={breakfastName}
              />
              <TextInput
                style={styles.input}
                placeholder="แคลอรี่"
                placeholderTextColor="#808080"
                onChangeText={(text) => setBreakfastCalories(text)}
                value={breakfastCalories}
              />
              <TextInput
                style={styles.input}
                placeholder="โปรตีน"
                placeholderTextColor="#808080"
                onChangeText={(text) => setBreakfastProtein(text)}
                value={breakfastProtein}
              />
              <TextInput
                style={styles.input}
                placeholder="ไขมัน"
                placeholderTextColor="#808080"
                onChangeText={(text) => setBreakfastFat(text)}
                value={breakfastFat}
              />
              <TextInput
                style={styles.input}
                placeholder="คาร์โบไฮเดรต"
                placeholderTextColor="#808080"
                onChangeText={(text) => setBreakfastCarbohydrate(text)}
                value={breakfastCarbohydrate}
              />
              <TextInput
                style={styles.input}
                placeholder="ไฟเบอร์"
                placeholderTextColor="#808080"
                onChangeText={(text) => setBreakfastFiber(text)}
                value={breakfastFiber}
              />
            </View>

            {/* <View style={styles.rectangle4179}>
              <Text style={{ fontSize: 20, fontFamily: 'Kanit_400Regular', color: 'white', marginTop: 2 }}> อาหารกลางวัน </Text>

              <TextInput
                style={styles.input}
                placeholder="กรอกชื่ออาหาร"
                placeholderTextColor="#808080"
                onChangeText={(text) => setLName(text)}
                value={LName}
              />
              <TextInput
                style={styles.input}
                placeholder="แคลอรี่"
                placeholderTextColor="#808080"
                onChangeText={(text) => setLCalories(text)}
                value={LCalories}
              />

              <TextInput
                style={styles.input}
                placeholder="โปรตีน"
                placeholderTextColor="#808080"
                onChangeText={(text) => setLProtein(text)}
                value={LProtein}
              />

              <TextInput
                style={styles.input}
                placeholder="ไขมัน"
                placeholderTextColor="#808080"
                onChangeText={(text) => setLFat(text)}
                value={LFat}
              />

              <TextInput
                style={styles.input}
                placeholder="คาร์โบไฮเดรต"
                placeholderTextColor="#808080"
                onChangeText={(text) => setLCarbohydrate(text)}
                value={LCarbohydrate}
              />
              <TextInput
                style={styles.input}
                placeholder="ไฟเบอร์"
                placeholderTextColor="#808080"
                onChangeText={(text) => setLFiber(text)}
                value={LFiber}
              />
            </View>
            <View style={styles.rectangle4178}>
              <Text style={{ fontSize: 20, fontFamily: 'Kanit_400Regular', color: 'white', marginTop: 2 }}> อาหารเย็น </Text>

              <TextInput
                style={styles.input}
                placeholder="กรอกชื่ออาหาร"
                placeholderTextColor="#808080"
                onChangeText={(text) => setDName(text)}
                value={DName}
              />
              <TextInput
                style={styles.input}
                placeholder="แคลอรี่"
                placeholderTextColor="#808080"
                onChangeText={(text) => setDcalories(text)}
                value={DCalories}
              />
              <TextInput
                style={styles.input}
                placeholder="โปรตีน"
                placeholderTextColor="#808080"
                onChangeText={(text) => setDrotein(text)}
                value={DProtein}
              />

              <TextInput
                style={styles.input}
                placeholder="ไขมัน"
                placeholderTextColor="#808080"
                onChangeText={(text) => setDFat(text)}
                value={DFat}
              />

              <TextInput
                style={styles.input}
                placeholder="คาร์โบไฮเดรต"
                placeholderTextColor="#808080"
                onChangeText={(text) => setDCarbohydrate(text)}
                value={DCarbohydrate}
              />
              <TextInput
                style={styles.input}
                placeholder="ไฟเบอร์"
                placeholderTextColor="#808080"
                onChangeText={(text) => setDiber(text)}
                value={DFiber}
              />

            </View> */}
          </ScrollView>

          <TouchableOpacity
            style={{ marginTop: 20, marginBottom: 50, width: 257, height: 46, backgroundColor: '#233145', borderRadius: 30, alignItems: 'center', justifyContent: 'center', fontFamily: 'Kanit_400Regular', }}
            onPress={saveMeal}>
            <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', fontFamily: 'Kanit_400Regular' }}> บันทึก</Text>
          </TouchableOpacity>

          <View style={{
            width: '90%',
            height: '5%',
            flexShrink: 0,
            backgroundColor: '#C2FFD3',
            borderRadius: 15,
            alignItems: 'center',
            marginTop: 50,
          }}>
          </View>
        </View>
      }

      <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={toggleModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeModalButton} onPress={toggleModal}>
            <Text style={styles.buttonText}>X</Text>
          </TouchableOpacity>

          <View style={styles.modalContent}>
            <View>
              <Image source={{ uri: selectedItem?.imageFood }} style={{ width: 350, height: 200, resizeMode: 'cover', borderRadius: 5 }} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, marginBottom: 10 }}>
              <Text style={{ flex: 1, textAlign: 'left', fontFamily: 'Kanit_400Regular', fontSize: 20 }}>{selectedItem?.FoodName}</Text>
              <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Kanit_400Regular', fontSize: 20 }}>{selectedItem?.FoodCalorie} แคลอรี่</Text>
            </View>

            <View style={{ backgroundColor: '#52B788', borderRadius: 10, width: '99%', height: '2%', marginTop: 5, }}></View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, backgroundColor: '#FFE68C', borderRadius: 100, width: '100%', height: '5%', alignItems: 'center' }}>
              <Text style={{ flex: 1, textAlign: 'left', fontFamily: 'Kanit_400Regular', fontSize: 18, padding: 4, color: '#7E7B7B' }}>โปรตีน</Text>
              <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Kanit_400Regular', fontSize: 18, padding: 4, color: '#7E7B7B' }}>{selectedItem?.FoodProtien} กรัม </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, backgroundColor: '#D7F3FF', borderRadius: 100, width: '100%', height: '5%', alignItems: 'center' }}>
              <Text style={{ flex: 1, textAlign: 'left', fontFamily: 'Kanit_400Regular', fontSize: 18, padding: 4, color: '#7E7B7B' }}>ไขมัน</Text>
              <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Kanit_400Regular', fontSize: 18, padding: 4, color: '#7E7B7B' }}>{selectedItem?.FoodFat} กรัม </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, backgroundColor: '#FFD5FB', borderRadius: 100, width: '100%', height: '5%', alignItems: 'center' }}>
              <Text style={{ flex: 1, textAlign: 'left', fontFamily: 'Kanit_400Regular', fontSize: 18, padding: 4, color: '#7E7B7B' }}>ไฟเบอร์</Text>
              <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Kanit_400Regular', fontSize: 18, padding: 4, color: '#7E7B7B' }}>{selectedItem?.FoodFiber} กรัม </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, backgroundColor: '#C2FFD3', borderRadius: 100, width: '100%', height: '5%', alignItems: 'center' }}>
              <Text style={{ flex: 1, textAlign: 'left', fontFamily: 'Kanit_400Regular', fontSize: 18, padding: 4, color: '#7E7B7B' }}>คาร์โบไฮเดรต</Text>
              <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Kanit_400Regular', fontSize: 18, padding: 4, color: '#7E7B7B' }}>{selectedItem?.FoodCarbo} กรัม </Text>
            </View>

            <TouchableOpacity style={styles.button}
              onPress={() => {
                setSelectedItem(selectedItem);
                recordMeal2(selectedItem);
              }}>
              <Text style={styles.buttonText}>บันทึก</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    width: '100%',
    height: '100%',
    backgroundColor: '#A8DEB0',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },

  rectangle4178: {
    width: '100%',
    height: '35%',
    backgroundColor: '#A8DEB0',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  flatListContainer: {
    flex: 1,
    width: '90%',
    marginTop: 20,
  },
  foodContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd', // Add border color
    shadowColor: '#000', // Add shadow color
    shadowOffset: { width: 0, height: 2 }, // Add shadow offset
    shadowOpacity: 0.8, // Add shadow opacity
    shadowRadius: 3, // Add shadow radius
    elevation: 5, // Add elevation for Android
  },
  foodName: {
    fontSize: 20,
    fontFamily: 'Kanit_400Regular',

  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeModalButton: {
    backgroundColor: '#CC0000',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 100,
    marginTop: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
    textAlign: 'center', // จัดตำแหน่งข้อความให้อยู่ตรงกลาง
  },
  medicationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1,
    marginTop: 4,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  modalContent: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 10,
    width: '90%',
    height: '80%'
  },
  modalText: {
    fontSize: 25,
    marginTop: 5,
    fontFamily: 'Kanit_400Regular',
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#52B788',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: "35%",
  },
  buttonText: {
    color: '#ffff',
    fontSize: 18,
    fontFamily: 'Kanit_400Regular',
  },
});

export default TabMenu;
