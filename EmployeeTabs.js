import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SolicitarJustificante from "./screens/emplooyeeScreens/SolicitarJustificante";
import Checador from "./screens/Checador";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import VerJustificantes from "./screens/emplooyeeScreens/VerJustificante";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const Tab = createBottomTabNavigator();

function EmployeeTabs({ onLogout }) {
  const navigation = useNavigation();

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Checador"
        component={Checador}
        options={{
          tabBarLabel: "Checador",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-clock" size={24} color="black" />
          ),
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity onPress={() => {
              handleLogout();
              navigation.navigate("Login");
            }}>
              <Image
                source={require('./assets/logout.png')} // Ruta de tu imagen
                style={{ width: 24, height: 24, marginRight: 15 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Tab.Screen
        name="Justificar"
        component={SolicitarJustificante}
        options={{
          tabBarLabel: "Pedir Justificante",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="emoticon-sick-outline"
              size={24}
              color="black"
            />
          ),
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity onPress={() => {
              handleLogout();
              navigation.navigate("Login");
            }}>
              <Image
                source={require('./assets/logout.png')} // Ruta de tu imagen
                style={{ width: 24, height: 24, marginRight: 15 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Tab.Screen
        name="Mis Justificantes"
        component={VerJustificantes}
        options={{
          tabBarLabel: "Mis Justificantes",
          tabBarIcon: ({ color, size }) => (
            <Feather name="book-open" size={size} color={color} />
          ),
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity onPress={() => {
              handleLogout();
              navigation.navigate("Login");
            }}>
              <Image
                source={require('./assets/logout.png')} // Ruta de tu imagen
                style={{ width: 24, height: 24, marginRight: 15 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default EmployeeTabs;
