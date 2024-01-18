// NoFoodList.js

import React, { useState, useEffect , useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator,ScrollView , TouchableOpacity} from 'react-native';
import axios from 'axios';
import { apiBaseUrl } from '../ApiConfig';
import { useNavigation } from '@react-navigation/native';
const NoFoodList = () => {
  const [noFoodData, setNoFoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ fontSize: 20, fontFamily: 'Kanit_400Regular', justifyContent: 'center' }}>อาหารที่ควรงด</Text>
      ),
      headerStyle: {
        backgroundColor: '#FFFFFF',
      },
    });
  },);

  useEffect(() => {
    axios.get(`http://${apiBaseUrl}:8000/nofood`)
      .then(response => {
        setNoFoodData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching NoFood data:', error.message);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView style={styles.itemsContainer}>
          {noFoodData.map(food => (
            <View key={food.id} style={styles.foodItem}>
              <Text key={`name-${food.id}`} style={styles.foodName}>{food.foodName}</Text>
              <Image key={`image-${food.id}`} source={{ uri: food.foodImage }} style={styles.foodImage} />
              <Text key={`detail-${food.id}`} style={styles.foodDetail}>{food.foodDetail}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#C2FFD3',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
   
  },
  foodItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    width: 350,
    backgroundColor:'white'
  },
  foodName: {
    marginBottom: 8,
    fontSize: 18,
    fontFamily: 'Kanit_400Regular',
  },
  foodImage: {
    width: '100%',
    height: 200,
    borderRadius: 4,
    marginBottom: 8,
  },
  foodDetail: {
    color: '#555',
    fontFamily: 'Kanit_400Regular',
  },

});

export default NoFoodList;
