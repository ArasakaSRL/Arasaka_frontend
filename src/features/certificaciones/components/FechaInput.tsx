import { useRef, useState } from "react";

export function FechaInput() {
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");

  const mesRef = useRef<HTMLInputElement>(null);
  const anioRef = useRef<HTMLInputElement>(null);

  // Validar números
  const onlyNumbers = (value: string) => value.replace(/\D/g, "");

  const handleDia = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = onlyNumbers(e.target.value).slice(0, 2);
    setDia(value);

    if (value.length === 2) {
      mesRef.current?.focus();
    }
  };

  const handleMes = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = onlyNumbers(e.target.value).slice(0, 2);
    setMes(value);

    if (value.length === 2) {
      anioRef.current?.focus();
    }
  };

  const handleAnio = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = onlyNumbers(e.target.value).slice(0, 4);
    setAnio(value);
  };

  // Validación de fecha
  const isFechaValida = () => {
    if (dia.length !== 2 || mes.length !== 2 || anio.length !== 4)
      return true;

    const fecha = new Date(`${anio}-${mes}-${dia}`);
    const hoy = new Date();

    return fecha <= hoy;
  };

  return (
    <div className="flex gap-2">
      <input
        value={dia}
        onChange={handleDia}
        placeholder="dd"
        className="w-16 text-center border rounded-lg p-2"
      />

      <input
        ref={mesRef}
        value={mes}
        onChange={handleMes}
        placeholder="mm"
        className="w-16 text-center border rounded-lg p-2"
      />

      <input
        ref={anioRef}
        value={anio}
        onChange={handleAnio}
        placeholder="aaaa"
        className="w-24 text-center border rounded-lg p-2"
      />

      {!isFechaValida() && (
        <span className="text-red-500 text-sm">
          Fecha inválida
        </span>
      )}
    </div>
  );
}