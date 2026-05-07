import { useRef, useState, useEffect } from "react";

interface Props {
  titulo: string;
  value: string; // 👈 NUEVO: Recibe formato "YYYY-MM-DD"
  onChange: (val: string) => void; // 👈 NUEVO
}

export function FechaInputHitos({ titulo, value, onChange }: Props) {
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");

  const mesRef = useRef<HTMLInputElement>(null);
  const anioRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      const parts = value.split("-");
      if (parts.length === 3) {
        setAnio(parts[0]);
        setMes(parts[1]);
        setDia(parts[2]);
      }
    } else {
      setAnio(""); setMes(""); setDia("");
    }
  }, [value]);

  const onlyNumbers = (val: string) => val.replace(/\D/g, "");

  const notificarPadre = (d: string, m: string, a: string) => {
    if (d.length === 2 && m.length === 2 && a.length === 4) {
      onChange(`${a}-${m}-${d}`);
    } else {
      onChange("");
    }
  };

  const handleDia = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = onlyNumbers(e.target.value).slice(0, 2);
    setDia(val);
    notificarPadre(val, mes, anio);
    if (val.length === 2) mesRef.current?.focus();
  };

  const handleMes = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = onlyNumbers(e.target.value).slice(0, 2);
    setMes(val);
    notificarPadre(dia, val, anio);
    if (val.length === 2) anioRef.current?.focus();
  };

  const handleAnio = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = onlyNumbers(e.target.value).slice(0, 4);
    setAnio(val);
    notificarPadre(dia, mes, val);
  };

  return (
    <div className="w-full flex flex-col gap-1">
      <label className="text-sm font-semibold text-black block text-left w-full">{titulo}</label>
      <div className="flex gap-2 items-center">
        <input value={dia} onChange={handleDia} placeholder="dd" className="w-16 text-center border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input ref={mesRef} value={mes} onChange={handleMes} placeholder="mm" className="w-16 text-center border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input ref={anioRef} value={anio} onChange={handleAnio} placeholder="aaaa" className="w-24 text-center border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
    </div>
  );
}