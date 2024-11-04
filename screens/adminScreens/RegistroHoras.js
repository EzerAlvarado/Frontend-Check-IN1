import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, TextInput, Text, View } from 'react-native';
import { useAuth } from '../../Context';
const RegistroHoras = () => {
  const { token } = useAuth();
  const [numeroEmpleado, setNumeroEmpleado] = useState('');
  const [registros, setRegistros] = useState([]);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const fetchRegistros = async () => {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/registro-horas/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setRegistros(data);
    };

    fetchRegistros();
  }, [token]);

  const buscarEmpleado = (clave) => {
    const empleadoRegistro = registros.find(reg => reg.clave_empleado === parseInt(clave));
    if (empleadoRegistro) {
      setResultado(empleadoRegistro);
    } else {
      setResultado(null);
    }
  };

  const handleChange = (text) => {
    setNumeroEmpleado(text);
    if (text) {
      buscarEmpleado(text);
    } else {
      setResultado(null);
    }
  };

 // Función para calcular el tiempo total trabajado en minutos
 const calcularMinutosTrabajados = (horaEntrada, horaSalida) => {
  const entrada = new Date(horaEntrada);
  const salida = new Date(horaSalida);
  const diferenciaEnMs = salida - entrada; // Días en milisegundos
  const diferenciaEnMinutos = Math.floor(diferenciaEnMs / 60000); // Convertir a minutos
  return diferenciaEnMinutos; // Retornar el total de minutos
};

const convertirTotalHorasAMinutos = (total_horas) => {
  const partes = total_horas.split(':'); // Suponiendo que total_horas es un string en formato HH:MM:SS
  const horas = parseInt(partes[0]);
  const minutos = parseInt(partes[1]);
  
  return (horas * 60) + minutos; // Convertir todo a minutos
};

// Función para formatear las horas totales
const formatTotalHoras = (minutos) => {
  const horas = Math.floor(minutos / 60);
  const restoMinutos = minutos % 60;

  let resultado = '';
  if (horas > 0) {
    resultado += `${horas} hora${horas !== 1 ? 's' : ''}`;
  }
  if (restoMinutos > 0) {
    resultado += ` ${restoMinutos} minuto${restoMinutos !== 1 ? 's' : ''}`;
  }
  return resultado.trim() || '0 minutos'; // Asegurarse de que al menos muestre 0 minutos si no hay tiempo
};
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titulo}>
            Buscar Registros
          </Text>
          <Text style={styles.subtitulo}>
            Horas trabajadas por los empleados
          </Text>
        </View>

        <TextInput
          style={styles.inputDesign}
          placeholder="Número de empleado"
          value={numeroEmpleado}
          onChangeText={handleChange}
          keyboardType="numeric"
        />

        {/* Encabezados fijos */}
        <View style={styles.resultadoContainer}>
          <View style={styles.resultadoFila}>
            <Text style={styles.subtitulo}>Fecha</Text>
            <Text style={styles.subtitulo}>Periodo de tiempo</Text>
            <Text style={styles.subtitulo}>Horas totales</Text>
          </View>

          {resultado && (
            <View style={styles.resultadoFila}>
              <Text style={styles.resultadoTexto}>{new Date(resultado.hora_entrada).toLocaleDateString()}</Text>
              <Text style={styles.resultadoTexto}>
                {new Date(resultado.hora_entrada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                {new Date(resultado.hora_salida).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {/* Mostrar solo HH:MM */}
              </Text>
              <Text style={styles.resultadoTexto}>{resultado.total_horas}</Text>
            </View>
          )}
          {resultado === null && numeroEmpleado && (
            <Text style={styles.mensajeError}>Empleado no encontrado.</Text>
          )}
        </View>
    
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    //paddingHorizontal: -30,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    padding: 33,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
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
    color: '#474747',
    textAlign: 'center'
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
  resultadoContainer: {
    marginTop: 20,
  },
  resultadoFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  resultadoTexto: {
    fontSize: 15,
    fontWeight: '500',
    color: '#474747',
    textAlign: 'center'
  },
  mensajeError: {
    fontSize: 15,
    fontWeight: '500',
    color: '#5f0000',
    marginTop: 10,
  },
});

export default RegistroHoras;
