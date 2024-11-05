import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Picker } from 'react-native';
import axios from 'axios';
import { useAuth } from '../../Context'; // Asegúrate de importar tu contexto de autenticación

const RegistroUsuariosScreen = () => {
  const [nombre, setNombre] = useState('');
  const [clave, setClave] = useState('');
  const [esAdmin, setEsAdmin] = useState(false);
  const [contrasenia, setContrasenia] = useState('');
  const { token } = useAuth(); // Obtén el token de autenticación desde tu contexto

  const handleAddEmployee = async () => {
    const newEmployee = {
      nombre,
      clave: parseInt(clave, 10), // Convierte la clave a número
      es_admin: esAdmin,
      contrasenia,
      password: contrasenia, // Suponiendo que "password" es igual a "contrasenia"
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/usuarios/', newEmployee, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Empleado agregado correctamente:', response.data);
      
      // Opcional: Reinicia los campos después de agregar
      setNombre('');
      setClave('');
      setEsAdmin(false);
      setContrasenia('');
    } catch (error) {
      console.error('Error al agregar empleado:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Empleado</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contrasenia}
        onChangeText={setContrasenia}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="No. Empleado"
        value={clave}
        onChangeText={setClave}
        keyboardType="numeric"
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Rol</Text>
        <Picker
          selectedValue={esAdmin}
          onValueChange={(itemValue) => setEsAdmin(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Empleado" value={false} />
          <Picker.Item label="Admin" value={true} />
        </Picker>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAddEmployee}>
        <Text style={styles.buttonText}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F5',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  pickerLabel: {
    marginLeft: 10,
    marginTop: 5,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegistroUsuariosScreen;