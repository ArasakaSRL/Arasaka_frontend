import { Boton } from "../../../components/ui/Boton"



export const Banner = () => {
  return (
    <div className="w-full rounded-xl p-15 text-left text-white bg-gradient-to-br from-blue-400 to-blue-900">
      
      <h1 className="text-3xl text-light-500 font-semibold-ui mb-4">
        Certificaciones y <br /> Logros
      </h1>

      <Boton>Subir Certificación</Boton>

    </div>
  )
}