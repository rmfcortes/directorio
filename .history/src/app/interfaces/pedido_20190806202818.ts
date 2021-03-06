export interface Pedido {
    direccion: DireccionCliente;
    id: string;
    preparacion: number;
    repartidor?: string;
    telefonoNegocio: string;
    paso1?: number;
    paso2?: string;
    paso3?: string;
    paso4?: string;
    paso5?: string;
}

export interface DireccionCliente {
    direccion: string;
    id: string;
    lat: number;
    lng: number;
}

export interface VistaPreviaPedido {
    activo: boolean;
    chat: boolean;
    fecha: number;
    id: string;
    negocio: string;
}
