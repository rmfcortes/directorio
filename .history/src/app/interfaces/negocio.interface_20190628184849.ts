export interface Negocio {
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
    sucursales: Sucursal[];
    telefono: string;
    url: string[];
}

export interface PrevDataNegocio {
    id: string;
    nombre: string;
    rate: number;
    subCategoria: string;
    valoraciones: number;
}
export interface ResultNegocio {
    calificaciones: Rates[];
    categoria: string;
    descripcion: string;
    hasProductos: boolean;
    ofertas: number;
    preguntas: number;
    sucursales: Sucursal[];
    telefono: string;
    url: string[];
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

export interface Sucursal {
    lat: number;
    lng: number;
    nombre: string;
    status: string;
    telefono: number;
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
    nombre: string;
    precio: number;
    unidad: string;
    url: string;
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

