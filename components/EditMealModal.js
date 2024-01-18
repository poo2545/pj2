import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './styles'; // นำเข้า style จากไฟล์ styles.js

const EditMealModal = ({ isVisible, onCancel, onSave, mealData }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeModalButton} onPress={onCancel}>
          <Text style={styles.buttonText}>X</Text>
        </TouchableOpacity>

        <View style={styles.modalContent}>
          <Text style={styles.Text}>อาหาร</Text>
          {/* ใส่ TextInput และอื่น ๆ ตามที่คุณต้องการ */}
          <TouchableOpacity style={styles.recordButton} onPress={onSave}>
            <Text style={styles.buttonText}>บันทึกการแก้ไข</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EditMealModal;
