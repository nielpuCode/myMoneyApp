import React, {useState, useEffect} from 'react';
import { KeyboardAvoidingView, Text, View, ScrollView, TextInput, TouchableOpacity, Touchable } from 'react-native';
import styles from './styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {firebase} from '../config';
import { useNavigation, useRoute } from '@react-navigation/native';
import {getRandomBytesAsync} from 'expo-crypto'

function Incomepage() {
    const navigation = useNavigation();
    const [incomeTotal, setincomeTotal] = useState('');
    const [newItems, setnewItems] = useState([]);
    const [itemIncome, setitemIncome] = useState([]);

    useEffect(() => {
        const fetchIncomeItems = async () => {
          try {
            const snapshot = await firebase.firestore().collection('VonzielIncome').get();
            const items = snapshot.docs.map((doc) => doc.data());
      
            // Sort the items based on the date in descending order
            items.sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return dateB - dateA;
            });
      
            setitemIncome(items);
          } catch (error) {
            console.log('Failed to fetch income items: ', error);
            alert('Failed to fetch income items.');
          }
        };
        fetchIncomeItems();
    }, []);  

    const AddIncome = async() => {
        if (!incomeTotal){
            alert('Please input the item Nominal');
            return;
        }

        try {
            const randomBytes = await getRandomBytesAsync(8);
            const id = Array.from(randomBytes).map((byte) => byte.toString(16).padStart(2, '0')).join('');

            const currentDate = new Date();
            const day = String(currentDate.getDate()).padStart(2, '0');
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const year = currentDate.getFullYear();
            const formattedDate = `${day}-${month}-${year}`;

            const newItem = {id, incomeTotal: parseInt(incomeTotal), date: formattedDate};

            setitemIncome([...itemIncome, newItem]);
            setnewItems([...newItems, newItem]);
            
            await firebase.firestore().collection('VonzielIncome').doc(id).set(newItem);
            
            setincomeTotal('');
        } catch (error) {
            console.log('gagal upload income: ', error);
            alert('Failed to save data income.');
        }
    };

    const deleteItem = async (id) => {
        try {
          await firebase.firestore().collection('VonzielIncome').doc(id).delete();
          setitemIncome(itemIncome.filter((item) => item.id !== id));
        } catch (error) {
          console.log('Failed to delete item: ', error);
          alert('Failed to delete item.');
        }
    };

    const calculateTotal = () => {
        let total = 0;
        for (const item of itemIncome) {
            total += item.incomeTotal;
        }
        return total.toLocaleString();
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View style={styles.finalIncome}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{`Rp${calculateTotal()}`}</Text>
                </View>

                <ScrollView style={styles.addExpenses}>
                    {itemIncome.map((item) => (
                        <View key={item.id} style={styles.IncomeDetail}>
                            <View style={styles.itemDetail}>
                                <Text style={{ fontWeight: 'bold', fontSize: 25 }}>{`Rp${item.incomeTotal.toLocaleString()}`}</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{item.date}</Text>
                            </View>

                            <TouchableOpacity onPress={() => deleteItem(item.id)}>
                                <Text>
                                    <FontAwesome name='trash' size={30} />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.viewInput}>
                    <TextInput placeholder='Income Nominal' style={styles.inputAddnew} onChangeText={setincomeTotal} value={incomeTotal} />

                    <View style={styles.actionAdd}>
                        <TouchableOpacity style={{ marginVertical: 5 }} onPress={() => AddIncome()}>
                            <FontAwesome name='plus-circle' size={50} color={'#6b9425'}/>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginVertical: 5 }} onPress={() => navigation.navigate('Listpage')}>
                                    <FontAwesome    W name='check-circle' size={50} color={'#6b9425'}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default Incomepage;