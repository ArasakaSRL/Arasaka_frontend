import { InputCertificaciones } from "../features/certificaciones/components/InputCertificaciones";

export default function About() {
  return (
    <section id="center">
      <h1>Acerca de nosotros</h1>
      <p>Esta es una página adicional para probar React Router.</p>
      <InputCertificaciones tamMax={20} placeHolder="" height={40} ></InputCertificaciones>
    </section>
  )
}