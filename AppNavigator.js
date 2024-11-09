import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import AdminTabs from './AdminTabs';
import EmployeeTabs from './EmployeeTabs';


const Stack = createNativeStackNavigator();

function AppNavigator() {
  const [userRole, setUserRole] = useState(() => {
    return JSON.parse(localStorage.getItem("user") || JSON.stringify({})) ?? {}
  }); 

  const isAdmin = userRole === 'admin' && userRole !== 'empleado';

  useEffect(()=> {
    
    if(userRole) {
      localStorage.setItem("user",JSON.stringify(userRole))
    }
  },[userRole])
  
/*   console.log(isAdmin)
  console.log(userRole)
  console.log(userRole.toString() !== '{}') */
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
    
        <Stack.Screen name="Login">
          {(props) => (
            <LoginScreen
              {...props}
              setUserRole={setUserRole}

            />
          )}
        </Stack.Screen>

        <Stack.Screen name="AdminTabs" component={AdminTabs} />

      
        <Stack.Screen name="EmployeeTabs" component={EmployeeTabs} />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;



















