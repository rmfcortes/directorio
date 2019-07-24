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
    fecha: Date;
    id: string;
    negocio: string;
}
