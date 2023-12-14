import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, SafeAreaView, Button, FlatList ,TextInput } from 'react-native'
import React, { useState, useLayoutEffect, useEffect, useContext } from 'react';
import { apiBaseUrl } from '../ApiConfig';
import { UserType } from '../UserContext';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';

const DairySave = () => {
  const { userId, setUserId } = useContext(UserType);
  const [mealData, setMealData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isCalendarVisible, setCalendarVisible] = useState(false);

  const handleCalendarClick = () => {
    setCalendarVisible(true);
  };
  const handleDateClick = (date) => {
    setSelectedDate(date.dateString);
    setCalendarVisible(false);
  };
  
const handleEditClick = (item) => {
  setEditItem(item);
  setEditModalVisible(true);
};

const handleEditModalClose = () => {
  setEditModalVisible(false);
};

  const fetchMealData = async () => {
    try {
      const apiUrl = `http://${apiBaseUrl}:8000/meals/${userId}/${selectedDate}`;
      const response = await axios.get(apiUrl);
      setMealData(response.data);
      const response2 = await axios.get(apiUrl);
      console.log('Additional Data:', response2.data);
    } catch (error) {
      console.error('Error fetching meal data:', error.message);
    }
  };
  useEffect(() => {
    fetchMealData();
  }, [userId, selectedDate]);

  const [isEditModalVisible, setEditModalVisible] = useState(false);
const [editItem, setEditItem] = useState(null);


const handleUpdateItem = async (updatedData) => {
  try {
    const apiUrl = `http://${apiBaseUrl}:8000/meals/${userId}/${selectedDate}/${editItem._id}`;
    const updatedItemResponse = await axios.put(apiUrl, updatedData);

    console.log('Updated item:', updatedItemResponse.data);
    fetchMealData();
    handleEditModalClose();
  } catch (error) {
    console.error('Error updating menu item:', error.message);
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.mealContainer}>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleCalendarClick} style={{ width: '50%', height: 30, backgroundColor: '#52B788', borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.buttonText}>{selectedDate}</Text>
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
                [selectedDate]: {
                  selected: true,
                  selectedColor: 'blue',
                },
              }}
              onDayPress={handleDateClick}
            />
          </SafeAreaView>
        </Modal>
      </View>

      <View style={styles.header}>
        <Text style={styles.textStyle}>อาหารเช้า</Text>
      </View>
      <View style={styles.krop}>
        {mealData.length > 0 ? (
          mealData.map((item, index) => (
            <View style={styles.container2} key={index}>
              {item.Breakfast.map((BreakfastItem, BreakfastItemIndex) => (
                <View style={styles.circle2} key={BreakfastItemIndex}>
                  <TouchableOpacity onPress={() => handleEditClick(BreakfastItem)} key={BreakfastItemIndex}>
                  <Text style={{ color: '#8B8383', fontSize: 20, fontFamily: 'Kanit_400Regular' }}>
                    {BreakfastItem.BName}
                  </Text>
                  </TouchableOpacity>
                  <Text style={{ color: '#DD7979', fontSize: 20, fontFamily: 'Kanit_400Regular', fontWeight: 'bold' }}>
                    {BreakfastItem.Bcalories}
                  </Text>
                  <Text style={{ color: '#8B8383', fontSize: 20, fontFamily: 'Kanit_400Regular' }}>Kcal</Text>
                </View>
              ))}
            </View>
          ))
        ) : (
          <Text style={{ color: '#DD7979', fontSize: 20, fontFamily: 'Kanit_400Regular' }}>คุณยังไม่เพิ่มรายการอาหาร</Text>
        )}
      </View>

      <Modal
  animationType="slide"
  transparent={false}
  visible={isEditModalVisible}
  onRequestClose={handleEditModalClose}
>
  <View style={{ flex: 1, marginTop: 500 }}>
    {/* Your edit form or component */}
    {/* You can create a separate EditForm component for a cleaner code structure */}
    <TextInput
      value={editItem && editItem.BName}
      onChangeText={(text) => {
        // Update the BName in the local state when the user types
        setEditItem((prevEditItem) => ({
          ...prevEditItem,
          BName: text,
        }));
      }}
      placeholder="Enter new name"
      style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
    />
    {/* Add your input fields, buttons, etc. for editing */}
    <Button title="Update" onPress={() => handleUpdateItem(/* updated data here */)} />
    <Button title="Cancel" onPress={handleEditModalClose} />
  </View>
</Modal>


      <View style={styles.header}>
        <Text style={styles.textStyle}>อาหารเที่ยง</Text>
      </View>

      <View style={styles.krop}>
        {mealData.length > 0 ? (
          mealData.map((item, index) => (
            <View style={styles.container2} key={index}>
              {item.Lunch.map((lunchItem, lunchIndex) => (
                <View style={styles.circle2} key={lunchIndex}>
                  <Text style={{ color: '#8B8383', fontSize: 20, fontFamily: 'Kanit_400Regular' }}>
                    {lunchItem.LName}
                  </Text>
                  <Text style={{ color: '#DD7979', fontSize: 20, fontFamily: 'Kanit_400Regular', fontWeight: 'bold' }}>
                    {lunchItem.Lcalories}
                  </Text>
                  <Text style={{ color: '#8B8383', fontSize: 20, fontFamily: 'Kanit_400Regular' }}>Kcal</Text>
                </View>
              ))}
            </View>
          ))
        ) : (
          <Text style={{ color: '#DD7979', fontSize: 20, fontFamily: 'Kanit_400Regular' }}>คุณยังไม่เพิ่มรายการอาหาร</Text>
        )}
      </View>

      <View style={styles.header}>
        <Text style={styles.textStyle}>อาหารเย็น</Text>
      </View>

      <View style={styles.krop}>
        {mealData.length > 0 ? (
          mealData.map((item, index) => (
            <View style={styles.container2} key={index}>
              {item.Dinner.map((dinnerItem, dinnerIndex) => (
                <View style={styles.circle2} key={dinnerIndex}>
                  <Text style={{ color: '#8B8383', fontSize: 20, fontFamily: 'Kanit_400Regular' }}>
                    {dinnerItem.DName}
                  </Text>
                  <Text style={{ color: '#DD7979', fontSize: 20, fontFamily: 'Kanit_400Regular', fontWeight: 'bold' }}>
                    {dinnerItem.Dcalories}
                  </Text>
                  <Text style={{ color: '#8B8383', fontSize: 20, fontFamily: 'Kanit_400Regular' }}>Kcal</Text>
                </View>
              ))}
            </View>
          ))
        ) : (
          <Text style={{ color: '#DD7979', fontSize: 20, fontFamily: 'Kanit_400Regular' }}>คุณยังไม่เพิ่มรายการอาหาร</Text>
        )}
      </View>

      <View>
      </View> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    height: 45,
    backgroundColor: '#52B788',
    marginTop: 5,
  },
  textStyle: {
    textAlign: 'left',
    color: '#fff',
    fontSize: 18,
    padding: 7,
    fontFamily: 'Kanit_400Regular',
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 25,
    flexDirection: 'row',
    marginTop: 15,
  },
  circle1: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  circle2: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    padding: 2,
  },
  krop: {
    width: '90%',
    height: '12%',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  mealContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
  },
});

export default DairySave;