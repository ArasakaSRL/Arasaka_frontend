import { motion } from "framer-motion";

import Hexagono, { type HexagonoVariant } from "../plantilla2/Hexagono";
//import OrbitaImagenes from "./OrbitaImagenes";

type Seccion = {
  nombre: string;
  color: HexagonoVariant;
}

type Props = {
  rotation: number;
  activeIndex: number;
};

const SECCIONES: Seccion[] =[
  {
    nombre: "Perfil",
    color: "blue",
  },
  {
    nombre: "Habilidades Técnicas",
    color: "purple",
  },
  {
    nombre: "Habilidades Blandas",
    color: "green",
  },
  {
    nombre: "Experiencia",
    color: "orange",
  },
  {
    nombre: "Proyectos",
    color: "red",
  },
  {
    nombre: "Certificaciones",
    color: "cyan",
  },
];


export default function HexagonoRotatorio({
  rotation,
  activeIndex,
}: Props) {

  {/** si quieres girar todo solo colocar dentro del primer motion,dev
    <motion.div
      style={{
              width: 220,
              height: 220,
              position: "relative",
          }}
    */}
  return (
    <div className="">
      <motion.div
        animate={{
          rotate: rotation,
        }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
        }}

      >
        <Hexagono variant={SECCIONES[activeIndex].color} size={400}>
            {/** <div
                style={{
                width: 20,
                height: 200,
                background: "red",
                }}
            />*/}
        </Hexagono>
      </motion.div>

      {/** 
      <OrbitaImagenes fotoPerfil="https://res.cloudinary.com/dkopjpuqx/image/upload/v1775345490/look-my-medal_apeb4v.jpg"/>
        */}
      </div>
  );
}