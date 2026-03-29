import { useState } from "react";
import { Banner } from "../components/BannerHitos";
export function Hitos() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <section>
        
      <Banner onOpenModal={() => setOpenModal(true)} />

      {openModal && (
        <div>
          {/* Tu modal aquí */}
          Modal abierto
        </div>
      )}
    </section>
  );
}