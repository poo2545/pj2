import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const EditMealScreen = ({ route, navigation }) => {
  const { mealId } = route.params; // Assuming mealId is passed as a parameter from the previous screen

  const [editedData, setEditedData] = useState({
    BName: '',
    Bcalories: '',
    mealId: mealId, // Add mealId to the editedData state
  });

  const handleSaveChanges = async () => {
    try {
      const apiUrl = `http://192.168.1.169:8000/meals/${mealId}`;
      const response = await axios.put(apiUrl, editedData);
      console.log(response.data);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating meal:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Edit Meal</Text>
      <TextInput
        style={styles.input}
        placeholder="Meal Name"
        value={editedData.BName}
        onChangeText={(text) => setEditedData({ ...editedData, BName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Calories"
        value={editedData.Bcalories}
        onChangeText={(text) => setEditedData({ ...editedData, Bcalories: text })}
      />
      {/* Add other input fields for the meal properties you want to edit */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default EditMealScreen;
