export interface EmailRequest {
    to: string;
    from: string;
    subject: string;
    content: string;
    adjuntos?: File[];
}

export interface EmailResponse {
    message: string;
    mensaje: Mensaje;
}

export interface Mensaje {
    id: string;
    remitente: { nombre: string; correo: string };
    destinatario: { correo: string };
    asunto: string;
    contenido: string;
    leido: boolean;
    fecha_envio: string;
    adjuntos: AdjuntoMensaje[];
}

export interface AdjuntoMensaje {
    nombre: string;
    url: string;
    tipo: string;
}
