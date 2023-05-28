import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import styles from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { firebase } from '../config';

function Detaillist() {
    const navigation = useNavigation();
    const route = useRoute();
    const { collectionName } = route.params;
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
        try {
            const collectionRef = firebase.firestore().collection('myVonziel').doc(collectionName).collection('items');
            const snapshot = await collectionRef.get();
            const fetchedItems = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            }));
            setItems(fetchedItems);
        } catch (error) {
            console.log(error);
        }
        };

        fetchItems();
    }, [collectionName]);

    const [viewitem, setviewitem] = useState([]);

    const collectionRef = firebase.firestore().collection('myVonziel').doc(collectionName).collection('items');
    useEffect(() => {
        collectionRef.onSnapshot((querySnapshot) => {
            const items = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setviewitem(items);
        });
    }, []);

    const calculateTotal = () => {
        let total = 0;
        viewitem.forEach(item => {
        total += item.itemPrice;
        });
        return formatToRupiah(total);
    };
    
    const formatToRupiah = (number) => {
        const formattedNumber = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
        const lastIndex = formattedNumber.length - 1;
        
        if (formattedNumber[lastIndex] === '0' && formattedNumber[lastIndex - 1] === '0') {
          return formattedNumber.substring(0, lastIndex - 2);
        }
        
        return formattedNumber;
    };
      
  
    return (
        <View>
            <View style={styles.finalMoney}>
                <Text>Total</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 30 }}>{calculateTotal()}</Text>
            </View>

            <ScrollView style={styles.scrolllist}>
                {viewitem.map((item) => (
                    <View key={item.id} style={styles.detailView}>
                        <View>
                            <Text style={{ fontSize: 15, textAlign: 'center' }}>{item.itemName}</Text>
                            <Text style={{ textAlign: 'center', marginTop: 5, fontSize: 15 }}>{formatToRupiah(item.itemPrice)}</Text>
                        </View>
                    </View>
                ))}
                <View style={{ marginBottom: 110 }}></View>
            </ScrollView>
        </View>
    );
}

export default Detaillist;