import { Banner } from "../components/BannerCertificaciones";
import { CategoriaCard } from "../components/CategoriaCard";
import { FechaInput } from "../components/FechaInput";
import { ImagenUploader } from "../components/ImagenUploader";
import { InputCertificaciones } from "../components/InputCertificaciones";

export function Certificaciones(){
  return(
    <section>
      <div className="p-1 space-y-6">

        <Banner />

        <div>
          <h3 className="text-sm text-dark-500 font-medium-ui mb-3 text-left">
            Categorías
          </h3>

          <CategoriaCard
            title="Académico"
            description="Diplomas, logros educativos, etc"
            image="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
          />

          <CategoriaCard
            title="Idiomas"
            description="Diplomas y certificados, etc"
            image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          />
        </div>

        <h2 className="text-center text-lg text-dark-500 tracking-widest font-semibold-ui">
          CERTIFICACIONES
        </h2>

        <InputCertificaciones tamMax={20} placeHolder="" height={40} />

        <InputCertificaciones 
          tamMax={100} 
          placeHolder="" 
          width={300} 
          height={100}
        />

        <FechaInput />
        <ImagenUploader />

      </div>
    </section>
  );
}