import React, {useState, useEffect} from 'react';
import { Text, View, ScrollView, TouchableOpacity, Alert, TextInput, Keyboard } from 'react-native';
import styles from './styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {firebase} from '../config';

function Peoplelist() {
    const navigation = useNavigation();
    const [collectionNames, setCollectionNames] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    
    const [showInput, setShowInput] = useState(false);
    
    const calculateTotalPrice = async () => {
        try {
            const myVonzielRef = firebase.firestore().collection('myVonziel');
            const vonzielIncomeRef = firebase.firestore().collection('VonzielIncome');
    
            const myVonzielSnapshot = await myVonzielRef.get();
            const vonzielIncomeSnapshot = await vonzielIncomeRef.get();
    
            let totalExpenses = 0;
            const expensePromises = [];
    
            myVonzielSnapshot.forEach((doc) => {
                const itemsRef = doc.ref.collection('items');
                const expensePromise = itemsRef.get().then((itemSnapshot) => {
                    itemSnapshot.forEach((itemDoc) => {
                        const itemData = itemDoc.data();
                        let itemPrice = itemData.itemPrice;
                        totalExpenses += itemPrice;
                    });
                });
                expensePromises.push(expensePromise);
            });
    
            await Promise.all(expensePromises);
    
            let totalIncome = 0;
            vonzielIncomeSnapshot.forEach((doc) => {
                const nominalIncome = doc.data()['Nominal Income'];
                totalIncome += nominalIncome;
            });
            let finalMoney = totalIncome - totalExpenses;
    
            setTotalPrice(finalMoney);
        } catch (error) {
            console.log(error);
        }
    };
    
    const fetchCollectionNames = async () => {
        try {
            const collectionRef = firebase.firestore().collection('myVonziel');
            const snapshot = await collectionRef.get();
            const names = snapshot.docs.map((doc) => doc.id);
            setCollectionNames(names);
        } catch (error) {
            console.log(error);
            navigation.navigate('Detaillist');
        }
    };

    useEffect(() => {
        fetchCollectionNames();
        calculateTotalPrice();
    }, []);

    // This useFocusEffect() is for reloading or refresh this page so that after editing or adding new something will change!
    useFocusEffect(
        React.useCallback(() => {
            fetchCollectionNames();
            calculateTotalPrice();
        }, [])
    );

    const handlePress = (name) => {
        navigation.navigate('Detaillist', { collectionName: name });
    };

    const getDayOfWeek = (date) => {
        const [day, month, year] = date.split('-');
        const formattedDate = `${year}-${month}-${day}`;
        const options = { weekday: 'long' };
        const dayOfWeek = new Date(formattedDate).toLocaleDateString('en-US', options);
        return dayOfWeek.split(',')[0];
    };  

    return(
        <View style={{ marginBottom: 80, backgroundColor: 'white', height: '100%' }}>
            <View style={styles.newBox}>
                <View style={styles.containerTotalMoney}>
                    <TouchableOpacity style={styles.amountMoney}>
                        <Text style={{fontWeight: 'bold', marginLeft: 10, fontSize: 30, color: totalPrice < 0 ? 'red' : 'black',}}>{totalPrice.toLocaleString('id', {style: 'currency', currency: 'IDR',})}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.listExpense}>
                {collectionNames.map((name) => (
                    <View style={styles.Peoplecontainer} key={name}>
                        <TouchableOpacity style={styles.ViewList} onPress={() => handlePress(name)}>
                            <Text style={styles.TitleDate}>{name}</Text>

                            <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', marginRight: 10 }}>{getDayOfWeek(name)}</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                ))}

                <View style={{ margin: 10 }}></View>
            </ScrollView>
        </View>
    )
}

export default Peoplelist;