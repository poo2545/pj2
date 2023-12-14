import React, { useState, useEffect, useContext , useLayoutEffect } from 'react';
import {View,Text,TextInput,StyleSheet,TouchableOpacity,FlatList,Modal,Alert,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';
import { Ionicons } from "@expo/vector-icons";
import { apiBaseUrl } from '../ApiConfig';

const DragScreen = () => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ fontSize: 20, fontFamily: 'Kanit_400Regular', justifyContent: 'center' }}>บันทึกแจ้งเตือนการทานยา</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 , padding:10}}>
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Ionicons name="refresh" size={20} color="white" />
      </TouchableOpacity>
        </View>
      ),
      headerStyle: {
        backgroundColor: '#FFFFFF',
      },
    });
  }, []);

  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [size, setSize] = useState('');
  const [medicationRecords, setMedicationRecords] = useState([]);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editedTime, setEditedTime] = useState('');
  const [editedDosage, setEditedDosage] = useState('');
  const [editedMedicationName, setEditedMedicationName] = useState('');
  const [editedSize, setEditedSize] = useState('');
  const [selectedMedicationId, setSelectedMedicationId] = useState(null);
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);

  const toggleEditModal = () => {
    setEditModalVisible(!isEditModalVisible);
  };

  const recordMedication = async () => {
    if (medicationName.trim() === '' || dosage.trim() === '' || time.trim() === '' || size.trim() === '') {
      alert('Please fill in all fields.');
      return;
    }
    try {
      const response = await axios.post(`http://${apiBaseUrl}:8000/medications`, {
        userId,
        time,
        dosage,
        medicationName,
        size,
      });
      console.log('Created:', response.data);
      setMedicationName('');
      setDosage('');
      setTime('');
      setSize('');
      alert('บันทึกสำเร็จ');
      fetchMedication(userId);
    } catch (error) {
      console.error('Error creating:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status code:', error.response?.status);
      alert('An error occurred while recording medication. Please try again later.');
    }
  };

  const fetchMedication = async (userId) => {
    try {
      const response = await axios.get(`http://${apiBaseUrl}:8000/medications/${userId}`);
      setMedicationRecords(response.data);
      console.log('Fetched medication records:', response.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchMedication(userId);
  }, []);

  const editMedication = async () => {
    if (editedMedicationName.trim() === '' || editedDosage.trim() === '' || editedTime.trim() === '' || editedSize.trim() === '') {
      alert('Please fill in all fields.');
      return;
    }
    try {
      const response = await axios.put(`http://${apiBaseUrl}:8000/medications/${selectedMedicationId}`, {
        time: editedTime,
        dosage: editedDosage,
        medicationName: editedMedicationName,
        size: editedSize,
      });
      console.log('Updated medication:', response.data);
      toggleEditModal();
      setEditedTime('');
      setEditedDosage('');
      setEditedMedicationName('');
      setEditedSize('');
      fetchMedication(userId); // โหลดข้อมูลใหม่หลังจากการแก้ไข
      alert('บันทึกการแก้ไขสำเร็จ');
    } catch (error) {
      console.error('Error updating medication:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status code:', error.response?.status);
      alert('An error occurred while updating medication. Please try again later.');
    }
  };

  const openEditModal = (medicationId, medication) => {
    setSelectedMedicationId(medicationId);
    setEditedTime(medication.time);
    setEditedDosage(medication.dosage);
    setEditedMedicationName(medication.medicationName);
    setEditedSize(medication.size);
    toggleEditModal();
  };

  const deleteMedication = async (medicationId) => {
    try {
      const response = await axios.delete(`http://${apiBaseUrl}:8000/medications/${medicationId}`);
      console.log('Deleted medication:', response.data);
      // Update the medicationRecords state to remove the deleted item
      setMedicationRecords((prevRecords) =>
        prevRecords.filter((record) => record._id !== medicationId)
      );
    } catch (error) {
      console.error('Error deleting medication:', error);
      alert('An error occurred while deleting medication. Please try again later.');
    }
  };
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchMedication(userId);
    setIsRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="เวลา (เช่น 06:00 น.)"
        value={time}
        onChangeText={setTime}
      />

      <TextInput
        style={styles.input}
        placeholder="ช่วงเวลา (ก่อนอาหาร/หลังอาหาร)"
        value={dosage}
        onChangeText={setDosage}
      />

      <TextInput
        style={styles.input}
        placeholder="ชื่อยา"
        value={medicationName}
        onChangeText={setMedicationName}
      />

      <TextInput
        style={styles.input}
        placeholder="ขนาด (เช่น 1 เม็ด)"
        value={size}
        onChangeText={setSize}
      />

      <TouchableOpacity style={styles.recordButton} onPress={recordMedication}>
        <Text style={styles.buttonText}>บันทึก</Text>
      </TouchableOpacity>

      <View style={styles.medicationInfo}>
        <FlatList
          data={medicationRecords}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.medicationContainer}>
              <View style={styles.infoContainer1}>
                <Text style={styles.title1}>{item.time}</Text>
                <Text style={styles.title1}>{item.medicationName} {item.size}</Text>
                <Text style={styles.subtitle}>{item.dosage}</Text>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => openEditModal(item._id, item)}
              >
                <Text style={styles.editButtonText}>แก้ไข</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteMedication(item._id)}>
               <Ionicons name="trash" size={23} color="#52B788" />
              </TouchableOpacity>

            </View>
          )}
        />
      </View>

      <Modal animationType="slide" transparent={true} visible={isEditModalVisible}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeModalButton} onPress={toggleEditModal}>
            <Text style={styles.buttonText}>X</Text>
          </TouchableOpacity>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="เวลา (เช่น 06:00 น.)"
              value={editedTime}
              onChangeText={setEditedTime}
            />

            <TextInput
              style={styles.input}
              placeholder="ช่วงเวลา (ก่อนอาหาร/หลังอาหาร)"
              value={editedDosage}
              onChangeText={setEditedDosage}
            />

            <TextInput
              style={styles.input}
              placeholder="ชื่อยา"
              value={editedMedicationName}
              onChangeText={setEditedMedicationName}
            />

            <TextInput
              style={styles.input}
              placeholder="ขนาด (เช่น 1 เม็ด)"
              value={editedSize}
              onChangeText={setEditedSize}
            />
            <TouchableOpacity style={styles.recordButton} onPress={editMedication}>
              <Text style={styles.buttonText}>บันทึกการแก้ไข</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#C2FFD3',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontFamily: 'Kanit_400Regular',
  },
  recordButton: {
    backgroundColor: '#52B788',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
    textAlign: 'center', // จัดตำแหน่งข้อความให้อยู่ตรงกลาง
  },
  medicationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  medicationInfo: {
    flex: 1,
    width: '90%',
    marginTop: 20,
  },
  infoContainer1: {
    flex: 1,
  },
  title1: {
    fontSize: 18,
    fontFamily: 'Kanit_400Regular',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Kanit_400Regular',
  },
  editButton: {
    backgroundColor: '#52B788',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
    justifyContent: 'center',
    fontFamily: 'Kanit_400Regular',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 10,
    elevation: 15,
  },
  closeModalButton: {
    backgroundColor: '#CC0000',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 50,
    marginTop: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
  deleteItem: {
    backgroundColor: '#FF8888',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    justifyContent: 'center'
  },
});

export default DragScreen;
