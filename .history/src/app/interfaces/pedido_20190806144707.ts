export interface Pedido {
    telefonoNegocio: string;
    id: string;
    preparacion: number;
    repartidor?: string;
    paso1?: string;
    paso2?: string;
    paso3?: string;
    paso4?: string;
    paso5?: string;
}

export interface VistaPreviaPedido {
    activo: boolean;
    chat: boolean;
    fecha: number;
    id: string;
    negocio: string;
}
