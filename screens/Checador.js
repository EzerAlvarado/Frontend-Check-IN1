import React, { useState , useEffect , useContext} from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, TextInput, } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AuthContext } from '../Context';
import { useAuth } from '../Context';

function Checador() {
  const { userData, token } = useAuth();
  const [mensajeLlegada, setMensajeLlegada]= useState('');
  const [mensaje, setMensaje] = useState('');
  const [entradaRegistrada, setEntradaRegistrada] = useState(false);
  const [salidaRegistrada, setSalidaRegistrada] = useState(false); 
  const [registroId, setRegistroId] = useState(null); // Para almacenar el ID del registro de entrada
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  


  // Fecha y hora formateada
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  
  const horaEntradaEstatica = new Date(`${formattedDate}T04:05:28-06:00`);
  const horaEntradaFormateada = horaEntradaEstatica.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const [horaLimite, setHoraLimite] = useState("12:35:00"); // Hora  de salida estática es decir no puede checar antes de esta hora pero si despues

  // Actualizar la hora en tiempo real
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  const handlePressEntrada = async () => {
    // Realizar solicitud para obtener los registros de horas del usuario
    const responseRegistro = await fetch(`http://127.0.0.1:8000/api/v1/registro-horas/?clave_empleado=${userData?.clave}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    // Verificar si la respuesta es exitosa y existen registros
    if (responseRegistro.ok) {
      const registros = await responseRegistro.json();
  
      if (registros.length > 0) {
        // Obtener el registro más reciente
        const registroReciente = registros[0];
        const horaEntrada = registroReciente.hora_entrada;
        const horaEntradaFormateada = new Date(horaEntrada).toLocaleTimeString();
  
        // Actualizar el estado para indicar que la entrada ya fue registrada
        setEntradaRegistrada(true);
        setMensaje(`Ya has registrado tu entrada a las ${horaEntradaFormateada}.`);
        //showNotification(`Ya has registrado tu entrada a las ${horaEntradaFormateada}.`);
        return; // Salir si ya hay un registro de entrada
      } 
    }
  
    // Si no hay registros o la respuesta no es exitosa, continuar con el POST
    setEntradaRegistrada(false);
  
        // Obtener la hora actual y formatearla
        const horaActual = new Date(); // Hora en la que el usuario se registra
        const horaEntradaEstaticaDate = new Date(horaEntradaEstatica); // Hora estática de entrada

        // Determinar si el usuario llegó tarde
        let llegoTarde = (horaActual - horaEntradaEstaticaDate) >= (15 * 60 * 1000);// Si llega tarde  por mas de 15 minutos

        // Determinar si el día se cancela
        let seCancelaSuDia = horaActual > new Date(horaEntradaEstaticaDate.getTime() + 2 * 60 * 60 * 1000); // 2 horas tarde

        console.log(seCancelaSuDia);
        console.log(llegoTarde);
        if (seCancelaSuDia) {
          // Si se cancela el día, llegoTarde se establece en false
          llegoTarde = false;
        }

      // Establecer mensajeLlegada con base en las condiciones
      if (seCancelaSuDia) {
        setMensajeLlegada("Llegaste 2 horas tarde, así que tu día no cuenta.");
      } else if (llegoTarde) {
        setMensajeLlegada("Llegaste tarde, se te descontará la hora.");
      } else {
        setMensajeLlegada("Llegaste a buena hora.");
      }


    // Datos para el POST
    const entradaData = {
      hora_entrada: horaActual.toISOString(),
      clave_empleado: userData?.clave,
      llego_tarde: llegoTarde,
      se_cancela_su_dia: seCancelaSuDia,
      estado_registro: "A",
      usuario_que_registra: userData?.id,
    };
  
    // Realizar el POST para registrar la entrada
    const entradaResponse = await fetch("http://127.0.0.1:8000/api/v1/registro-horas/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(entradaData),
    });
  
    // Verificar si el POST fue exitoso
    if (entradaResponse.ok) {
      setEntradaRegistrada(true); // Marcar que la entrada ha sido registrada
      const horaEntradaFormateada = horaActual.toLocaleTimeString();
      setMensaje(`Entrada registrada correctamente a las ${horaEntradaFormateada}.`);
      //showNotification(`Entrada registrada correctamente a las ${horaEntradaFormateada}.`);
    } else {
      setMensaje("Error al registrar la entrada.");
      //showNotification("Error al registrar la entrada.");
    }
  };



  const handlePressSalida = async () => {
    // Si no se ha registrado la entrada, mostrar un mensaje y salir
    if (!entradaRegistrada) {
      const mensajeError = "No has registrado la entrada. No puedes registrar la salida.";
      setMensaje(mensajeError);
      //showNotification(mensajeError);
      return;
    }
  
    // Obtener los registros de horas del usuario
    const responseRegistro = await fetch(`http://127.0.0.1:8000/api/v1/registro-horas/?clave_empleado=${userData?.clave}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    // Si la solicitud GET fue exitosa, verificar si existe una hora de salida registrada
    if (responseRegistro.ok) {
      const registros = await responseRegistro.json();
  
      if (registros.length > 0) {
        const registroReciente = registros[0];
  
        if (registroReciente.hora_salida) {
          // Si ya hay una hora de salida registrada, mostrar mensaje con la hora de salida existente
          const horaSalidaExistente = new Date(registroReciente.hora_salida).toLocaleTimeString();
          const mensajeSalidaExistente = `Ya has registrado tu salida a las ${horaSalidaExistente}.`;
          setMensaje(mensajeSalidaExistente);
          //showNotification(mensajeSalidaExistente);
          return; // Terminar la función si ya existe una salida registrada
        }
  
        // Si no existe una hora de salida, proceder con el cálculo y el PUT
        const horaEntrada = new Date(registroReciente.hora_entrada);
        const horaSalida = new Date(); // Hora actual para la salida
  
        // Calcular el total de horas trabajadas
        let totalHoras = (horaSalida - horaEntrada) / (1000 * 60 * 60); // Diferencia en horas
  
        // Ajustar el cálculo de totalHoras si llegoTarde o seCancelaSuDia
        if (registroReciente.llego_tarde) {
          totalHoras -= 1; // Restar 1 hora si llegó tarde
        }
        if (registroReciente.se_cancela_su_dia) {
          totalHoras = 0; // No cuenta horas si se cancela el día
        }

        
        // Preparar los datos para el PUT de salida
        // Preparar los datos para el PUT de salida
        console.log(registroReciente.se_cancela_su_dia)
          const salidaData = {
            hora_salida: horaSalida.toISOString(),
            estado_registro: "A",
            total_horas: registroReciente.se_cancela_su_dia ? 'No cuenta tu día' : (totalHoras > 0 ? totalHoras.toFixed(2) : '0'),
          };

          console.log(salidaData.total_horas)
        // Realizar el PUT para actualizar la hora de salida y total de horas trabajadas
        const responseSalida = await fetch(`http://127.0.0.1:8000/api/v1/registro-horas/${registroReciente.id}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(salidaData),
        });
  
        // Verificar si el PUT fue exitoso
        if (responseSalida.ok) {
          const horaSalidaFormateada = horaSalida.toLocaleTimeString();
          setMensaje(`Salida registrada correctamente a las ${horaSalidaFormateada}.`);
          //showNotification(`Salida registrada correctamente a las ${horaSalidaFormateada}.`);
        } else {
          setMensaje("Error al registrar la salida.");
          //showNotification("Error al registrar la salida.");
        }
      } else {
        setMensaje("No se encontró registro de entrada. No puedes registrar la salida.");
       // showNotification("No se encontró registro de entrada. No puedes registrar la salida.");
      }
    } else {
      setMensaje("Error al verificar el registro de horas.");
      //showNotification("Error al verificar el registro de horas.");
    }
  };
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Hola {userData?.nombre}!</Text>
          <Text style={styles.subtituloLlegada}>Entras a las: {horaEntradaFormateada} </Text>
          <Text style={styles.subtitulo}>Registra tu Salida y Entrada</Text>
        </View>

        <View style={styles.formulario}>
          <View style={styles.input}>
            <Text style={styles.subtitulo}>Hora y Fecha actual:</Text>
            <Text style={styles.titulo}>{time}</Text>
            <Text style={styles.subtitulo}>{formattedDate}</Text>
          </View>

          <View style={styles.botonArea}>
            <TouchableOpacity onPress={handlePressEntrada}>
              <View style={styles.btnGreen}>
                <Text style={styles.btnText}>Registrar Entrada</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePressSalida}>
              <View style={styles.btnRed}>
                <Text style={styles.btnText}>Registrar Salida</Text>
              </View>
            </TouchableOpacity>
          </View>

          {mensaje ? <Text style={styles.subtitulo}>{mensaje}</Text> : null}

          {mensajeLlegada ? <Text style={styles.subtituloLlegada}>{mensajeLlegada} </Text> : null}

          

          <Text style={styles.formFooter}>
            Si llegas 15 minutos tarde se te descontará la hora. Si llegas 2 horas tarde se te descontará el día.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Checador;



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
    color: '#676767',
    textAlign: 'center'
  },
  subtituloLlegada: {
    fontSize: 12,
    fontWeight: '500',
    color: '#676767',
    textAlign: 'center'
  },

  //Header
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },

  
  //Formulario
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
    flexDirection: 'row', 
    justifyContent: 'center',
  },

  formFooter: {
    paddingVertical: 24,
    fontSize: 10,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
    paddingTop: 140,
  },


  // Inputs
  input: {
    marginBottom: 16,
    alignItems: 'center'
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

  
  //Botones
  btnGreen: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    borderWidth: 1,
    backgroundColor: '#4CAF50',
    borderColor: '#00d82a',
    width:140,
    height: 90,
    marginHorizontal: 25

  },
  btnRed: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    borderWidth: 1,
    backgroundColor: '#f44336',
    borderColor: '#d80000',
    width:140,
    height: 90,
    marginHorizontal: 25

  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center'

  },
});