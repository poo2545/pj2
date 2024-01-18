import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Button,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Kanit_400Regular } from '@expo-google-fonts/kanit';
import DatePicker from '@react-native-community/datetimepicker';
import { apiBaseUrl } from '../ApiConfig';
import DropDownPicker from 'react-native-dropdown-picker';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [diabetesType, setDiabetesType] = useState('');
  const [image, setImage] = useState(null);

  const challengeCalorie = 2000 ;
  const navigation = useNavigation();
  const defaultProfileImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png';

  const [open, setOpen] = useState(false);
  const [heightOpen, setHeightOpen] = useState(false);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());


  const handleRegister = () => {
    const user = {
      fullName: name,
      email: email,
      password: password,
      image: defaultProfileImage,
      dateOfBirth: dateOfBirth.toISOString(),
      weight: weight,
      height: height,
      diabetesType: diabetesType,
      challengeCalorie : challengeCalorie,
    };
    axios
      .post(`http://${apiBaseUrl}:8000/register`, user)
      .then((response) => {
        console.log(response);
        Alert.alert('คุณได้ลงทะเบียนสำเร็จแล้ว');
        setName('');
        setEmail('');
        setPassword('');
        setDateOfBirth(new Date());
        setWeight('');
        setHeight('');
        setDiabetesType('');
        setImage(null);
        navigation.replace('Login');
      })
      .catch((error) => {
        Alert.alert('Registration Error', 'An error occurred while registering');
        console.log('registration failed', error);
      });
  };

  const [fontsLoaded] = useFonts({
    Kanit_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }
  const handleWeightInput = () => {
    // ตรวจสอบว่าน้ำหนักไม่เป็นค่าว่าง
    if (!weight.trim()) {
      Alert.alert('กรุณากรอกน้ำหนัก');
      return;
    }
    setOpen(false); // ปิด Popup
  };
  const handleHeightInput = () => {
    // ตรวจสอบว่าส่วนสูงไม่เป็นค่าว่าง
    if (!height.trim()) {
      Alert.alert('กรุณากรอกส่วนสูง');
      return;
    }
    setHeightOpen(false); // ปิด Popup
  };

  const handleDateSelect = (event, selected) => {
    if (event.type === 'set' && selected) {
      setSelectedDate(selected);
      setDateOfBirth(selected); // อัปเดต dateOfBirth ด้วยค่าที่เลือก
    }
    setDatePickerVisible(false);
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#FFFFFF', '#C2FFD3', '#FFFFFF']} style={styles.gradient}>
        <View style={styles.inputContainer}>
          <Image style={styles.logo} source={require('../assets/logo3.png')} />
          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            style={styles.input}
            placeholder="กรอกชื่อของคุณ"
            placeholderTextColor="#000"
          />
          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            placeholder="กรอกอีเมลของคุณ"
            placeholderTextColor="#000"
          />
          <TextInput
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={false}
            style={styles.input}
            placeholder="ตั้งรหัสของคุณ"
            placeholderTextColor="#000"
          />
          <TouchableOpacity
            style={styles.weightInput}
            onPress={() => setDatePickerVisible(true)}
          >
            <Text style={{ fontSize: 16, color: '#000', fontFamily: 'Kanit_400Regular', }}>
              {dateOfBirth
                ? `วันเกิด: ${selectedDate.toLocaleDateString()}`
                : 'กรอกวันเกิดของคุณ'}
            </Text>
          </TouchableOpacity>
          {isDatePickerVisible && (
            <DatePicker
              value={selectedDate}
              mode="date"
               locale="th-TH"
              display="default"
              onChange={handleDateSelect}
            />
          )}
          <TouchableOpacity
            style={styles.weightInput}
            onPress={() => setOpen(true)}
          >
            <Text style={{ fontSize: 16, color: '#000', fontFamily: 'Kanit_400Regular', }}>
              {weight.trim() === '' ? 'กรอกน้ำหนักของคุณ' : `น้ำหนัก: ${weight} กิโลกรัม`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.weightInput}
            onPress={() => setHeightOpen(true)}
          >
            <Text style={{ fontSize: 16, color: '#000', fontFamily: 'Kanit_400Regular', }}>
              {weight.trim() === '' ? 'กรอกส่วนสูงของคุณ' : `ส่วนสูง: ${height} เซนติเมตร`}
            </Text>
          </TouchableOpacity>

          <TextInput
            value={diabetesType}
            onChangeText={(text) => setDiabetesType(text)}
            style={styles.input}
            placeholder="ประเภทเบาหวาน"
            placeholderTextColor="#000"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>ลงทะเบียน</Text>
        </TouchableOpacity>
      </LinearGradient>

      <Modal
        transparent={true}
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeModalButton} onPress={() => setOpen(false)}>
            <Text style={styles.buttonText}>X</Text>
          </TouchableOpacity>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>กรอกน้ำหนัก (KG)</Text>
            <TextInput
              value={weight}
              onChangeText={(text) => setWeight(text)}
              style={styles.modalInput}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleWeightInput}>
              <Text style={styles.modalButtonText}>ยืนยัน</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={heightOpen}
        onRequestClose={() => setHeightOpen(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeModalButton} onPress={() => setHeightOpen(false)}>
            <Text style={styles.buttonText}>X</Text>
          </TouchableOpacity>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>กรอกส่วนสูงของคุณ (cm)</Text>
            <TextInput
              value={height}
              onChangeText={(text) => setHeight(text)}
              style={styles.modalInput}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleHeightInput}>
              <Text style={styles.modalButtonText}>ยืนยัน</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#52B788',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Kanit_400Regular',
  },
  logo: {
    width: 250,
    height: 80,
    marginTop: 35,
  },
  inputContainer: {
    alignItems: 'center',
    width: '90%',
  },
  input: {
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
  },
  profileImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginVertical: 10,
  },
  weightInput: {
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Kanit_400Regular',
    marginBottom: 10,
  },
  modalInput: {
    height: 50,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
  },
  modalButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#52B788',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
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
  datePickerButton: {
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    fontSize: 16,
    fontFamily: 'Kanit_400Regular',
  },
  datePickerButtonText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
});

export default RegisterScreen;
