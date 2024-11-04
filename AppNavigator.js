import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import AdminTabs from './AdminTabs';
import EmployeeTabs from './EmployeeTabs';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const [userRole, setUserRole] = useState(null); // Estado para almacenar el rol de usuario

  

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!userRole ? (
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen
                {...props}
                setUserRole={setUserRole}

              />
            )}
          </Stack.Screen>
        ) : userRole === 'admin' ? (
          <Stack.Screen name="AdminTabs" component={AdminTabs} />
        ) : (
          <Stack.Screen name="EmployeeTabs" component={EmployeeTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;



















