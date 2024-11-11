import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from "./screens/LoginScreen";
import AdminTabs from "./AdminTabs";
import EmployeeTabs from "./EmployeeTabs";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const [userRole, setUserRole] = useState({});

  useEffect(() => {
    const loadUserRole = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUserRole(JSON.parse(storedUser));
      }
    };
    loadUserRole();
  }, []);

  useEffect(() => {
    const saveUserRole = async () => {
      if (userRole) {
        await AsyncStorage.setItem("user", JSON.stringify(userRole));
      }
    };
    saveUserRole();
  }, [userRole]);

  const isAdmin = userRole === "admin" && userRole !== "empleado";

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} setUserRole={setUserRole} />}
        </Stack.Screen>

        <Stack.Screen name="AdminTabs" component={AdminTabs} />

        <Stack.Screen name="EmployeeTabs" component={EmployeeTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
