import * as React from  'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ReviewUserInfoPage from './pages/auth/ReviewUserInfoPage';

const Stack = createNativeStackNavigator();

export default function Dashboard() {
    return(
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginPage} options={{headerShown: false}}/>
                <Stack.Screen name="Register" component={RegisterPage} options={{headerShown: false}}/>
                <Stack.Screen name="Dashboard" component={DashboardPage} options={{headerShown: false}}/>
                <Stack.Screen name="ReviewUserInfo" component={ReviewUserInfoPage} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}