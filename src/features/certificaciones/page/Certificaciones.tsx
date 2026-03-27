import { Banner } from "../components/BannerCertificaciones";
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

                    {/*<CategoryAddCard />*/}
                </div>

                <h2 className="text-center text-lg text-dark-500 tracking-widest font-semibold-ui">
                    CERTIFICACIONES
                </h2>
                </div>
                <InputCertificaciones tamMax={20} placeHolder="" height={40} ></InputCertificaciones>
                <InputCertificaciones 
                    tamMax={100} 
                    placeHolder="" 
                    width={300} 
                    height={100}>
                </InputCertificaciones>
                <FechaInput></FechaInput>
                <ImagenUploader></ImagenUploader>
        </section>
    );
}