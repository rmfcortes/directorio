import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { UidService } from './uid.service';
import { Pregunta } from 'src/app/interfaces/negocio.interface';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Usuario, Direccion } from '../interfaces/usuario.interfaces';
import { VistaPreviaPedido, Pedido } from '../interfaces/pedido';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private db: AngularFireDatabase,
              private platform: Platform,
              private storage: Storage,
              public authFirebase: AngularFireAuth,
              private uidService: UidService) { }


  /////////////////////////////////////////// REVISADAS
  async guardarOfertaFavorita(uid, oferta) {
    return new Promise(async (resolve, reject) => {
        try {
          await this.db.object(`usuarios/${uid}/favoritos/ofertas/${oferta.id}`).set(oferta);
          resolve(true);
        } catch (error) {
          reject(error);
        }
    });
  }

  async borrarOfertaFavorita(uid, id) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.object(`usuarios/${uid}/favoritos/ofertas/${id}`).remove();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getOfertasFavoritas(uid) {
    return new Promise(async (resolve, reject) => {
      try {
        const favSub = this.db.list(`usuarios/${uid}/favoritos/ofertas`).valueChanges()
          .subscribe(favoritos => {
            favSub.unsubscribe();
            if (favoritos) {
              resolve(favoritos);
            } else {
              resolve(false);
            }
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  async getUltimaDireccion() {
    return new Promise(async (resolve, reject) => {
      const uid = await this.uidService.getUid();
      try {
        const dirSub = this.db.object(`usuarios/${uid}/direcciones/ultima-direccion`).valueChanges()
          .subscribe((direccion: any) => {
            dirSub.unsubscribe();
            if (direccion) {
              return resolve(direccion);
            } else {
              return resolve(null);
            }
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  async getDirecciones() {
    return new Promise(async (resolve, reject) => {
      const uid = await this.uidService.getUid();
      try {
        const dirSub = this.db.list(`usuarios/${uid}/direcciones/todas`).valueChanges()
          .subscribe((direccion: any) => {
            dirSub.unsubscribe();
            if (direccion) {
              return resolve(direccion);
            } else {
              return resolve(null);
            }
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  async guardaDireccion(direccion: Direccion) {
    const uid = await this.uidService.getUid();
    direccion.id = this.db.createPushId();
    return new Promise(async (resolve, reject) => {
      try {
        const updatedCountData: any = {};
        updatedCountData[`usuarios/${uid}/direcciones/todas/${direccion.id}`] = direccion;
        updatedCountData[`usuarios/${uid}/direcciones/ultima-direccion`] = direccion;
        await this.db.object('/').update(updatedCountData);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  async generarPedido(productos, detalles, vista) {
    const uid = await this.uidService.getUid();
    return new Promise(async (resolve, reject) => {
      try {
        const key = this.db.createPushId();
        detalles.id = key;
        vista.id = key;
        const updatedCountData: any = {};
        updatedCountData[`usuarios/${uid}/pedidos/carrito/${key}`] = productos;
        updatedCountData[`usuarios/${uid}/pedidos/detalles/${key}`] = detalles;
        updatedCountData[`usuarios/${uid}/pedidos/vista-previa/${key}`] = vista;
        await this.db.object('/').update(updatedCountData);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  /////////////////////////////////////////////////////////////////////////////

  getComentario(uid, id) {
    return this.db.object(`usuarios/${uid}/comentarios/${id}`).valueChanges();
  }

  async getComentarios() {
    return new Promise(async (resolve, reject) => {
      const uid = await this.uidService.getUid();
      const comentariosSub = this.db.list(`usuarios/${uid}/comentarios`).valueChanges()
        .subscribe(comentarios => {
          comentariosSub.unsubscribe();
          resolve(comentarios);
        });
    });
  }

  async guardarFavorito(negocio) {
    const uid = await this.uidService.getUid();
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.object(`usuarios/${uid}/favoritos/${negocio.categoria}/${negocio.id}`).set(negocio);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }



  async getFavorito(id, clasificado) {
    return new Promise(async (resolve, reject) => {
      try {
        const uid = await this.uidService.getUid();
        const favSub = this.db.object(`usuarios/${uid}/favoritos/${clasificado}/${id}`).valueChanges()
          .subscribe(isFavorito => {
            favSub.unsubscribe();
            if (isFavorito) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  async borrarFavorito(id, clasificado) {
    const uid = await this.uidService.getUid();
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.object(`usuarios/${uid}/favoritos/${clasificado}/${id}`).remove();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getFavoritos() {
    return new Promise(async (resolve, reject) => {
      try {
        const uid = await this.uidService.getUid();
        const favSub = this.db.object(`usuarios/${uid}/favoritos`).valueChanges()
          .subscribe(favoritos => {
            favSub.unsubscribe();
            if (favoritos) {
              resolve(favoritos);
            } else {
              resolve(false);
            }
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  async getPedidos(uid, batch, lastKey?) {
    return new Promise(async (resolve, reject) => {
      if (lastKey) {
        const x = this.db.list(`usuarios/${uid}/pedidos/vista-previa/`, data =>
          data.orderByKey().limitToLast(batch).startAt(lastKey))
            .valueChanges().subscribe((pedidos) => {
              x.unsubscribe();
              resolve(pedidos);
            });
      } else {
        const x = this.db.list(`usuarios/${uid}/pedidos/vista-previa/`, data =>
          data.orderByKey().limitToLast(batch)).valueChanges().subscribe((pedidos) => {
            x.unsubscribe();
            resolve(pedidos);
          });
      }
    });
  }

  getPedido(uid, pedido) {
    return this.db.object(`usuarios/${uid}/pedidos/detalles/${pedido}`).valueChanges();
  }

  async getCarrito(uid, pedido) {
    return new Promise(async (resolve, reject) => {
      const x = this.db.list(`usuarios/${uid}/pedidos/carrito/${pedido}`).valueChanges().subscribe((carrito) => {
          x.unsubscribe();
          resolve(carrito);
        });
    });
  }

  publicarComentario(comentario, uid) {
    console.log(comentario);
    return new Promise(async (resolve, reject) => {
      await this.db.object(`usuarios/${uid}/comentarios/${comentario.id}`).update(comentario);
      resolve(true);
    });
  }

  async borrarComentario(id) {
    const uid = await this.uidService.getUid();
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.object(`usuarios/${uid}/comentarios/${id}`).remove();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getAnunciosPermitidos() {
    return new Promise(async (resolve, reject) => {
      const uid = await this.uidService.getUid();
      const cSub = this.db.object(`usuarios/${uid}/permitidos`).valueChanges().subscribe((c: any) => {
        cSub.unsubscribe();
        resolve(c);
      });
    });
  }

  async getAnunciosPublicados() {
    return new Promise(async (resolve, reject) => {
      const uid = await this.uidService.getUid();
      const pubSub = this.db.object(`usuarios/${uid}/anuncios/cantidad`).valueChanges().subscribe(cuenta => {
        pubSub.unsubscribe();
        resolve(cuenta);
      });
    });
  }

  async getNegocios() {
    return new Promise(async (resolve, reject) => {
      const uid = await this.uidService.getUid();
      const anunciosSub = this.db.list(`usuarios/${uid}/anuncios/negocios`).valueChanges()
        .subscribe(negocios => {
          anunciosSub.unsubscribe();
          resolve(negocios);
        });
    });
  }

  async getOfertas() {
    return new Promise(async (resolve, reject) => {
      const uid = await this.uidService.getUid();
      const anunciosSub = this.db.list(`usuarios/${uid}/anuncios/ofertas`).valueChanges()
        .subscribe(ofertas => {
          anunciosSub.unsubscribe();
          resolve(ofertas);
        });
    });
  }

  async getAnunciosCategoria(categoria) {
    return new Promise(async (resolve, reject) => {
      const uid = await this.uidService.getUid();
      const anunciosSub = this.db.list(`usuarios/${uid}/anuncios/${categoria}`).valueChanges()
        .subscribe(anuncios => {
          anunciosSub.unsubscribe();
          resolve(anuncios);
        });
    });
  }

  async getAnuncios() {
    return new Promise(async (resolve, reject) => {
      const uid = await this.uidService.getUid();
      const anunciosSub = this.db.object(`usuarios/${uid}/anuncios`).valueChanges()
        .subscribe(comentarios => {
          anunciosSub.unsubscribe();
          resolve(comentarios);
        });
    });
  }

  async borrarPregunta(id, categoria) {
    const uid = await this.uidService.getUid();
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.object(`usuarios/${uid}/preguntas/${categoria}/${id}`).remove();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getPreguntas() {
    return new Promise(async (resolve, reject) => {
      const uid = await this.uidService.getUid();
      const preguntasSub = this.db.object(`usuarios/${uid}/preguntas`).valueChanges()
        .subscribe(preguntas => {
          preguntasSub.unsubscribe();
          resolve(preguntas);
        });
    });
  }

  getCuenta() {

  }

  publicarPregunta(duda: Pregunta, cat, uid) {
    return new Promise(async (resolve, reject) => {
      try {
        duda.id = this.db.createPushId();
        await this.db.object(`usuarios/${uid}/preguntas/categorias`).update({categoria: cat});
        await this.db.object(`usuarios/${uid}/preguntas/${cat}/${duda.id}`).set(duda);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  getUidAndPhoto(): Promise<Usuario> {
    return new Promise (async (resolve, reject) => {
      if ( this.platform.is('cordova') ) {
        // Celular
        await this.storage.ready();
        const usuario: Usuario = await this.storage.get('usuario');
        if ( usuario ) {
          resolve(usuario);
        } else {
          resolve(null);
        }
      } else {
        // Escritorio
        if ( localStorage.getItem('usuario') ) {
          const usuario: Usuario = await JSON.parse(localStorage.getItem('usuario'));
          resolve(usuario);
        } else {
          resolve(null);
        }
      }
    });
  }


}