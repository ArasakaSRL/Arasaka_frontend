import type { HexagonoVariant } from "../components/plantilla2/Hexagono";


export type OrbitaItem = {
  id: string;
  titulo: string;
  color: HexagonoVariant;
  tipo: "perfil" | "imagen";
  imagen?: string;
};

export const ORBITA_ITEMS: OrbitaItem[] = [
  {
    id: "perfil",
    titulo: "Perfil",
    color: "blue",
    tipo: "perfil",
  },
  {
    id: "habilidades-tecnicas",
    titulo: "Habilidades Técnicas",
    color: "purple",
    tipo: "imagen",
    imagen:
      "https://res.cloudinary.com/dkopjpuqx/image/upload/v1780686994/habilidades_tecnicas2_ikmpl5.png",
  },
  {
    id: "habilidades-blandas",
    titulo: "Habilidades Blandas",
    color: "green",
    tipo: "imagen",
    imagen:
      "https://res.cloudinary.com/dkopjpuqx/image/upload/v1780686709/Habilidades_blandas_iciagk.png",
  },
  {
    id: "experiencia",
    titulo: "Experiencia",
    color: "orange",
    tipo: "imagen",
    imagen:
      "https://res.cloudinary.com/dkopjpuqx/image/upload/v1780686711/Experiencia_c0uge3.png",
  },
  {
    id: "proyectos",
    titulo: "Proyectos",
    color: "red",
    tipo: "imagen",
    imagen:
      "https://res.cloudinary.com/dkopjpuqx/image/upload/v1780686708/proyectos_hf6hpe.png",
  },
  {
    id: "certificaciones",
    titulo: "Certificaciones",
    color: "cyan",
    tipo: "imagen",
    imagen:
      "https://res.cloudinary.com/dkopjpuqx/image/upload/v1780686713/Certificaciones_al1j7u.png",
  },
];