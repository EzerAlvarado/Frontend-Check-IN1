import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Checador from './screens/Checador';
import RegistroHoras from './screens/adminScreens/RegistroHoras';
import AceptarSolicitudes from './screens/adminScreens/AceptarSolicitudes';
import ListEmplooyes from './screens/adminScreens/ListEmplooyes'
import RegistroUsuariosScreen from './screens/adminScreens/RegisterEmplooyes';
import EditEmployeeScreen from './screens/adminScreens/EditEmplooyes';
import Feather from '@expo/vector-icons/Feather';

const Tab = createBottomTabNavigator();

const AdminTabs = ({ userName }) => {
  return (
    <Tab.Navigator>

  <Tab.Screen name="Checador" component={Checador} 
      options={{
      tabBarLabel: 'Checador',
      tabBarIcon: ({color, size}) => (
        <Feather name="user-check" size={24} color="black" />
      ),
      headerShown: true,
  }}
      />
      <Tab.Screen 
        name="Registro de Horas" 
        component={RegistroHoras}
        options={{
          tabBarLabel: 'Registro de Horas',
          tabBarIcon: ({ color, size }) => (
            <Feather name="book-open" size={size} color={color} />
          ),
          headerShown: true,
        }} 
      />


<Tab.Screen name="Justificantes" component={AceptarSolicitudes} 
      options={{
      tabBarLabel: 'Justificantes',
      tabBarIcon: ({color, size}) => (
        <Feather name="user-check" size={24} color="black" />
      ),
      headerShown: true,
  }}
      />

<Tab.Screen name="Listado de empleados" component={ListEmplooyes} 
      options={{
      tabBarLabel: 'emplooyes',
      tabBarIcon: ({color, size}) => (
        <Feather name="user-check" size={24} color="black" />
      ),
      headerShown: true,
  }}
      />

<Tab.Screen name="Registrar Emplooyes" component={RegistroUsuariosScreen} 
      options={{
      tabBarLabel: 'Registrar Empleado',
      tabBarIcon: ({color, size}) => (
        <Feather name="user-check" size={24} color="black" />
      ),
      headerShown: true,
  }}
      />


<Tab.Screen name="Editar Emplooyes" component={EditEmployeeScreen} 
      options={{
      tabBarLabel: 'Editar Empleado',
      tabBarIcon: ({color, size}) => (
        <Feather name="user-check" size={24} color="black" />
      ),
      headerShown: true,
  }}
      />



    </Tab.Navigator>



  );
};

export default AdminTabs;
