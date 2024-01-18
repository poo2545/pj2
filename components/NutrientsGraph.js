import React, { useState, useEffect, useContext } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, Image, Modal, SafeAreaView, Button } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import { apiBaseUrl } from '../ApiConfig';
import { UserType } from '../UserContext';
import { Calendar } from 'react-native-calendars';

const CalorieOverviewGraph = () => {
  const { userId } = useContext(UserType);
  const [mealData, setMealData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalVisible, setModalVisible] = useState(false);
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

  const fetchMealData = async () => {
    try {
      const apiUrl = `http://${apiBaseUrl}:8000/meals/${userId}`;
      const response = await axios.get(apiUrl);

      setMealData(response.data);
      const groupedData = groupDataByDate(response.data);
      setChartData(groupedData);
      setLoading(false);
      console.log(response);
    } catch (error) {
      console.error('Error fetching meal data:', error.message);
    }
  };

  const groupDataByDate = (data) => {
    const selectedDateCopy = new Date(selectedDate);
    const last7Days = new Date(selectedDateCopy);
    last7Days.setDate(selectedDateCopy.getDate() - 6);

    const groupedData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(last7Days);
      date.setDate(last7Days.getDate() + i);

      const formattedDate = formatDateForDisplay(date);
      const matchingItem = data.find(item => formatDateForDisplay(new Date(item.Date)) === formattedDate);

      if (matchingItem) {
        groupedData.push({
          Date: formattedDate,
          SumCalorie: matchingItem.SumCalorie,
        });
      } else {
        groupedData.push({
          Date: formattedDate,
          SumCalorie: 0,
        });
      }
    }

    return groupedData;
  };


  const formatDateForDisplay = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' }); // Get short month name
    return `${day}-${month}`;
  };

  useEffect(() => {
    fetchMealData();
  }, [selectedDate, userId]);


  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    decimalPlaces: 0,
    style: {
      borderRadius: 1,
    },
    showValuesOnTopOfBars: true,
    barPercentage: 0.5,
    fontFamily: 'Kanit_400Regular',
    valueAccessor: ({ item }) => item.SumCalorie.toString(),
    withCustomBarColorFromData: true,
    yAxisLabel: 'แคลอรี', // Include the label for the y-axis
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={{ color: '#8B8383', fontSize: 18, marginBottom:15, fontFamily: 'Kanit_400Regular', marginTop: 8, justifyContent: 'center',alignItems:'center' }}> รวมปริมาณแคลอรี่ย้อนหลัง 7 วัน</Text>
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

      <BarChart
  data={{
    labels: chartData.map(item => item.Date), // Use the Date property for x-axis labels
    datasets: [
      {
        data: chartData.map(item => item.SumCalorie),
      },
    ],
  }}
  width={390}
  height={280}
  chartConfig={chartConfig}
/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems:'center',
    
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealContainer: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
    marginTop: 2,
    fontFamily: 'Kanit_400Regular',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
  },
});

export default CalorieOverviewGraph;
