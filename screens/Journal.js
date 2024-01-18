import React, { useState, useLayoutEffect, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, SafeAreaView, FlatList, Modal, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { UserType } from '../UserContext';
import { apiBaseUrl } from '../ApiConfig';
import styles from '../components/styles';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
const Journal = () => {

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ fontSize: 20, fontFamily: 'Kanit_400Regular', justifyContent: 'center' }}>สมุดบันทึกการกินอาหารประจำวัน</Text>
      ),
      headerStyle: {
        backgroundColor: '#FFFFFF',
      },
      headerRight: () => (
        <TouchableOpacity onPress={handleRefresh} style={{ marginRight: 10 }}>
          <Ionicons name="refresh-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      ),
    });
  },);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    fetchMealData();
    fetchProfile();
    fetchFoodData();
    setRefreshing(false);
  };

  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const { userId } = useContext(UserType);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarVisible, setCalendarVisible] = useState(false);

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };
  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };
  const handleCalendarClick = () => {
    setCalendarVisible(true);
  };
  const handleDateClick = (date) => {
    setSelectedDate(new Date(date.dateString));
    setCalendarVisible(false);
  };

  const [mealData, setMealData] = useState([]);
  //แสดงข้อมูลการบันทึกวันนั้นๆผ่านการเลือกวันที่
  const fetchMealData = async () => {
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const apiUrl = `http://${apiBaseUrl}:8000/meals/${userId}/${formattedDate}`;
      const response = await axios.get(apiUrl);

      setMealData(response.data);
      console.log(apiUrl);
      console.log(response);

    } catch (error) {
      console.error('Error fetching meal data:', error.message);
    }
  };
  useEffect(() => {
    fetchMealData();
  }, [userId, selectedDate]);

  const handleEditPress = () => {
    setIsEditing(true);
    setEditedMealName(mealData[0].LName);
    fetchFoodData();
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleCancelEditBreakfast = () => {
    setIsBreakfast(false);
  };

  const handleEditPress2 = () => {
    setIsEditing2(true);
    setEditedDinnerName(mealData[0].DName);
    fetchFoodData();
  };
  const handleCancelEdit2 = () => {
    setIsEditing2(false);
  };
  
  const handleAddBreakfast = () => {
    setIsBreakfast(true);
    handleRefresh();
  };

  const [isHandleSetCal, setIsHandleSetCal] = useState(false);
  const handleSetCal = () => {
    setIsHandleSetCal(true);
  };
  const handleCancelSetCal = () => {
    setIsHandleSetCal(false);
  };

  const [issumCalorie, isSetSumCalorie] = useState("");
  const handleSetSumCalorie = async () => {
    try {
      const response = await axios.put(`http://${apiBaseUrl}:8000/profile/${userId}`, {
        challengeCalorie: issumCalorie,
      });
      await handleRefresh();
      setIsHandleSetCal(false);
      console.log('SetSumCalorie updated:', response.data);
    } catch (error) {
      console.error('Error updating meal:', error.message);
    }
  };
  const [isBreakfast, setIsBreakfast] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [breakfastName, setBreakfastName] = useState('');
  const [breakfastCalories, setBreakfastCalories] = useState('');
  const [breakfastProtein, setBreakfastProtein] = useState('');
  const [breakfastFat, setBreakfastFat] = useState('');
  const [breakfastCarbohydrate, setBreakfastCarbohydrate] = useState('');
  const [breakfastFiber, setBreakfastFiber] = useState('');

  //Save Breakfast
  const saveMeal = async () => {
    try {
      const response = await axios.post(`http://${apiBaseUrl}:8000/meals`, {
        date: selectedDate.toISOString().split('T')[0],
        BName: breakfastName,
        Bcalories: breakfastCalories,
        BProtein: breakfastProtein,
        BFat: breakfastFat,
        BCarbohydrate: breakfastCarbohydrate,
        BFiber: breakfastFiber,
        userId,
      });
      await handleRefresh();
      setBreakfastName('');
      setBreakfastCalories('');
      setBreakfastProtein('');
      setBreakfastFat('');
      setBreakfastCarbohydrate('');
      setBreakfastFiber('');
      setIsBreakfast(false);
      console.log('Meal saved:', response.data);
    } catch (error) {
      console.error('Error saving meal:', error.response ? error.response.data : error.message);
    }
  };
  const [activeTab, setActiveTab] = useState('Tab1');
  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };
  const [activeTab2, setActiveTab2] = useState('Tab1');
  const handleTabPress2 = (tabName2) => {
    setActiveTab2(tabName2);
  };
  const [activeTab3, setActiveTab3] = useState('Tab1');
  const handleTabPress3 = (tabName3) => {
    setActiveTab3(tabName3);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [foods, setFoods] = useState([]);


const fetchFoodData= async () => {
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
      }
    };
  // บันทึกผ่าน Search Breakfast
  const recordMeal2 = async (foodItem) => {
    try {
      const response = await axios.post(`http://${apiBaseUrl}:8000/meals`, {
        userId,
        date: selectedDate.toISOString().split('T')[0],
        BName: foodItem.FoodName,
        Bcalories: foodItem.FoodCalorie,
        BProtein: foodItem.FoodProtein,
        BFat: foodItem.FoodFat,
        BCarbohydrate: foodItem.FoodCarbo,
        BFiber: foodItem.FoodFiber,
      });
      await handleRefresh();
      setBreakfastName('');
      setBreakfastCalories('');
      setBreakfastProtein('');
      setBreakfastFat('');
      setBreakfastCarbohydrate('');
      setBreakfastFiber('');

      console.log('Created:', response.data);
      alert('บันทึกสำเร็จ');
      setIsBreakfast(false);
    } catch (error) {
      console.error('Error creating:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status code:', error.response?.status);
      alert('An error occurred while recording the meal. Please try again later.');
    }
  };

  //Save Lunch
  const [isEditing, setIsEditing] = useState(false);
  const [editedMealName, setEditedMealName] = useState('');
  const [editedMealCalories, setEditedMealCalories] = useState('');
  const [editedMealProtien, setEditedMealProtien] = useState('');
  const [editedMealFat, setEditedMealFat] = useState('');
  const [editedMealCarbo, setEditedMealCarbo] = useState('');
  const [editedMealFiber, setEditedMealFiber] = useState('');

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`http://${apiBaseUrl}:8000/meals/${mealData[0]._id}`, {
        LName: editedMealName,
        Lcalories: editedMealCalories,
        LProtein: editedMealProtien,
        LFat: editedMealFat,
        LCarbohydrate: editedMealCarbo,
        LFiber: editedMealFiber,
      });
      await handleRefresh();
      setIsEditing(false);

      console.log('Meal updated:', response.data);
      setIsEditing(false);
      setEditedDinnerName;
      setEditedDinnerCalories;
    } catch (error) {
      console.error('Error updating meal:', error.message);
    }
  };
  // บันทึกผ่าน Search Lunch
  const recordMealLunch = async (foodItem) => {
    try {
      const response = await axios.put(`http://${apiBaseUrl}:8000/meals/${mealData[0]._id}`, {
        userId,
        date: selectedDate.toISOString().split('T')[0],
        LName: foodItem.FoodName,
        Lcalories: foodItem.FoodCalorie,
        LProtein: foodItem.FoodProtein,
        LFat: foodItem.FoodFat,
        LCarbohydrate: foodItem.FoodCarbo,
        LFiber: foodItem.FoodFiber,
      });
      await handleRefresh();
      setEditedMealName('');
      setEditedMealCalories('');
      setEditedMealProtien('');
      setEditedMealFat('');
      setEditedMealCarbo('');
      setEditedMealFiber('');
      console.log('Created:', response.data);
      alert('บันทึกสำเร็จ');
      setIsEditing(false);
      setEditedDinnerName;
      setEditedDinnerCalories;
    } catch (error) {
      console.error('Error creating:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status code:', error.response?.status);
      alert('An error occurred while recording the meal. Please try again later.');
    }
  };

  //Save Dinner  
  const [isEditing2, setIsEditing2] = useState(false);
  const [editedDinnerCalories, setEditedDinnerCalories] = useState('');
  const [editedDinnerName, setEditedDinnerName] = useState('');
  const [editedDinnerProtien, setEditedDinnerProtien] = useState('');
  const [editedDinnerFat, setEditedDinnerFat] = useState('');
  const [editedDinnerlCarbo, setEditedDinnerCarbo] = useState('');
  const [editedDinnerFiber, setEditedDinnerFiber] = useState('');

  const handleSaveEditDinner = async () => {
    try {
      const response = await axios.put(`http://${apiBaseUrl}:8000/meals/${mealData[0]._id}`, {
        DName: editedDinnerName,
        Dcalories: editedDinnerCalories,
        DProtien: editedDinnerProtien,
        DFat: editedDinnerFat,
        DCarbohydrate: editedDinnerlCarbo,
        DFiber: editedDinnerFiber,
      });
      await handleRefresh();

      setIsEditing2(false);
      console.log('Dinner updated:', response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating meal:', error.message);
    }
  };
  // บันทึกผ่าน Search Dinner
  const recordMealDinner = async (foodItem) => {
    try {
      const response = await axios.put(`http://${apiBaseUrl}:8000/meals/${mealData[0]._id}`, {
        userId,
        date: selectedDate.toISOString().split('T')[0],
        DName: foodItem.FoodName,
        Dcalories: foodItem.FoodCalorie,
        DProtein: foodItem.FoodProtein,
        DFat: foodItem.FoodFat,
        DCarbohydrate: foodItem.FoodCarbo,
        DFiber: foodItem.FoodFiber,
      });
      await handleRefresh();
      setEditedDinnerCalories('');
      setEditedDinnerName('');
      setEditedDinnerProtien('');
      setEditedDinnerFat('');
      setEditedDinnerCarbo('');
      setEditedDinnerFiber('');
      console.log('Created:', response.data);
      alert('บันทึกสำเร็จ');
      setIsEditing2(false);
      setEditedDinnerName;
      setEditedDinnerCalories;
    } catch (error) {
      console.error('Error creating:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status code:', error.response?.status);
      alert('An error occurred while recording the meal. Please try again later.');
    }
  };

  const [challengeCalorie, setChallengeCalorie] = useState("");

  useEffect(() => {
    fetchProfile(userId);
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://${apiBaseUrl}:8000/profile/${userId}`);
      const { challengeCalorie } = response.data;

      console.log("challengeCalorie", response.data); // Log the entire response data for inspection

      setChallengeCalorie(challengeCalorie);


      console.log("challengeCalorie", challengeCalorie); // Should display the correct value

    } catch (error) {
      console.log("challengeCalorie", error);
    }
  };

  const [isTopic, setIsTopic] = useState(false);

  const handleIsTopic = () => {
    setIsTopic(true);
  };

  const handleCancelIsTopic = () => {
    setIsTopic(false);
  };

  const calculateDifference = () => {
    const sumCalorie = mealData.length > 0 ? mealData[0].SumCalorie : 0;
    const difference = challengeCalorie - sumCalorie;

    if (difference > 0) {
      return `ยังสามารถทานได้อีก ${difference} แคลอรี่`;
    } else if (difference < 0) {
      return <Text style={{ color: 'red' }}>ทานเกินจากเป้าหมาย {Math.abs(difference)} แคลอรี่</Text>;
    } else {
      return 'ไม่เหลือแคลอรี่ที่จะทาน';
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, padding: 5, backgroundColor: '#CEFADB' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
    <SafeAreaView style={styles.container}>

{/* Edit เป้าหมาย */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 0,
          alignItems: 'flex-end',
          backgroundColor: '#D9D9D9',
          borderTopLeftRadius: 30,
          width: '39%',
          height: 40,
          borderBottomLeftRadius: 30,
          marginTop: 5,
        }}
        onPress={handleSetCal}
      >
        <Text style={{ color: 'white', fontSize: 15, fontFamily: 'Kanit_400Regular', padding: 8 }}>
          เป้าหมาย {challengeCalorie} แคลอรี่
        </Text>
      </TouchableOpacity>

{/* ปฏิทินChanlleng*/}
      <Modal transparent={true} animationType="slide" visible={isHandleSetCal} onRequestClose={setIsHandleSetCal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeModalButton} onPress={handleCancelSetCal}>
            <Text style={styles.buttonText}>X</Text>
          </TouchableOpacity>
          <View style={{ backgroundColor: '#D0EDD3', padding: 20, borderRadius: 5, width: '85%', height: '30%', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
            <Text style={styles.Text}>ใส่เป้าหมายของคุณ</Text>
            <TextInput
              style={styles.input}
              value={issumCalorie}
              onChangeText={isSetSumCalorie}
            />
            <TouchableOpacity style={styles.recordButton} onPress={handleSetSumCalorie}>
              <Text style={styles.buttonText}>บันทึก</Text>
            </TouchableOpacity>
          </View></View>
      </Modal>

{/* Select Date Next Previos */}
      <View style={styles.topic}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handlePreviousDay}>
            <Image source={require('../assets/15.png')}
              style={{ width: 30, height: 30 }} resizeMode="cover" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCalendarClick} style={{ width: '50%', height: 30, backgroundColor: '#52B788', borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.buttonText}>{selectedDate.toDateString()}</Text>
          </TouchableOpacity>


          <TouchableOpacity onPress={handleNextDay}>
            <Image source={require('../assets/16.png')}
              style={{ width: 30, height: 30 }} resizeMode="cover" />
          </TouchableOpacity>
        </View>
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
                [selectedDate.toISOString().split('T')[0]]: {
                  selected: true,
                  selectedColor: 'blue',
                },
              }}
              onDayPress={handleDateClick}
            />
          </SafeAreaView>
        </Modal>
      </View>


{/* topic sum SumCalorie */}
      <TouchableOpacity style={styles.circleTopic} onPress={handleIsTopic}>
        <Text style={[styles.buttonText1, { color: mealData.length > 0 && mealData[0].SumCalorie > challengeCalorie ? 'red' : 'black' }]}>
          {mealData.length > 0 ? mealData[0].SumCalorie : 0}
        </Text>
        <Text style={styles.buttonText1}>แคลอรี่</Text>
      </TouchableOpacity>

{/* Pop Up Topic SumCalorie */}
      <Modal transparent={true} animationType="slide" visible={isTopic} onRequestClose={handleCancelIsTopic}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeModalButton} onPress={handleCancelIsTopic}>
            <Text style={styles.buttonText}>X</Text>
          </TouchableOpacity>
          <View style={{ backgroundColor: '#D0EDD3', padding: 20, borderRadius: 5, width: '85%', height: '15%' , alignItems:'center' , justifyContent:'center'}}>
            <Text style={styles.buttonTextTopic}>
              วันนี้ทานไปแล้ว {mealData.length > 0 ? mealData[0].SumCalorie : 0} แคลอรี่
            </Text>
            <Text style={styles.buttonTextTopic}>
              {calculateDifference()}
            </Text>
          </View>
        </View>
      </Modal>

{/* Nutrient 3 Tpoic */}
      <View style={styles.krop}>
        <Text style={styles.buttonText1}>สารอาหารหลัก</Text>
        <View style={styles.container2}>

          <View style={styles.circle}>
            <Text style={styles.text}>โปรตีน</Text>
            <Text style={styles.text}>
              {mealData.length > 0 ?
                mealData.reduce((total, meal) => total + meal.BProtein + meal.LProtein + meal.DProtein, 0) : 0
              } กรัม </Text>
          </View>

          <View style={styles.fatCircle}>
            <Text style={styles.text}>ไขมัน</Text>
            <Text style={styles.text}>
              {mealData.length > 0 ?
                mealData.reduce((total, meal) => total + meal.BFat + meal.LFat + meal.DFat, 0) : 0
              } กรัม </Text>

          </View>
          <View style={styles.carbCircle}>
            <Text style={styles.text}>คาร์โบ..</Text>
            <Text style={styles.text}>{mealData.length > 0 ?
              mealData.reduce((total, meal) => total + meal.BCarbohydrate + meal.LCarbohydrate + meal.DCarbohydrate, 0) : 0
            } กรัม</Text>

          </View>
          <View style={styles.fibrtCircle}>
            <Text style={styles.text}>ไฟเบอร์</Text>
            <Text style={styles.text}>{mealData.length > 0 ?
              mealData.reduce((total, meal) => total + meal.BFiber + meal.LFiber + meal.DFiber, 0) : 0
            } กรัม</Text>
          </View>
        </View>
      </View>

{/* Add Breakfast */}
      <View style={styles.style}>
        <View>
          {mealData.length > 0 ? (
            <View style={styles.mealRow}>

              <Image
                source={require('../assets/breakfast.png')}
                style={{ width: 85, height: 85, right: 50 }} resizeMode="cover" />

              <View style={{ justifyContent: 'center', left: '-17%' }}>
                <Text style={{ fontSize: 15, fontFamily: 'Kanit_400Regular', color: '#C4C4D5' }}>อาหารเช้า</Text>
                <Text style={{ fontSize: 17, fontFamily: 'Kanit_400Regular', color: '#958E8F' }}>{mealData[0].BName}</Text>
                <Text style={{ fontSize: 22, fontFamily: 'Kanit_400Regular', color: '#D83E58' }}>{mealData[0].Bcalories}<Text style={{ fontSize: 17, fontFamily: 'Kanit_400Regular', color: '#C4C4D5', }}> แคลอรี่</Text></Text>
              </View>

              <TouchableOpacity style={{ justifyContent: 'center', left: '50%' }} onPress={handleAddBreakfast}>
                <Ionicons name="create-outline" size={30} color="#52B788" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.mealContainer}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 40, }}>
                <Image
                  source={require('../assets/breakfast.png')}
                  style={styles.mealImage}
                  resizeMode="cover"
                />
                <Text style={styles.mealHeaderText}>อาหารเช้า</Text>
                <TouchableOpacity style={{ marginBottom: 10 }} onPress={handleAddBreakfast}>
                  <Ionicons name="add-circle" size={50} color="#52B788" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
{/* Modal Edit Breakfast */}
      <Modal transparent={true} animationType="slide" visible={isBreakfast} onRequestClose={handleAddBreakfast}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeModalButton} onPress={handleCancelEditBreakfast}>
            <Text style={styles.buttonText}>X</Text>
          </TouchableOpacity>
          <View style={styles.tabMenu}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'Tab1' && styles.activeTab]}
              onPress={() => handleTabPress('Tab1')}>
              <Text style={styles.tabText}>ค้นหา</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'Tab2' && styles.activeTab]}
              onPress={() => handleTabPress('Tab2')}>
              <Text style={styles.tabText}>เพิ่มรายการอาหาร</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'Tab1' && (
            <View style={{ backgroundColor: '#D0EDD3', padding: 20, borderRadius: 5, width: '85%', height: '68%' }}>
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

              {searchQuery && (
                <FlatList
                  data={foods.filter((food) =>
                    food && food.FoodName && food.FoodName.toLowerCase().includes(searchQuery.toLowerCase())
                  )}
                  keyExtractor={(food) => food.FoodName}
                  renderItem={({ item }) => (
                    <View style={styles.modalContent}>
                      <View>
                        <Image source={{ uri: item?.FoodImage }} style={{ width: 280, height: 100, resizeMode: 'cover', borderRadius: 5, alignItems: 'center' }} />
                      </View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, marginBottom: 10 }}>
                        <Text style={{ flex: 1, textAlign: 'left', fontFamily: 'Kanit_400Regular', fontSize: 20 }}>{item?.FoodName}</Text>
                        <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Kanit_400Regular', fontSize: 20 }}>{item?.FoodCalorie} แคลอรี่</Text>
                      </View>

                      <View style={{ backgroundColor: '#52B788', borderRadius: 10, width: '99%', height: '2%', marginTop: 5, }}></View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, backgroundColor: '#FFE68C', borderRadius: 100, width: '100%', height: '5%', alignItems: 'center' }}>
                        <Text style={{ flex: 1, textAlign: 'left', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>โปรตีน</Text>
                        <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>{item?.FoodProtein} กรัม </Text>
                      </View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, backgroundColor: '#D7F3FF', borderRadius: 100, width: '100%', height: '5%', alignItems: 'center' }}>
                        <Text style={{ flex: 1, textAlign: 'left', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>ไขมัน</Text>
                        <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>{item?.FoodFat} กรัม </Text>
                      </View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, backgroundColor: '#FFD5FB', borderRadius: 100, width: '100%', height: '5%', alignItems: 'center' }}>
                        <Text style={{ flex: 1, textAlign: 'left', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>ไฟเบอร์</Text>
                        <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>{item?.FoodFiber} กรัม </Text>
                      </View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, backgroundColor: '#C2FFD3', borderRadius: 100, width: '100%', height: '5%', alignItems: 'center' }}>
                        <Text style={{ flex: 1, textAlign: 'left', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>คาร์โบไฮเดรต</Text>
                        <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>{item?.FoodCarbo} กรัม </Text>
                      </View>

                      <TouchableOpacity style={styles.button} onPress={() => recordMeal2(item)}>
                        <Text style={styles.buttonText}>เพิ่มรายการอาหาร</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              )}
            </View>
          )}
          {activeTab === 'Tab2' &&
            <View style={{ backgroundColor: '#D0EDD3', padding: 20, borderRadius: 5, width: '85%', height: '68%' }}>
              <Text style={styles.Text}>อาหาร</Text>
              <TextInput
                style={styles.input}
                value={breakfastName}
                onChangeText={setBreakfastName}
              />
              <Text style={styles.Text}>แคลอรี่</Text>
              <TextInput
                style={styles.input}
                value={breakfastCalories}
                onChangeText={setBreakfastCalories}
              />
              <Text style={styles.Text}>โปรตีน</Text>
              <TextInput
                style={styles.input}
                value={breakfastProtein}
                onChangeText={setBreakfastProtein}
              />
              <Text style={styles.Text}>ไขมัน</Text>
              <TextInput
                style={styles.input}
                value={breakfastFat}
                onChangeText={setBreakfastFat}
              />
              <Text style={styles.Text}>คาร์โบไฮเดรต</Text>
              <TextInput
                style={styles.input}
                value={breakfastCarbohydrate}
                onChangeText={setBreakfastCarbohydrate}
              />
              <Text style={styles.Text}>ไฟเบอร์</Text>
              <TextInput
                style={styles.input}
                value={breakfastFiber}
                onChangeText={setBreakfastFiber}
              />

              <TouchableOpacity style={styles.recordButton} onPress={saveMeal}>
                <Text style={styles.buttonText}>บันทึกการแก้ไข</Text>
              </TouchableOpacity>
            </View>

          }
        </View>
      </Modal>

{/* Add Lunch */}
      <View style={styles.style}>
        <View>
          {mealData.length > 0 ? (
            <View style={styles.mealRow}>

              <Image
                source={require('../assets/lunch.png')}
                style={{ width: 85, height: 85, right: 50 }} resizeMode="cover" />

              <View style={{ justifyContent: 'center', left: '-17%' }}>
                <Text style={{ fontSize: 15, fontFamily: 'Kanit_400Regular', color: '#C4C4D5', }}>อาหารกลางวัน</Text>
                <Text style={{ fontSize: 17, fontFamily: 'Kanit_400Regular', color: '#958E8F', }}>{mealData[0].LName}</Text>
                <Text style={{ fontSize: 22, fontFamily: 'Kanit_400Regular', color: '#D83E58', }}>{mealData[0].Lcalories}
                  <Text style={{ fontSize: 17, fontFamily: 'Kanit_400Regular', color: '#C4C4D5' }}> แคลอรี่</Text>
                </Text>
              </View>

              <TouchableOpacity style={{ justifyContent: 'center', left: '50%' }} onPress={handleEditPress}>
                <Ionicons name="create-outline" size={30} color="#52B788" />
              </TouchableOpacity>

            </View>
          ) : (
            <View style={styles.mealContainer}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 22, }}>
                <Image
                  source={require('../assets/lunch.png')}
                  style={styles.mealImage}
                  resizeMode="cover"
                />
                <Text style={styles.mealHeaderText}>อาหารกลางวัน </Text>
                <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => navigation.navigate('Lunch')}>
                  <Ionicons name="add-circle" size={50} color="#52B788" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>

{/* Modal Edit Lunch */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isEditing}
        onRequestClose={handleCancelEdit}
      >

        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeModalButton} onPress={handleCancelEdit}>
            <Text style={styles.buttonText}>X</Text>
          </TouchableOpacity>
          <View style={styles.tabMenu}>
            <TouchableOpacity
              style={[styles.tab, activeTab2 === 'Tab1' && styles.activeTab]}
              onPress={() => handleTabPress2('Tab1')}>
              <Text style={styles.tabText}>ค้นหา</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab2 === 'Tab2' && styles.activeTab]}
              onPress={() => handleTabPress2('Tab2')}>
              <Text style={styles.tabText}>เพิ่มรายการอาหาร</Text>
            </TouchableOpacity>
          </View>

          {activeTab2 === 'Tab1' && (
            <View style={{ backgroundColor: '#D0EDD3', padding: 20, borderRadius: 5, width: '85%', height: '68%' }}>
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

              {searchQuery && (
                <FlatList
                  data={foods.filter((food) =>
                    food && food.FoodName && food.FoodName.toLowerCase().includes(searchQuery.toLowerCase())
                  )}
                  keyExtractor={(food) => food.FoodName}
                  renderItem={({ item }) => (
                    <View style={styles.modalContent}>
                      <Image source={{ uri: item?.FoodImage }} style={{ width: 280, height: 100, resizeMode: 'cover', borderRadius: 5, alignItems: 'center' }} />
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, marginBottom: 10 }}>
                        <Text style={{ flex: 1, textAlign: 'left', fontFamily: 'Kanit_400Regular', fontSize: 20 }}>{item?.FoodName}</Text>
                        <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Kanit_400Regular', fontSize: 20 }}>{item?.FoodCalorie} แคลอรี่</Text>
                      </View>

                      <View style={{ backgroundColor: '#52B788', borderRadius: 10, width: '99%', height: '2%', marginTop: 5, }}></View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, backgroundColor: '#FFE68C', borderRadius: 100, width: '100%', height: '5%', alignItems: 'center' }}>
                        <Text style={{ flex: 1, textAlign: 'left', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>โปรตีน</Text>
                        <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>{item?.FoodProtein} กรัม </Text>
                      </View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, backgroundColor: '#D7F3FF', borderRadius: 100, width: '100%', height: '5%', alignItems: 'center' }}>
                        <Text style={{ flex: 1, textAlign: 'left', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>ไขมัน</Text>
                        <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>{item?.FoodFat} กรัม </Text>
                      </View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, backgroundColor: '#FFD5FB', borderRadius: 100, width: '100%', height: '5%', alignItems: 'center' }}>
                        <Text style={{ flex: 1, textAlign: 'left', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>ไฟเบอร์</Text>
                        <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>{item?.FoodFiber} กรัม </Text>
                      </View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, backgroundColor: '#C2FFD3', borderRadius: 100, width: '100%', height: '5%', alignItems: 'center' }}>
                        <Text style={{ flex: 1, textAlign: 'left', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>คาร์โบไฮเดรต</Text>
                        <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>{item?.FoodCarbo} กรัม </Text>
                      </View>

                      <TouchableOpacity style={styles.button} onPress={() => recordMealLunch(item)}>
                        <Text style={styles.buttonText}>เพิ่มรายการอาหาร</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              )}
            </View>
          )}

          {activeTab2 === 'Tab2' &&
            <View style={{ backgroundColor: '#D0EDD3', padding: 20, borderRadius: 10, width: '85%', height: '70%' }}>
              <Text style={styles.Text}>อาหาร</Text>
              <TextInput
                style={styles.input}
                value={editedMealName}
                onChangeText={setEditedMealName}
              />
              <Text style={styles.Text}>แคลอรี่</Text>
              <TextInput
                style={styles.input}
                value={editedMealCalories}
                onChangeText={setEditedMealCalories}
              />
              <Text style={styles.Text}>โปรตีน</Text>
              <TextInput
                style={styles.input}
                value={editedMealProtien}
                onChangeText={setEditedMealProtien}
              />
              <Text style={styles.Text}>ไขมัน</Text>
              <TextInput
                style={styles.input}
                value={editedMealFat}
                onChangeText={setEditedMealFat}
              />
              <Text style={styles.Text}>คาร์โบไฮเดรต</Text>
              <TextInput
                style={styles.input}
                value={editedMealCarbo}
                onChangeText={setEditedMealCarbo}
              />
              <Text style={styles.Text}>ไฟเบอร์</Text>
              <TextInput
                style={styles.input}
                value={editedMealFiber}
                onChangeText={setEditedMealFiber}
              />

              <TouchableOpacity style={styles.recordButton} onPress={handleSaveEdit}>
                <Text style={styles.buttonText}>บันทึกการแก้ไข</Text>
              </TouchableOpacity>
            </View>
          }
        </View>
      </Modal>


{/* Add Dinner */}
      <View style={styles.style}>
        <View>
          {mealData.length > 0 ? (
            <View style={styles.mealRow}>

              <Image
                source={require('../assets/dinner.png')}
                style={{ width: 85, height: 85, right: 50 }} resizeMode="cover" />

              <View style={{ justifyContent: 'center', left: '-20%' }}>
                <Text style={{ fontSize: 15, fontFamily: 'Kanit_400Regular', color: '#C4C4D5', }}>อาหารเย็น</Text>
                <Text style={{ fontSize: 16, fontFamily: 'Kanit_400Regular', color: '#958E8F', }}>{mealData[0].DName}</Text>
                <Text style={{ fontSize: 22, fontFamily: 'Kanit_400Regular', color: '#D83E58', }}>{mealData[0].Dcalories}<Text style={{ fontSize: 17, fontFamily: 'Kanit_400Regular', color: '#C4C4D5', }}> แคลอรี่</Text></Text>
              </View>

              <TouchableOpacity style={{ justifyContent: 'center', left: '50%' }} onPress={handleEditPress2}>
                <Ionicons name="create-outline" size={30} color="#52B788" />
              </TouchableOpacity>

            </View>
          ) : (
            <View style={styles.mealContainer}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 40, }}>
                <Image
                  source={require('../assets/dinner.png')}
                  style={styles.mealImage}
                  resizeMode="cover"
                />
                <Text style={styles.mealHeaderText}>อาหารเย็น </Text>
                <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => navigation.navigate('Dinner')}>
                  <Ionicons name="add-circle" size={50} color="#52B788" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

{/* Modal Edit Dinner */}
        <Modal
          transparent={true}
          animationType="slide"
          visible={isEditing2}
          onRequestClose={handleCancelEdit2}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeModalButton} onPress={handleCancelEdit2}>
              <Text style={styles.buttonText}>X</Text>
            </TouchableOpacity>

            <View style={styles.tabMenu}>
              <TouchableOpacity
                style={[styles.tab, activeTab3 === 'Tab1' && styles.activeTab]}
                onPress={() => handleTabPress3('Tab1')}>
                <Text style={styles.tabText}>ค้นหา</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab3 === 'Tab2' && styles.activeTab]}
                onPress={() => handleTabPress3('Tab2')}>
                <Text style={styles.tabText}>เพิ่มรายการอาหาร</Text>
              </TouchableOpacity>

            </View>

            {activeTab3 === 'Tab1' && (
              <View style={{ backgroundColor: '#D0EDD3', padding: 20, borderRadius: 5, width: '85%', height: '68%' }}>
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

                {searchQuery && (
                  <FlatList
                    data={foods.filter((food) =>
                      food && food.FoodName && food.FoodName.toLowerCase().includes(searchQuery.toLowerCase())
                    )}
                    keyExtractor={(food) => food.FoodName}
                    renderItem={({ item }) => (
                      <View style={styles.modalContent}>
                        <Image source={{ uri: item?.FoodImage }} style={{ width: 280, height: 100, resizeMode: 'cover', borderRadius: 5, alignItems: 'center' }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, marginBottom: 10 }}>
                          <Text style={{ flex: 1, textAlign: 'left', fontFamily: 'Kanit_400Regular', fontSize: 20 }}>{item?.FoodName}</Text>
                          <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Kanit_400Regular', fontSize: 20 }}>{item?.FoodCalorie} แคลอรี่</Text>
                        </View>

                        <View style={{ backgroundColor: '#A0F1AF', borderRadius: 10, width: '99%', height: '2%', }}></View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, backgroundColor: '#FFE68C', borderRadius: 100, width: '100%', height: '5%', alignItems: 'center' }}>
                          <Text style={{ flex: 1, textAlign: 'left', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>โปรตีน</Text>
                          <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>{item?.FoodProtein} กรัม </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, backgroundColor: '#D7F3FF', borderRadius: 100, width: '100%', height: '5%', alignItems: 'center' }}>
                          <Text style={{ flex: 1, textAlign: 'left', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>ไขมัน</Text>
                          <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>{item?.FoodFat} กรัม </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, backgroundColor: '#FFD5FB', borderRadius: 100, width: '100%', height: '5%', alignItems: 'center' }}>
                          <Text style={{ flex: 1, textAlign: 'left', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>ไฟเบอร์</Text>
                          <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>{item?.FoodFiber} กรัม </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, backgroundColor: '#C2FFD3', borderRadius: 100, width: '100%', height: '5%', alignItems: 'center' }}>
                          <Text style={{ flex: 1, textAlign: 'left', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>คาร์โบไฮเดรต</Text>
                          <Text style={{ flex: 1, textAlign: 'right', fontFamily: 'Kanit_400Regular', fontSize: 15, padding: 2, color: '#7E7B7B' }}>{item?.FoodCarbo} กรัม </Text>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={() => recordMealDinner(item)}>
                          <Text style={styles.buttonText}>บันทึก</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                )}
              </View>
            )}
            {activeTab3 === 'Tab2' &&
              <View style={{ backgroundColor: '#D0EDD3', padding: 20, borderRadius: 10, width: '85%', height: '70%' }}>
                <Text style={styles.Text}>อาหาร</Text>
                <TextInput
                  style={styles.input}
                  value={editedDinnerName}
                  onChangeText={setEditedDinnerName}
                />
                <Text style={styles.Text}>แคลอรี่</Text>
                <TextInput
                  style={styles.input}
                  value={editedDinnerCalories}
                  onChangeText={setEditedDinnerCalories}
                />
                <Text style={styles.Text}>โปรตีน</Text>
                <TextInput
                  style={styles.input}
                  value={editedDinnerProtien}
                  onChangeText={setEditedDinnerProtien}
                />
                <Text style={styles.Text}>ไขมัน</Text>
                <TextInput
                  style={styles.input}
                  value={editedDinnerFat}
                  onChangeText={setEditedDinnerFat}
                />
                <Text style={styles.Text}>คาร์โบไฮเดรต</Text>
                <TextInput
                  style={styles.input}
                  value={editedDinnerlCarbo}
                  onChangeText={setEditedDinnerCarbo}
                />
                <Text style={styles.Text}>ไฟเบอร์</Text>
                <TextInput
                  style={styles.input}
                  value={editedDinnerFiber}
                  onChangeText={setEditedDinnerFiber}
                />

                <TouchableOpacity style={styles.recordButton} onPress={handleSaveEditDinner}>
                  <Text style={styles.buttonText}>บันทึกการแก้ไข</Text>
                </TouchableOpacity>
              </View>
            }
          </View>
        </Modal>

      </View>
    </SafeAreaView>
</ScrollView>
  );
}

export default Journal;