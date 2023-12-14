import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { apiBaseUrl } from '../ApiConfig';
import { UserType } from '../UserContext';

const CalorieOverviewGraph = () => {
  const [calorieData, setCalorieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useContext(UserType);

  const [mealData, setMealData] = useState([]);

  const fetchMealData = async () => {
    try {
      const apiUrl = `http://${apiBaseUrl}:8000/meals/${userId}`;
      const response = await axios.get(apiUrl);

      setMealData(response.data);
      setLoading(false); // Set loading to false after data is fetched
      console.log(response);
    } catch (error) {
      console.error('Error fetching meal data:', error.message);
    }
  };

  useEffect(() => {
    fetchMealData();
  }, [userId]);

  const prepareChartData = () => {
    const chartData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Assuming the API date format is 'YYYY-MM-DD'
      const apiDateFormat = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
     
      const dayTotalCalories = mealData
      .filter(meal => meal.date === apiDateFormat)
      .reduce((total, meal) => total + (meal.Bcalories || 0) + (meal.Lcalories || 0) + (meal.Dcalories || 0), 0);
    
      console.log('Formatted Date:', formattedDate);
      console.log('API Date Format:', apiDateFormat);
      console.log('Day Total Calories:', dayTotalCalories);
      chartData.push({ date: formattedDate, calories: dayTotalCalories });
    }
    return chartData; // You can remove this line if you don't want to return the data
  };

  const chartData = prepareChartData();


  return (
    <View>
      {chartData.length > 0 ? (
        <LineChart
          data={{
            labels: chartData.map(data => data.date),
            datasets: [
              {
                data: chartData.map(data => data.calories),
              },
            ],
          }}
          width={Dimensions.get('window').width - 40}
          height={250}
          yAxisLabel=""
          yAxisSuffix=" แคลอรี่"
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: '#000000',
            backgroundGradientFrom: '#8BFFAC',
            backgroundGradientTo: '#03E292',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#00A469',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      ) : (
        <Text>No data available for the past 7 days</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
});

export default CalorieOverviewGraph;
