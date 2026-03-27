import { Banner } from "../components/BannerCertificaciones";

export function Certificaciones(){
    return(
        <section>
             <div className="p-6 space-y-6">

                <Banner />

                <div>
                    <h3 className="text-sm font-medium-ui mb-3 text-left">
                    Categorías
                    </h3>

                    {/*<CategoryAddCard />*/}
                </div>

                <h2 className="text-center text-2xl tracking-widest font-semibold-ui">
                    CERTIFICACIONES
                </h2>
                </div>
        </section>
    );
}