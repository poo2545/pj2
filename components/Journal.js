import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { UserType } from '../UserContext';
import { apiBaseUrl } from '../ApiConfig';

const YourComponent = () => {
  const { userId } = useContext(UserType);
  const [mealData, setMealData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMealData = async () => {
    try {
      const apiUrl = `http://${apiBaseUrl}:8000/meals/${userId}`;
      const response = await axios.get(apiUrl);

      setMealData(response.data);
      console.log(apiUrl);
      console.log(response);
    } catch (error) {
      console.error('Error fetching meal data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealData();
  }, [userId]);

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        mealData.map(meal => (
          <View key={meal._id}>
            <Text>{meal.Date}</Text>
            <Text>อาหารเช้า</Text>
            <Text>{meal.BName}</Text>
            <Text>{meal.Bcalories}</Text>

            <Text>อาหารกลางวัน</Text>
            <Text>{meal.LName}</Text>
            <Text>{meal.Lcalories}</Text>

            <Text>อาหารเย็น</Text>
            <Text>{meal.DName}</Text>
            <Text>{meal.Dcalories}</Text>

            <Text>รวมปริมาณแคลอรี่ใน 1</Text>
            <Text>{meal.SumCalorie}</Text>


          </View>
        ))
      )}
    </View>
  );
};

export default YourComponent;
