import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Button, FlatList, Modal, SafeAreaView, TextInput } from 'react-native';
import DatePicker from 'react-native-datepicker';
import axios from 'axios';
import { UserType } from '../UserContext';
import { apiBaseUrl } from '../ApiConfig';
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from 'react-native-calendars';

const MealTracker = () => {
  const [mealData, setMealData] = useState([]);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [textInputDate, setTextInputDate] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const { userId } = useContext(UserType);
  const handleCalendarClick = () => {
    setCalendarVisible(true);
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setTextInputDate(day.dateString); // Update the TextInput value when a date is selected
    setCalendarVisible(false);
  };
  const fetchMealData = async () => {
    try {

      const apiUrl = `http://${apiBaseUrl}:8000/meals/${userId}/${selectedDate}`;
      const response = await axios.get(apiUrl);
      setMealData(response.data);

      console.log('API URL:', apiUrl);

      const response2 = await axios.get(apiUrl);
      console.log('Additional Data:', response2.data);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching meal data:', error.message);
    }
  };
  
  useEffect(() => {
    fetchMealData();
  }, [userId, selectedDate]);
  


  return (
    <View>
      <Ionicons onPress={handleCalendarClick} name="calendar" size={24} color="black" />
      <Modal
        animationType="slide"
        transparent={false}
        visible={isCalendarVisible}
        onRequestClose={() => setCalendarVisible(false)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Button title="Close Calendar" onPress={() => setCalendarVisible(false)} />
          <Calendar
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: 'blue',
              },
            }}
            onDayPress={handleDayPress}
          />
        </SafeAreaView>
      </Modal>

      <Modal
  animationType="slide"
  transparent={false}
  visible={isModalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <SafeAreaView style={{ flex: 1 }}>
    <Button title="Close Modal" onPress={() => setModalVisible(false)} />

    {/* Display the fetched meal data in a FlatList within the modal */}
    <FlatList
      data={mealData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>Date: {item.Date}</Text>
          <Text>User ID: {item.user}</Text>

          {/* Display details for Breakfast */}
          <Text>Breakfast:</Text>
          {item.Breakfast.map((food, index) => (
            <View key={index}>
              <Text>Name: {food.BName}</Text>
              <Text>Calories: {food.Bcalories}</Text>
              <Text>Protein: {food.BProtein}</Text>
              <Text>Fat: {food.BFat}</Text>
              <Text>Carbohydrate: {food.BCarbohydrate}</Text>
              <Text>Fiber: {food.BFiber}</Text>
            </View>
          ))}
        </View>
      )}
      ListEmptyComponent={() => (
        <View>
          <Text>No meal data available</Text>
        </View>
      )}
    />
  </SafeAreaView>
</Modal>

      <Button title="Fetch Data" onPress={fetchMealData} />
    </View>
  );
};


export default MealTracker;
