import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    Image, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { useFonts, Kanit_400Regular } from '@expo-google-fonts/kanit';

const WelcomeScreen = () => {
    const navigation = useNavigation();

    //use font
    let [fontsLoaded] = useFonts({
        Kanit_400Regular,
    });
    if (!fontsLoaded) {
        return null;
    }

    return (

        <SafeAreaView style={styles.container}>

        <LinearGradient
                colors={['#FFFFFF', '#C2FFD3', '#FFFFFF']} // Define your gradient colors here
                style={styles.gradient}>
            <Image style={styles.logo} source={require('../assets/logo3.png')} />

            <Image style={styles.bg} source={require('../assets/3.png')} />

            <Text style={styles._DiabetesControl}>
                ยินดีต้อนรับสู่ Diabetes Control!
            </Text>

            <Text style={styles._Intro}>
                แอปที่ช่วยบริการจัดการรายการอาหารสำหรับผู้ป่วยโรคเบาหวาน
            </Text>
            <Text style={styles._Intro}>
                ช่วยให้คำแนะนำเมนูที่เหมาะสมและอาหารที่ควรงด
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>เริ่มต้นใช้งาน</Text>
            </TouchableOpacity>
            </LinearGradient>
        </SafeAreaView>
);
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
},
_DiabetesControl: {
    color: '#333',
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily:'Kanit_400Regular',
},
_Intro: {
    color: '#666',
    fontSize: 15,
    marginBottom: 5,
    textAlign: 'center',
    fontFamily:'Kanit_400Regular',
},
button: {
    width: '90%',
    height: 50,
    backgroundColor: '#52B788',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
},
buttonText: {
    color: '#ffff',
    fontSize: 18,
    fontFamily:'Kanit_400Regular',
},
logo: {
    width: 300,
    height: 100,
    marginBottom: '10%',
    marginTop:20,
},
bg: {
    width: 320,
    height: 300,
    marginBottom: 120,
},
});


export default WelcomeScreen