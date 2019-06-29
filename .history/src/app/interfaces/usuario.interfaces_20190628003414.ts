export interface Usuario {
    foto: string;
    uid: string;
    nombre: string;
}

export interface Comentario {
    comentario: string;
    fecha: Date;
    nombre: string;
    puntos: number;
    urlNegocio: string;
    usuario: Usuario;
    id: string;
    categoria: string;
    subCategoria: string;
}