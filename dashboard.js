import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ReviewUserInfoPage from "./pages/auth/ReviewUserInfoPage";
import AddForm from "./pages/dashboard/FormPage";
<<<<<<< HEAD
import EditFormPage from "./pages/dashboard/EditFormPage";
=======
import EditForm from "./pages/dashboard/EditFormPage";
>>>>>>> 3367a044a53f1840200b51c8264fc1da1275b816

const Stack = createNativeStackNavigator();

export default function Dashboard() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReviewUserInfo"
          component={ReviewUserInfoPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddForm"
          component={AddForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditForm"
<<<<<<< HEAD
          component={EditFormPage}
=======
          component={EditForm}
>>>>>>> 3367a044a53f1840200b51c8264fc1da1275b816
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
