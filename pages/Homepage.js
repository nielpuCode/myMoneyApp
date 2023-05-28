import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import logoIMG from '../src/mainlogo.png';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Home(props) {
  const [theCode, settheCode] = useState('');

  const handlePress = () => {
    if (theCode.toLowerCase() === 'danieledit' || theCode.toLowerCase() === 'kkk' || theCode.toLowerCase() === 'edit') {
      props.navigation.navigate('Listpage');
    } else if (theCode === '1') {
      props.navigation.navigate('Peoplelist');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedCode = await AsyncStorage.getItem('savedCode');
        if (savedCode) {
          settheCode(savedCode);
        }
      } catch (error) {
        console.log('Error loading code:', error);
      }
    };    
  
    loadData();
  }, []);  

  const saveCode = async (code) => {
    try {
      await AsyncStorage.setItem('savedCode', code);
    } catch (error) {
      console.log('Error saving code:', error);
    }
  };  

  const handleChangeCode = (text) => {
    settheCode(text);
    saveCode(text);
  };

  return (
    <View style={styles.container}>
      <StatusBar />

      <Image source={logoIMG} style={{ width: 200, height: 200 }} />

      <TextInput
        placeholder="Code Here"
        style={{
          borderWidth: 5,
          borderColor: '#b4cd89',
          borderRadius: 30,
          padding: 5,
          paddingHorizontal: 10,
          width: 300,
          textAlign: 'center',
        }}
        value={theCode}
        onChangeText={handleChangeCode}
        autoCompleteType="username"
      />

      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Go</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#b4cd89',
    borderRadius: 30,
    padding: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Home;
