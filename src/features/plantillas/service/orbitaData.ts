import { Award, Brain, Briefcase, FolderKanban, User, Wrench, type LucideIcon } from "lucide-react";
import type { HexagonoVariant } from "../components/plantilla2/Hexagono";

export type OrbitaItem = {
  id: string;
  titulo: string;
  color: HexagonoVariant;
  tipo: "perfil" | "imagen";
  imagen?: string;
  icon: LucideIcon;
}; 

export const ORBITA_ITEMS: OrbitaItem[] = [
  {
    id: "perfil",
    titulo: "Perfil",
    color: "blue",
    tipo: "perfil",
    icon: User,
  },
  {
    id: "habilidades-blandas",
    titulo: "Habilidades Blandas",
    color: "purple",
    tipo: "imagen",
    icon: Brain,
    imagen:
      "https://res.cloudinary.com/dkopjpuqx/image/upload/v1780783445/main_image_adc6d63b398a0e6123ccd22440a94f2c6bd31bc4_jycii1.png",
  },
  {
    id: "experiencia",
    titulo: "Experiencia",
    color: "green",
    tipo: "imagen",
    icon: Briefcase,
    imagen:
      "https://res.cloudinary.com/dkopjpuqx/image/upload/v1780686711/Experiencia_c0uge3.png",
  },
  {
    id: "proyectos",
    titulo: "Proyectos",
    color: "orange",
    tipo: "imagen",
    icon: FolderKanban,
    imagen:
      "https://res.cloudinary.com/dkopjpuqx/image/upload/v1780686708/proyectos_hf6hpe.png",
  },
  {
    id: "certificaciones",
    titulo: "Certificaciones",
    color: "red",
    tipo: "imagen",
    icon: Award,
    imagen:
      "https://res.cloudinary.com/dkopjpuqx/image/upload/v1780686713/Certificaciones_al1j7u.png",
  },
  {
    id: "habilidades-tecnicas",
    titulo: "Habilidades Técnicas",
    color: "cyan",
    tipo: "imagen",
    icon: Wrench,
    imagen:
      "https://res.cloudinary.com/dkopjpuqx/image/upload/v1780686994/habilidades_tecnicas2_ikmpl5.png",
  },
];