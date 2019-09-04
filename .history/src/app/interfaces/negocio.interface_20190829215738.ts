export interface Negocio {
    abierto: boolean;
    calificaciones: Rates[];
    id: string;
    nombre: string;
    rate: number;
    subCategoria: string;
    valoraciones: number;
    categoria: string;
    descripcion: string;
    hasProductos: boolean;
    ofertas: number;
    preguntas: number;
    preparacion: number;
    telefono: string;
    url: string;
    vista: string;
    lat: string;
    lng: string;
    status: string;
}

export interface PrevDataNegocio {
    abierto: boolean;
    id: string;
    nombre: string;
    rate: number;
    subCategoria: string;
    valoraciones: number;
}
export interface ResultNegocio {
    calificaciones: Rates[];
    preparacion: number;
    categoria: string;
    descripcion: string;
    hasProductos: boolean;
    ofertas: number;
    preguntas: number;
    telefono: string;
    url: string;
    vista: string;
    lat: string;
    lng: string;
    status: string;
}

export interface Valoraciones {
    resumen: Resumen;
    comentarios: Comentarios[];
}

export interface Rates {
    cantidad: number;
    valor: number;
}

export interface Resumen {
    cantidad: number;
    promedio: number;
}

export interface Comentarios {
    id: string;
    comentario: string;
    url: string;
    usuario: string;
    puntos: number;
}

export interface Pregunta {
    pregunta: string;
    remitente: string;
    categoria: string;
    respuesta?: string;
    id?: string;
}

export interface Pasillo {
    nombre: string;
    productos: Producto[];
}

export interface Producto {
    id: string;
    categoria: string;
    pasillo: string;
    nombre: string;
    precio: number;
    unidad: string;
    url: string;
    descripcion: string;
    guardado?: boolean;
    cart?: boolean;
    cantidad?: number;
    total?: number;
}

export interface Calificacion {
    puntos: number;
    urlNegocio: string;
    id: string;
    nombre: string;
    categoria: string;
    subCategoria: string;
}

export interface CategoriasPasillo {
    nombre: string;
    sub: string[];
    url: string;
    display?: boolean;
}

export interface SubCategoria {
    categoria: string;
    prioridad: number;
    url: string;
}

export interface Ofertas {
    key: string;
    url: string;
}

export interface VistaPreviaNegocio {
    categoria: string;
    abierto: boolean;
    id: string;
    nombre: string;
    rate: number;
    subCategoria: string;
    url: string;
    valoraciones: number;
}


