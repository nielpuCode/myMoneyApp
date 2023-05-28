import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Text, View, ScrollView, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import styles from './styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { firebase } from '../config';
import { useNavigation, useRoute } from '@react-navigation/native';
import {getRandomBytesAsync} from 'expo-crypto'

function Editpage() {
    const navigation = useNavigation();
    const route = useRoute();
    const { collectionName } = route.params;
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [items, setItems] = useState([]);
    const [deleteCounter, setDeleteCounter] = useState(0);

    // this useState is for data that is new added. This is the solution for adding the same data over and over again.
    const [newItems, setnewItems] = useState([]);

    const fetchItems = async () => {
        try {
            const collectionRef = firebase.firestore().collection('myVonziel').doc(collectionName).collection('items');
            const snapshot = await collectionRef.get();
            const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setItems(items);
        } catch (error) {
            console.log(error);
            Alert.alert('Failed to fetch items', 'Please try again later.');
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleAddNewItem = async () => {
        if (!itemName || !itemPrice) {
            alert('Please input the item name and price');
            return;
        }
      
        try {
            const randomBytes = await getRandomBytesAsync(8);
            const id = Array.from(randomBytes).map((byte) => byte.toString(16).padStart(2, '0')).join('');
        
            const newItem = {id, itemName, itemPrice: parseInt(itemPrice)};
        
            setItems([...items, newItem]);
            setnewItems([...newItems, newItem]);
            setItemName('');
            setItemPrice('');
            setDeleteCounter(deleteCounter + 1);
        } catch (error) {
            console.log(error);
            alert('Failed to generate ID. Please try again.');
        }
    };       

    const handleSaveCollection = async () => {
        if (items.length === 0) {
            try {
                const collectionRef = firebase.firestore().collection('myVonziel').doc(collectionName);
                await collectionRef.delete();
                await collectionRef.collection('items').delete();
                
                Alert.alert('Empty Collection', 'The collection has been deleted successfully!', [
                    { text: 'OK', onPress: () => navigation.navigate('Listpage') }
                ]);
            } catch (error) {
                console.log(error);
                Alert.alert('Failed to delete collection', 'Please try again later.');
            }
            return;
        }else if(newItems.length === 0 && deleteCounter === 0){
            Alert.alert('No Changes', 'Will return to List Page.', [
                { text: 'OK', onPress: () => navigation.navigate('Listpage') }
            ]);
        }else{
            try {
                const collectionRef = firebase.firestore().collection('myVonziel').doc(collectionName).collection('items');
        
                for (const item of newItems) {
                    await collectionRef.add(item);
                }
        
                Alert.alert('Collection Saved', 'All items have been saved to the collection successfully!', [
                    { text: 'OK', onPress: () => navigation.navigate('Listpage') }
                ]);
                
                setItems([]);
            } catch (error) {
                console.log(error);
                Alert.alert('Failed to save items', 'Please try again later.');
            }
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            const collectionRef = firebase.firestore().collection('myVonziel').doc(collectionName).collection('items');
        
            const querySnapshot = await collectionRef.where('id', '==', itemId).get();
        
            if (!querySnapshot.empty) {
              querySnapshot.forEach((docSnapshot) => {
                autoId = docSnapshot.id;
                console.log("\n");
                console.log('Auto-ID:', autoId);
                console.log('itemId: ', itemId);
                console.log("\n");

                // Hapus dokumen dengan auto-ID
                docSnapshot.ref.delete().then(() => {
                    console.log('Dokumen berhasil dihapus.');
                    fetchItems();
                }).catch((error) => {
                    console.error('Gagal menghapus dokumen:', error);
                });
              });
              setDeleteCounter(deleteCounter + 1);
            } else {
              console.log('Dokumen tidak ditemukan.');
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Failed to delete item', 'Please Try again later.');
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <ScrollView style={styles.addExpenses}>
                    {items.map((item) => (
                        <View style={styles.ExpenseDetail} key={item.id}>
                            <View style={styles.itemDetail}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.itemName}</Text>

                                <Text style={{ fontSize: 20 }}>Rp{item.itemPrice.toLocaleString()}</Text>
                            </View>

                            <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
                                <FontAwesome name='trash' size={30} />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <View style={{ margin: 5 }}></View>
                </ScrollView>

                <View style={styles.viewInput}>
                    <TextInput placeholder='Item Name' style={styles.inputAddnew} value={itemName} onChangeText={setItemName} />

                    <TextInput placeholder='Item Price' style={styles.inputAddnew} keyboardType='number-pad' value={itemPrice} onChangeText={setItemPrice} />
                    
                    <View style={styles.actionAdd}>
                        <TouchableOpacity style={{ marginVertical: 5 }} onPress={() => navigation.navigate('Listpage')}>
                            <Text style={{ backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 10, borderRadius: 30, fontWeight: 'bold', fontSize: 20 }}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginVertical: 5 }} onPress={() => handleAddNewItem()}>
                            <FontAwesome name='plus-circle' size={50} color={'#6b9425'} />
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginVertical: 5 }} onPress={() => handleSaveCollection()}>
                            <FontAwesome name='check-circle' size={50} color={'#6b9425'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )};

export default Editpage;