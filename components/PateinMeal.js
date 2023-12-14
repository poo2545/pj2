import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { apiBaseUrl } from '../ApiConfig';
import { UserType } from '../UserContext';

const BreakfastForm = () => {
  const { userId } = useContext(UserType);

  const [breakfastData, setBreakfastData] = useState({
    userId: userId,
    Name: '',
    calories: '',
    Protein: '',
    Fat: '',
    Carbohydrate: '',
    Fiber: '',
  });

  const handleInputChange = (name, value) => {
    setBreakfastData({ ...breakfastData, [name]: value });
  };

  const handleAddBreakfast = async () => {
    try {
      const response = await axios.post(`http://${apiBaseUrl}:8000/meals`, {
        Breakfast: [breakfastData],
      });

      console.log('New breakfast created:', response.data);
    } catch (error) {
      console.error('Error creating breakfast:', error);
    }
  };

  return (
    <View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={{ /* your styles for rectangle4179 */ }}>
          <Text style={{ fontSize: 20, fontFamily: 'Kanit_400Regular', color: 'white', marginTop: 2 }}> เพิ่มรายการอาหาร</Text>
          <TextInput
            style={styles.input}
            placeholder="กรอกชื่ออาหาร"
            placeholderTextColor="#808080"
            value={breakfastData.Name}
            onChangeText={(text) => handleInputChange('Name', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="แคลอรี่"
            placeholderTextColor="#808080"
            value={breakfastData.calories}
            onChangeText={(text) => handleInputChange('calories', text)}
          />
        </View>

        <View style={{ /* your styles for rectangle4178 */ }}>
          <Text style={{ fontSize: 20, fontFamily: 'Kanit_400Regular', color: 'white' }}>สารอาหาร (กรัม)</Text>
          {/* Add similar TextInput components for Protein, Fat, Carbohydrate, Fiber */}
        </View>

        <TouchableOpacity
          style={{ /* your styles for TouchableOpacity */ }}
          onPress={handleAddBreakfast}>
          <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', fontFamily: 'Kanit_400Regular' }}> บันทึก</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
};

const styles = {
  // Define your styles here
  input: {
    // Add your input styles
  },
};

export default BreakfastForm;
