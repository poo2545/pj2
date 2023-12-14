import React, { useState, useLayoutEffect, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, SafeAreaView, FlatList, Modal, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { LineChart } from 'react-native-chart-kit';
import NutrientsGraph from '../components/NutrientsGraph';
import { UserType } from '../UserContext';
import { apiBaseUrl } from '../ApiConfig';
import { Ionicons } from "@expo/vector-icons";


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
          <Text style={{ fontSize: 10, fontFamily: 'Kanit_400Regular', color: '#00A0D7' }}>Refresh</Text>
        </TouchableOpacity>
      ),
    });
  },);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    fetchMealData();
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

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const toggleEditModal = (id) => {
    setEditModalVisible(!isEditModalVisible);
  };
  const [isEditing, setIsEditing] = useState(false);
  const [editedMealName, setEditedMealName] = useState('');
  const [editedMealCalories, setEditedMealCalories] = useState('');
  const [editedMealProtien, setEditedMealProtien] = useState('');
  const [editedMealFat, setEditedMealFat] = useState('');
  const [editedMealCarbo, setEditedMealCarbo] = useState('');
  const [editedMealFiber, setEditedMealFiber] = useState('');

  const handleEditPress = () => {
    setIsEditing(true);
    setEditedMealName(mealData[0].LName); // Initialize edited value with the current meal name
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
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

  const handleCancelEditBreakfast = () => {
    setIsBreakfast(false);
  };

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

  const [isEditing2, setIsEditing2] = useState(false);
  const [editedDinnerName, setEditedDinnerName] = useState('');
  const [editedDinnerCalories, setEditedDinnerCalories] = useState('');
  const [editedDinnerProtien, setEditedDinnerProtien] = useState('');
  const [editedDinnerFat, setEditedDinnerFat] = useState('');
  const [editedDinnerlCarbo, setEditedDinnerCarbo] = useState('');
  const [editedDinnerFiber, setEditedDinnerFiber] = useState('');

  const handleEditPress2 = () => {
    setIsEditing2(true);
    setEditedDinnerName(mealData[0].DName);
  };
  const handleCancelEdit2 = () => {
    setIsEditing2(false);
  };

  const handleAddBreakfast = () => {
    setIsBreakfast(true);
  };

  const [isBreakfast, setIsBreakfast] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [breakfastName, setBreakfastName] = useState('');
  const [breakfastCalories, setBreakfastCalories] = useState('');
  const [breakfastProtein, setBreakfastProtein] = useState('');
  const [breakfastFat, setBreakfastFat] = useState('');
  const [breakfastCarbohydrate, setBreakfastCarbohydrate] = useState('');
  const [breakfastFiber, setBreakfastFiber] = useState('');

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
  
      // Call handleRefresh as a function, not as a promise
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
  
  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.mealContainer}>
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

      <View style={styles.circleTopic}>
        <Text style={styles.buttonText1}>
          {mealData.length > 0 ?
            mealData.reduce((total, meal) => total + meal.Bcalories + meal.Lcalories + meal.Dcalories, 0)
            : 0
          }
        </Text>
        <Text style={styles.buttonText1}>แคลอรี่</Text>
      </View>

      <View style={styles.krop}>
        <Text style={styles.buttonText1}>สารอาหารหลัก</Text>
        <View style={styles.container2}>

          <View style={styles.circle}>
            <Text style={styles.text}>โปรตีน</Text>
            <Text style={styles.text}>
            {mealData.length > 0 ?
            mealData.reduce((total, meal) => total + meal.BProtein + meal.LProtein + meal.DProtein, 0): 0
          }
           กรัม </Text>
          </View>

          <View style={styles.circle1}>
            <Text style={styles.text}>ไขมัน</Text>
            <Text style={styles.text}>            
            {mealData.length > 0 ?
            mealData.reduce((total, meal) => total + meal.BFat + meal.LFat + meal.DFat, 0): 0
          }
           กรัม </Text>

          </View>
          <View style={styles.circle2}>
            <Text style={styles.text}>คาร์โบ..</Text>
            <Text style={styles.text}>{mealData.length > 0 ?
            mealData.reduce((total, meal) => total + meal.BCarbohydrate + meal.LCarbohydrate + meal.DCarbohydrate, 0): 0
          }
          กรัม</Text>

          </View>
          <View style={styles.circle2}>
            <Text style={styles.text}>ไฟเบอร์</Text>
            <Text style={styles.text}>{mealData.length > 0 ?
            mealData.reduce((total, meal) => total + meal.BFiber + meal.LFiber+ meal.DFiber, 0): 0
          }กรัม</Text>
          </View>
        </View>
      </View>

      <View style={styles.style}>
        <View>
          {mealData.length > 0 ? (
            <View style={styles.mealRow}>

              <View style={{ position: 'absolute', top: 5, left: -110 }}>
                <Image
                  source={require('../assets/breakfast.png')}
                  style={{ width: 85, height: 85, }} resizeMode="cover" />
              </View>
              <View style={{ justifyContent: 'center' }}>
                <Text style={{ fontSize: 17, fontFamily: 'Kanit_400Regular', color: '#C4C4D5', }}>อาหารเช้า</Text>
                <Text style={{ fontSize: 21, fontFamily: 'Kanit_400Regular', color: '#958E8F', }}>{mealData[0].BName}</Text>
                <Text style={{ fontSize: 23, fontFamily: 'Kanit_400Regular', color: '#D83E58', }}>{mealData[0].Bcalories}<Text style={{ fontSize: 20, fontFamily: 'Kanit_400Regular', color: '#C4C4D5', }}> แคลอรี่</Text></Text>
              </View>

              <View style={{ position: 'absolute', top: 1, right: -115 }}>
                <View>
                  <TouchableOpacity
                    onPress={handleAddBreakfast}
                  >
                    <Ionicons name="create-outline" size={30} color="#52B788" />
                  </TouchableOpacity>
                </View>

                <View style={{ position: 'absolute', top: 1, right: -23 }}>
                </View>
              </View>
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

      <Modal
        transparent={true}
        animationType="slide"
        visible={isBreakfast}
        onRequestClose={handleAddBreakfast}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeModalButton} onPress={handleCancelEditBreakfast}>
            <Text style={styles.buttonText}>X</Text>
          </TouchableOpacity>

          <View style={{ backgroundColor: '#D0EDD3', padding: 20, borderRadius: 10, width: '85%', height: '70%' }}>
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
        </View>
      </Modal>

      <View style={styles.style}>
        <View>
          {mealData.length > 0 ? (
            <View style={styles.mealRow}>
              <View style={{ position: 'absolute', top: 5, left: -110 }}>
                <Image
                  source={require('../assets/lunch.png')}
                  style={{ width: 85, height: 85 }} resizeMode="cover"
                />
              </View>
              <View style={{ justifyContent: 'center' }}>
                <Text style={{ fontSize: 17, fontFamily: 'Kanit_400Regular', color: '#C4C4D5' }}>อาหารกลางวัน</Text>
                <Text style={{ fontSize: 21, fontFamily: 'Kanit_400Regular', color: '#958E8F' }}>{mealData[0].LName}</Text>
                <Text style={{ fontSize: 23, fontFamily: 'Kanit_400Regular', color: '#D83E58' }}>{mealData[0].Lcalories}
                  <Text style={{ fontSize: 20, fontFamily: 'Kanit_400Regular', color: '#C4C4D5' }}> แคลอรี่</Text>
                </Text>
              </View>
              <View style={{ position: 'absolute', top: 1, right: -115 }}>
                <TouchableOpacity onPress={handleEditPress}>
                  <Ionicons name="create-outline" size={30} color="#52B788" />
                </TouchableOpacity>
              </View>
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
                  <Ionicons  name="add-circle" size={50}  color="#52B788" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
      <Modal
        transparent={true}
        animationType="slide"
        visible={isEditing}
        onRequestClose={handleCancelEdit}
      >
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeModalButton} onPress={handleCancelEdit}>
            <Text style={styles.buttonText}>X</Text>
          </TouchableOpacity>


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
        </SafeAreaView>
      </Modal>

      <View style={styles.style}>
        <View>
          {mealData.length > 0 ? (
            <View style={styles.mealRow}>

              <View style={{ position: 'absolute', top: 1, left: -120 }}>
                <Image
                  source={require('../assets/dinner.png')}
                  style={{ width: 85, height: 85, }} resizeMode="cover" />
              </View>
              <View style={{ justifyContent: 'center' }}>
                <Text style={{ fontSize: 17, fontFamily: 'Kanit_400Regular', color: '#C4C4D5', }}>อาหารเย็น</Text>
                <Text style={{ fontSize: 20, fontFamily: 'Kanit_400Regular', color: '#958E8F', }}>{mealData[0].DName}</Text>
                <Text style={{ fontSize: 23, fontFamily: 'Kanit_400Regular', color: '#D83E58', }}>{mealData[0].Dcalories}<Text style={{ fontSize: 20, fontFamily: 'Kanit_400Regular', color: '#C4C4D5', }}> แคลอรี่</Text></Text>
              </View>

              <View style={{ position: 'absolute', top: 1, right: -120 }}>
                <View>
                  <TouchableOpacity onPress={handleEditPress2}>
                    <Ionicons name="create-outline" size={30} color="#52B788" />
                  </TouchableOpacity>
                </View>

                <View style={{ position: 'absolute', top: 1, right: -23 }}>
                </View>
              </View>
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
                  <Ionicons  name="add-circle" size={50}  color="#52B788" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

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
          </View>
        </Modal>

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
  text: {
    color: '#D7D7D9',
    fontSize: 13,
    fontFamily: 'Kanit_400Regular',
  },
  krop: {
    width: '90%',
    height: '20%',
    flexShrink: 0,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 15,
  },
  circleTopic: {
    width: 120,
    height: 120,
    borderRadius: 75,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 7,
    borderColor: '#005B34',
    marginTop: 20,
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 20,
    flexDirection: 'row',
    marginTop: 15,
  },
  circle: {
    width: 75,
    height: 75,
    borderRadius: 75,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 7,
    borderColor: '#FF88F3',
  },
  circle1: {
    width: 75,
    height: 75,
    borderRadius: 75,
    backgroundColor: 'white',
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
  buttonText1: {
    fontSize: 18,
    color: '#958E8F',
    fontFamily: 'Kanit_400Regular',
  },
  mealContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  mealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
  },
  mealImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  mealHeaderText: {
    fontSize: 20,
    fontFamily: 'Kanit_400Regular',
    color: '#C4C4D5',
    marginBottom: 12,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
  },
  Text: {
    color: 'green',
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
    alignItems: 'flex-start',
  },
  Title: {
    color: 'green',
    fontSize: 25,
    fontFamily: 'Kanit_400Regular',
    alignItems: 'center',
  },
  style: {
    width: '90%',
    height: '15%',
    backgroundColor: 'white',
    borderRadius: 15,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
    marginTop: 2,
    fontFamily: 'Kanit_400Regular',
  },

  editButtonText: {
    color: 'white',
    fontSize: 12,
    justifyContent: 'center',
    fontFamily: 'Kanit_400Regular',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#D0D0ED',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontFamily: 'Kanit_400Regular',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 10,
    elevation: 15,
  },
  closeModalButton: {
    backgroundColor: '#CC0000',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 50,
    marginTop: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
  deleteItem: {
    backgroundColor: '#FF8888',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    justifyContent: 'center'
  },
  editButton: {
    backgroundColor: '#52B788',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
    justifyContent: 'center',
    fontFamily: 'Kanit_400Regular',
  },
  recordButton: {
    backgroundColor: '#52B788',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
    textAlign: 'center',
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
    borderRadius: 50,
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
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontFamily: 'Kanit_400Regular',
  },

});


export default Journal;