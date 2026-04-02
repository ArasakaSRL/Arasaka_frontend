import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale'; // 👈 Importamos el idioma español

export const obtenerDatosDeFecha = (fechaString: string) => {
  // Convertimos el string "2026-10-15" a un objeto Date
  const fecha = parseISO(fechaString);

  // 'EEEE' te da el día de la semana completo
  const diaSemana = format(fecha, 'EEEE', { locale: es }); 
  
  // 'MMMM' te da el mes completo
  const mes = format(fecha, 'MMMM', { locale: es });
  
  // 'dd' te da el número del día, y 'yyyy' el año
  const diaNumero = format(fecha, 'dd');
  const anio = format(fecha, 'yyyy');

  return {
    diaSemana, // ej: "jueves"
    mes,       // ej: "octubre"
    diaNumero, // ej: "15"
    anio       // ej: "2026"
  };
};