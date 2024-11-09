import React, { useState, useContext } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthContext } from '../Context';
import { useAuth } from '../Context';

export default function LoginScreen({setUserRole,navigation}) {
  const [numeroEmpleado, setNumeroEmpleado] = useState('');
  const [password, setContraseña] = useState('');
  const [mensajito, setMensajito] = useState('');
  //const [inputUsername, setInputUsername] = useState('');
  const { setUserData, setUsername, token,fetchToken} = useAuth(); // obtener la función del contexto
  
  
 /*  console.log({token}); */

  const handleLogin = async () => {
    console.log({clave:numeroEmpleado,password})
    const _token = await fetchToken({clave:numeroEmpleado,password})
    const response = await fetch(`http://127.0.0.1:8000/api/v1/usuarios/?clave=${numeroEmpleado}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${_token}`, // Reemplaza con tu token válido
      },
    });
    
    

    const userData = await response.json();
    const user = userData[0]
/*     console.log(user)
    console.log(userData) */
    if(!userData.ok){
      setMensajito('Datos erroneos!!')
      console.log(setMensajito);
    }
    
    console.log("Contraseña ingresada:", password, "Tipo:", typeof password);
    console.log("Número de empleado ingresado:", numeroEmpleado, "Tipo:", typeof numeroEmpleado);
    if (password === numeroEmpleado) {
      console.log('los datos que ingreso si son iguales')

    } else {
      console.log('los datos NOOOO son iguales')
    }



    if (user?.es_admin ){
      if (user.contrasenia.toString() === password && user.clave.toString() === numeroEmpleado) {
        setUserData(user);
        setUsername(user.nombre); 
        setUserRole('admin');
        navigation.navigate("AdminTabs")
        } else {
            //alert('Error');
            console.log('Error');

        }
    }else {
      if (user.clave.toString() === numeroEmpleado  && user.contrasenia.toString() === password ) {
        setUserData(user);
        setUsername(user.nombre); 
        setUserRole('empleado');
        navigation.navigate("EmployeeTabs")
        } else {
            //alert('Error');
            console.log('Error');


        }
      //alert('No eres admin o.o');
    }



  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <KeyboardAwareScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titulo}> Login </Text>
          <Text style={styles.subtitulo}>Logeate si eres administrador o empleado!</Text>
        </View>

        <View style={styles.formulario}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Número de empleado</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="number-pad"
              placeholder="Escribe tu número de empleado"
              placeholderTextColor="#6b7280"
              style={styles.inputDesign}
              onChangeText={setNumeroEmpleado}
              value={numeroEmpleado}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <TextInput
              autoCorrect={false}
              placeholder="**********"
              placeholderTextColor="#6b7280"
              style={styles.inputDesign}
              secureTextEntry={true}
              onChangeText={setContraseña}
              value={password}
            />
          </View>

          <View style={styles.botonArea}>
            <View style={styles.input}>
                <Text style={styles.textoError}>{mensajito} </Text>
            </View>

            
            <TouchableOpacity onPress={handleLogin}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Entrar</Text>
              </View>
            </TouchableOpacity>

          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  titulo: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  textoError: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  formulario: {
    paddingTop: 40,
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  botonArea: {
    marginTop: 4,
    marginBottom: 16,
    paddingTop: 30,
    alignItems: 'center',
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputDesign: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderStyle: 'solid',
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    borderWidth: 1,
    backgroundColor: '#212121',
    borderColor: '#2b2b2b',
    width: 150,
    height: 60,
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});
