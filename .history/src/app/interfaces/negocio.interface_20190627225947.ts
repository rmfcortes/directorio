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
}

