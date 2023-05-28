import React from 'react';
import { Text, View, StatusBar, ScrollView, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './pages/Homepage';
import Listpage from './pages/Listpage';
import Addnew from './pages/Addnew';
import Detaillist from './pages/Detaillist';
import Editpage from './pages/Editpage';
import Peoplelist from './pages/Peoplelist';
import Incomepage from './pages/Incomepage';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Listpage" component={Listpage} />
        <Stack.Screen name="Addnew" component={Addnew} />
        <Stack.Screen name="Detaillist" component={Detaillist} />
        <Stack.Screen name="Editpage" component={Editpage} />
        <Stack.Screen name="Peoplelist" component={Peoplelist} />
        <Stack.Screen name="Incomepage" component={Incomepage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;