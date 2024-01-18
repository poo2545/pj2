import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button,FlatList , Image } from 'react-native';
import axios from 'axios';
import { apiBaseUrl } from '../ApiConfig';

const FoodForm = () => {
  const [FoodName, setFoodName] = useState('');
  const [FoodCalorie, setFoodCalorie] = useState('');
  const [FoodProtein, setFoodProtein] = useState('');
  const [FoodFat, setFoodFat] = useState('');
  const [FoodCarbo, setFoodCarbo] = useState('');
  const [FoodFiber, setFoodFiber] = useState('');
  const [FoodImage, setFoodImage] = useState('');
  const handleSave = async () => {
    try {
      const response = await axios.post(`http://${apiBaseUrl}:8000/food`, {
        FoodName,
        FoodCalorie,
        FoodProtein,
        FoodFat,
        FoodCarbo,
        FoodFiber,
        FoodImage,
      });

      if (response.status === 201) {
        // Handle success, maybe reset the form or show a success message
        console.log('Food saved successfully!');
      } else {
        // Handle error
        console.error('Error saving food:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving food:', error.message);
    }
  };

  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get(`http://${apiBaseUrl}:8000/food`);
        setFoods(response.data);
      } catch (error) {
        console.error('Error fetching foods:', error.message);
      }
    };

    fetchFoods();
  }, []);


  return (
    <View>
      <Text>Food Form</Text>
      <TextInput
        placeholder="Food Name"
        value={FoodName}
        onChangeText={(text) => setFoodName(text)}
      />
      <TextInput
        placeholder="Food Calorie"
        value={FoodCalorie}
        onChangeText={(text) => setFoodCalorie(text)}
      />
      <TextInput
        placeholder="Food FoodProtein"
        value={FoodProtein}
        onChangeText={(text) => setFoodProtein(text)}
      />
      <TextInput
        placeholder="Food FoodFat"
        value={FoodFat}
        onChangeText={(text) => setFoodFat(text)}
      />
      <TextInput
        placeholder="Food FoodCarbo"
        value={FoodCarbo}
        onChangeText={(text) => setFoodCarbo(text)}
      />      
      
      <TextInput
      placeholder="Food FoodFiber"
      value={FoodFiber}
      onChangeText={(text) => setFoodFiber(text)}
    />

<TextInput
      placeholder="Food FoodImage"
      value={FoodImage}
      onChangeText={(text) => setFoodImage(text)}
    />

      <Button title="Save Food" onPress={handleSave} />


<View>
<Text>Food List</Text>
{foods.length === 0 ? (
  <Text>No foods available.</Text>
) : (
  <FlatList
    data={foods}
    keyExtractor={(item) => item._id} // Adjust this based on your data structure
    renderItem={({ item }) => (
      <View>
        <Text>{item.FoodName}</Text>
        <Text>{item.FoodCalorie} Calories</Text>
        <Image source={{ uri: item.FoodImage }} style={{ width: 50, height: 50 }} />
      </View>
    )}
  />
)}
</View>
    </View>
  );
};

export default FoodForm;
