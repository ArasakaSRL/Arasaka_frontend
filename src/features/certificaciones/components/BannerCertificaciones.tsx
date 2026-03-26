export function BannerCertificaiones(){
    const gradienteStyle ={
        height: '100vh',
        backgroundImage: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)'
    };
    return(
        <section>
            <div style={gradienteStyle}>Contenido con fondo degradado</div>;
        </section>
    );
}