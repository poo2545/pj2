import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../components/styles'; // นำเข้า style จากไฟล์ styles.js

const MealItem = ({ meal, onEditPress, onAddPress }) => {
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
    
  return (
    <View style={styles.mealRow}>
      <View style={styles.mealImageContainer}>
      <Image
                  source={require('../assets/breakfast.png')}
                  style={{ width: 85, height: 85, }} resizeMode="cover" />
      </View>
      <View style={styles.mealContent}>
        <Text style={styles.mealHeaderText}>{meal.title}</Text>
        <Text style={styles.mealCalories}>{meal.calories} แคลอรี่</Text>
      </View>
      <View style={styles.mealActions}>
        {onEditPress && (
          <TouchableOpacity onPress={onEditPress}>
            <Ionicons name="create-outline" size={30} color="#52B788" />
          </TouchableOpacity>
        )}
        {onAddPress && (
          <TouchableOpacity onPress={onAddPress}>
            <Ionicons name="add-circle" size={50} color="#52B788" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MealItem;
