import React, {useState, useEffect} from 'react';
import { Text, View, ScrollView, TouchableOpacity, Alert, TextInput, Keyboard } from 'react-native';
import styles from './styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {firebase} from '../config';
import { ActivityIndicator } from 'react-native';

function Firstpage() {
    const navigation = useNavigation();
    const [collectionNames, setCollectionNames] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    
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
                    if (!isNaN(itemPrice)) {
                        totalExpenses += itemPrice;
                    }
                });
            });
            expensePromises.push(expensePromise);
            });
        
            await Promise.all(expensePromises);
      
        let totalIncome = 0;
        vonzielIncomeSnapshot.forEach((doc) => {
            const nominalIncome = doc.data().incomeTotal;
            if (!isNaN(nominalIncome)) {
              totalIncome += nominalIncome;
            }
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
            setIsLoading(false);
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

    const handleEditItem = (name) => {
        navigation.navigate('Editpage', { collectionName: name });
    }

    const getDayOfWeek = (date) => {
        const [day, month, year] = date.split('-');
        const formattedDate = `${year}-${month}-${day}`;
        const options = { weekday: 'long' };
        const dayOfWeek = new Date(formattedDate).toLocaleDateString('en-US', options);
        return dayOfWeek.split(',')[0];
    };

    const handleDelete = async (name) => {
        try {
            const collectionRef = firebase.firestore().collection('myVonziel');
            const docRef = collectionRef.doc(name);
            
            //  Deleting all subcollections named 'items'
            const itemsRef = docRef.collection('items');
            const batch = firebase.firestore().batch();
            const itemsSnapshot = await itemsRef.get();
            itemsSnapshot.forEach((doc) => {
            batch.delete(doc.ref);
            });
            
            //  deleting main document
            batch.delete(docRef);
            
            await batch.commit();
            
            fetchCollectionNames();
            alert('Document successfully deleted!');
            navigation.navigate('Listpage');
        } catch (error) {
            alert('Error deleting document: ', error);
        }
    };

    const tesss = (totalPrice) => {
        navigation.navigate('Incomepage', { collectionIncome: totalPrice});
    }

    return(
        <View style={{ marginBottom: 80, backgroundColor: 'white', height: '100%' }}>
            <View style={styles.newBox}>
                    
                    <View style={styles.containerTotalMoney}>
                        <TouchableOpacity style={styles.amountMoney} onPress={() => tesss(totalPrice)}>
                            <FontAwesome name="plus-circle" size={55} color="#546e27" style={{}} />
                            <Text style={{fontWeight: 'bold', marginLeft: 10, fontSize: 30, color: totalPrice < 0 ? 'red' : 'black',}}>Rp{totalPrice.toLocaleString()}</Text>
                        </TouchableOpacity>
                    </View>

                <TouchableOpacity onPress={() => navigation.navigate('Addnew')}>
                    <Text style={styles.newButton}>New</Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#ffbb00" style={{ fontWeight: 'bold', marginTop: 150 }} />
                </View>
            ) : (
                <ScrollView style={styles.listExpense}>
                    {collectionNames.map((name) => (
                        <View style={styles.container} key={name}>
                            <TouchableOpacity style={styles.ViewList} onPress={() => handlePress(name)}>
                            <Text style={styles.TitleDate}>{name}</Text>

                            <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', marginRight: 10 }}>{getDayOfWeek(name)}</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.ActionDate}>
                            <TouchableOpacity onPress={() => handleEditItem(name)}>
                                <FontAwesome name="pencil" style={styles.ActionText} />
                            </TouchableOpacity>

                            <TouchableOpacity
                            onPress={() =>
                                Alert.alert(
                                'Delete Confirmation',
                                'Are you sure want to delete this?',
                                [
                                    {text: 'Cancel', style: 'cancel'},
                                    {text: 'Delete', onPress: () => handleDelete(name)},
                                ]
                            )}>
                                <FontAwesome name="trash" style={styles.ActionText} />
                            </TouchableOpacity>
                        </View>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    )
}

export default Firstpage;