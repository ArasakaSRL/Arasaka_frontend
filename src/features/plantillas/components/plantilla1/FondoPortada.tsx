interface BannerPerfilProps {
  imagenUrl?: string;
  altura?: number;
}

export default function FondoPortada({
  imagenUrl,
  altura = 240,
}: BannerPerfilProps) {
  return (
    <div
      id="banner-portada"
      className= "relative w-full overflow-hidden"
      style={{ height: altura }}
    >
      {imagenUrl ? (
        <img
          src={imagenUrl}
          alt="Banner"
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className="
            w-full
            h-full
            bg-gradient-to-r
            from-[#0a1a3a]
            to-[#112e57]
          "
        >
          <div className="absolute inset-0 bg-black/10" />

          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-cyan-300/20 blur-3xl" />
        </div>
      )}
    </div>
  );
}