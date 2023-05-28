import React, {useState} from 'react';
import { KeyboardAvoidingView, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import styles from './styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {firebase} from '../config';
import { useNavigation } from '@react-navigation/native';
import {getRandomBytesAsync} from 'expo-crypto'

function Addnew(){
    const navigation = useNavigation();
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [items, setItems] = useState([]);

    const handleAddNewItem = async () => {
        if (!itemName || !itemPrice) {
          alert('Please input the item name and price');
          return;
        }
      
        try {
          const randomBytes = await getRandomBytesAsync(8);
          const id = Array.from(randomBytes).map((byte) => byte.toString(16).padStart(2, '0')).join('');
      
          const newItem = {
            id,
            itemName,
            itemPrice: parseInt(itemPrice)
          };
      
          setItems([...items, newItem]);
          setItemName('');
          setItemPrice('');
        } catch (error) {
          console.log(error);
          alert('Failed to generate ID. Please try again.');
        }
    };

    const handleSaveCollection = async () => {
        if (items.length === 0) {
          alert('There are no items to save. Please add items before saving.');
          return;
        }
      
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        const collectionName = 'myVonziel';
      
        try {
          const collectionRef = firebase.firestore().collection(collectionName);
      
          for (const item of items) {
            await collectionRef.doc(formattedDate).set({ thisExist: formattedDate + ' Exist!' }, { merge: true });
            await collectionRef.doc(formattedDate).collection('items').add(item);
          }
      
          alert('All items have been saved to the new collection successfully!');
          setItems([]);
          navigation.navigate('Listpage');
        } catch (error) {
          console.log(error);
          alert('Failed to save items to the new collection. Please try again later.');
        }
    };
      
    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={{flex: 1}}>
            <View style={{ flex: 1 }}>
                <ScrollView style={styles.addExpenses}>
                    {items.map(item => (
                        <View style={styles.ExpenseDetail} key={item.id}>
                            <View style={styles.itemDetail}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.itemName}</Text>
                                <Text style={{ fontSize: 20 }}>Rp{item.itemPrice.toLocaleString()}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
                                <FontAwesome name='trash' size={30}/>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <View style={{ margin: 5 }}></View>
                </ScrollView>

                <View style={styles.viewInput}>
                    <TextInput placeholder='Item Name' style={styles.inputAddnew} value={itemName} onChangeText={setItemName}/>

                    <TextInput placeholder='Item Price' style={styles.inputAddnew} keyboardType='number-pad' value={itemPrice} onChangeText={setItemPrice}/>
                    
                    <View style={styles.actionAdd}>
                        <TouchableOpacity style={{ marginVertical: 5 }} onPress={() => navigation.navigate('Listpage')}>
                            <Text style={{ backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 10, borderRadius: 30, fontWeight: 'bold', fontSize: 20 }}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginVertical: 5 }} onPress={() => handleAddNewItem()}>
                            <FontAwesome name='plus-circle' size={50} color={'#6b9425'}/>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginVertical: 5 }} onPress={() => handleSaveCollection()}>
                            <FontAwesome name='check-circle' size={50} color={'#6b9425'}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default Addnew;