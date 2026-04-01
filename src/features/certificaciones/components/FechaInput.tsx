import { useRef, useState, useEffect } from "react";
import { parse, isValid, isAfter } from "date-fns";

interface Props {
  titulo: string;
  value: string; // Recibirá formato "YYYY-MM-DD"
  onChange: (value: string) => void; // Devuelve un string, no un evento
}

export function FechaInput({ titulo, value, onChange }: Props) {
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");

  const mesRef = useRef<HTMLInputElement>(null);
  const anioRef = useRef<HTMLInputElement>(null);

  // Sincronizar el componente si el padre limpia el formulario
  useEffect(() => {
    if (value) {
      const parts = value.split("-"); // "2024-01-10" -> ["2024", "01", "10"]
      if (parts.length === 3) {
        setAnio(parts[0]);
        setMes(parts[1]);
        setDia(parts[2]);
      }
    } else {
      setAnio("");
      setMes("");
      setDia("");
    }
  }, [value]);

  const onlyNumbers = (val: string) => val.replace(/\D/g, "");

  // Función que arma la fecha y le avisa al componente padre
  const notificarPadre = (d: string, m: string, a: string) => {
    if (d.length === 2 && m.length === 2 && a.length === 4) {
      onChange(`${a}-${m}-${d}`); // Formato para la API: YYYY-MM-DD
    } else {
      onChange(""); // Si está incompleto, enviamos vacío
    }
  };

  const handleDia = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = onlyNumbers(e.target.value).slice(0, 2);
    setDia(val);
    notificarPadre(val, mes, anio);

    if (val.length === 2) {
      mesRef.current?.focus();
    }
  };

  const handleMes = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = onlyNumbers(e.target.value).slice(0, 2);
    setMes(val);
    notificarPadre(dia, val, anio);

    if (val.length === 2) {
      anioRef.current?.focus();
    }
  };

  const handleAnio = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = onlyNumbers(e.target.value).slice(0, 4);
    setAnio(val);
    notificarPadre(dia, mes, val);
  };

  const isFechaValida = () => {
    if (dia.length !== 2 || mes.length !== 2 || anio.length !== 4) {
      return true; // no validar aún si no han terminado de escribir
    }

    const fechaStr = `${dia}/${mes}/${anio}`;
    const fecha = parse(fechaStr, "dd/MM/yyyy", new Date());
    const hoy = new Date();

    //Fecha no existe (ej: 31/02/2024)
    if (!isValid(fecha)) return false;

    // Fecha futura
    if (isAfter(fecha, hoy)) return false;

    return true;
  };

  return (
    <div className="w-full flex flex-col gap-1">
      {/*Título */}
      <label className="text-sm font-semibold text-gray-700 block text-left w-full">
        {titulo}
      </label>

      {/* Inputs */}
      <div className="flex gap-2 items-center">
        <input
          value={dia}
          onChange={handleDia}
          placeholder="dd"
          className="
            w-16 text-center border border-gray-300 rounded-md p-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />
        <input
          ref={mesRef}
          value={mes}
          onChange={handleMes}
          placeholder="mm"
          className="
            w-16 text-center border border-gray-300 rounded-md p-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />
        <input
          ref={anioRef}
          value={anio}
          onChange={handleAnio}
          placeholder="aaaa"
          className="
            w-24 text-center border border-gray-300 rounded-md p-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />
      </div>

      {/* Error */}
      {!isFechaValida() && (
        <span className="text-red-500 text-xs mt-1">Fecha inválida</span>
      )}
    </div>
  );
}