import { View, Text, StyleSheet, Image, TouchableOpacity , Alert } from 'react-native'
import React, { useState, useLayoutEffect, useEffect, useContext  } from 'react';
import { apiBaseUrl } from '../ApiConfig';
import { UserType } from '../UserContext';
import axios from 'axios';
import Test from './Test';
import { Ionicons } from "@expo/vector-icons";

const Breakfast = () => {
    const [meals, setMeals] = useState([]);
    const { userId, setUserId } = useContext(UserType);

    useEffect(() => {
        fetchData();
    }, [userId]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://${apiBaseUrl}:8000/patientMeals/${userId}`);
            setMeals(response.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.error('API endpoint not found. Check the server routes.');
            } else {
                console.error('Error fetching data:', error);
            }
        }
    };

    const handleDelete = async (mealId) => {
        try {
          await axios.delete(`http://${apiBaseUrl}:8000/patientMeals/${mealId}`);
          // After successful deletion, fetch meals again to update the UI
          fetchData();
        } catch (error) {
          console.error('Error deleting meal:', error);
        }
      };

      const confirmDelete = (mealId) => {
        Alert.alert(
          'Confirm Delete',
          'Are you sure you want to delete this meal?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', onPress: () => handleDelete(mealId), style: 'destructive' },
          ],
          { cancelable: true }
        );
      };

      return (
        <View style={styles.krop}>
          {meals.length > 0 ? (
            meals.map((meal) => (
              <View style={styles.container2} key={meal._id}>
                <View style={styles.circle2}>
                  <Text style={{ color: '#8B8383', fontSize: 20, fontFamily: 'Kanit_400Regular' }}>
                    {meal.mealName}
                  </Text>
                  <Text style={{ color: '#DD7979', fontSize: 20, fontFamily: 'Kanit_400Regular', fontWeight: 'bold' }}>
                    {meal.calories}
                  </Text>
                  <Text style={{ color: '#8B8383', fontSize: 20, fontFamily: 'Kanit_400Regular' }}>Kcal</Text>
    
                  <TouchableOpacity style={{padding : 5 , marginBottom:5 }} onPress={() => confirmDelete(meal._id)}>
                    <Ionicons name="trash" size={23} color="#52B788" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ color: '#DD7979', fontSize: 20, fontFamily: 'Kanit_400Regular' }}>คุณยังไม่เพิ่มรายการอาหาร</Text>
          )}
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
    });
export default Breakfast;