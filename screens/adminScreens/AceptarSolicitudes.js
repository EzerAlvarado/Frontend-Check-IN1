import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useAuth } from '../../Context';
import { SafeAreaView } from 'react-native-safe-area-context';

const AceptarSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [searchClave, setSearchClave] = useState('');
  const [claveInvalida, setClaveInvalida] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/solicitudes/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setSolicitudes(data);
        setFilteredSolicitudes(data); // Inicialmente mostramos todas
      } catch (error) {
        console.error('Error al obtener solicitudes:', error);
      }
    };

    fetchSolicitudes();
  }, [token]);

  const handleSearch = (text) => {
    setSearchClave(text);
    if (text === '') {
      setFilteredSolicitudes(solicitudes); // Mostrar todas si el campo está vacío
      setClaveInvalida(false);
    } else {
      const resultados = solicitudes.filter(solicitud =>
        solicitud.clave_empleado.toString().includes(text)
      );
      setFilteredSolicitudes(resultados);
      setClaveInvalida(resultados.length === 0); // Mostrar mensaje si no hay coincidencias
    }
  };

  const updateEstadoSolicitud = async (id, estado) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/solicitudes/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ estado_solicitud: estado })
      });
      if (response.ok) {
        setSolicitudes(prevSolicitudes =>
          prevSolicitudes.map(solicitud =>
            solicitud.id === id ? { ...solicitud, estado_solicitud: estado } : solicitud
          )
        );
        handleSearch(searchClave); // Refrescar la lista filtrada
      } else {
        console.error('Error al actualizar la solicitud');
      }
    } catch (error) {
      console.error('Error en la solicitud PUT:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tituloMain}>Solicitudes de Justificante</Text>
        <Text style={styles.subtitulo}>Nota: Haz doble click para Aceptar o Rechazar!!!</Text>
        <TextInput
          style={styles.input}
          placeholder="Buscar por número de empleado"
          value={searchClave}
          onChangeText={handleSearch}
        />
        {claveInvalida && <Text style={styles.claveInvalida}>Clave de empleado inválida</Text>}
      </View>
      
      <FlatList
        data={filteredSolicitudes}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <SolicitudCard solicitud={item} onUpdateEstado={updateEstadoSolicitud} />
        )}
      />
    </SafeAreaView>
  );
};

const SolicitudCard = ({ solicitud, onUpdateEstado }) => {
  const handleAceptar = () => onUpdateEstado(solicitud.id, 'A');
  const handleRechazar = () => onUpdateEstado(solicitud.id, 'R');

  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>Número de empleado: {solicitud.clave_empleado}</Text>
      <Text style={styles.subtitulo}>Fecha: {solicitud.dia_justificar}</Text>
      <Text style={styles.subtitulo}>Motivo: {solicitud.motivo}</Text>
      <Text style={styles.subtitulo}>
        Estado: {solicitud.estado_solicitud === 'A' ? 'Aceptada' : solicitud.estado_solicitud === 'R' ? 'Rechazada' : 'Pendiente'}
      </Text>
      <View style={styles.botones}>
        <TouchableOpacity onPress={handleAceptar} style={styles.botonAceptar}>
          <Text style={styles.botonTexto}>Aceptar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRechazar} style={styles.botonRechazar}>
          <Text style={styles.botonTexto}>Rechazar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  container: {
    flex: 1,
    backgroundColor: '#e8ecf4',
  },
  input: {
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
    width: '90%'
  },
  claveInvalida: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: '500',
    color: '#474747',
    textAlign: 'center'
  },
  subtitulo: {
    fontSize: 3,
    fontWeight: '100',
    color: '#474747',
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  tituloMain: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '500',
    color: '#474747',
    marginBottom: 6,
  },
  botones: {
    marginTop: 4,
    marginBottom: 16,
    paddingTop: 30,
    alignItems: 'center',
    flexDirection: 'row', 
    justifyContent: 'space-around',
  },
  botonAceptar: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width:90,
    height: 50,
  },
  botonRechazar: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    width:90,
    height: 50,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    alignItems:'center',
    textAlign: 'center'
  },
});

export default AceptarSolicitudes;
