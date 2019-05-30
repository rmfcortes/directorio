import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnunciosService {

  constructor(private db: AngularFireDatabase,
              private fireStorage: AngularFireStorage,
              public authFirebase: AngularFireAuth) { }

  getUid() {
    return new Promise((resolve, reject) => {
      const userSub = this.authFirebase.authState.subscribe(user => {
        userSub.unsubscribe();
        resolve(user.uid);
      });
    });
  }

  // Bazar

  async publicarFotosBazar(fotos, id) {
    return new Promise (async (resolve, reject) => {
      const uid = await this.getUid();
      const promises = [];
      fotos.forEach((foto, i) => {
        if (foto.includes('https')) {
          promises.push(foto);
        } else {
          const ref = this.fireStorage.ref(`anuncios/${uid}/${id}/${i}`);
          const task = ref.putString( foto, 'base64', { contentType: 'image/jpeg'} );

          const p = new Promise ((resolver, rejecte) => {
            const tarea = task.snapshotChanges().pipe(
              finalize(() => {
                const downloadURL = ref.getDownloadURL().toPromise();
                tarea.unsubscribe();
                resolver(downloadURL);
              })
              ).subscribe(
                x => { console.log(x); },
                err => {
                  rejecte();
                  console.log(err);
                }
              );
          });
          promises.push(p);
        }
      });
      resolve(Promise.all(promises));
    });
  }

  publicarBazar(producto) {
    return new Promise(async (resolve, reject) => {
      const uid = await this.getUid();
      producto.uid = uid;
      const updatedUserComent =  {};
      updatedUserComent[`usuarios/${uid}/anuncios/bazar/${producto.id}`] = producto;
      updatedUserComent[`anuncios/bazar/${producto.categoria}/${producto.id}`] = producto;
      await this.db.object(`/`).update(updatedUserComent);
      resolve(true);
    });
  }

  async getAnuncioBazar(id) {
    return new Promise(async (resolve, reject) => {
      const uid = await this.getUid();
      const bazarSub =  this.db.object(`usuarios/${uid}/anuncios/bazar/${id}`).valueChanges()
        .subscribe(comentarios => {
          bazarSub.unsubscribe();
          resolve(comentarios);
        });
    });
  }

  // Empleos

  async getAnuncioEmpleo(id) {
    return new Promise(async (resolve, reject) => {
      const uid = await this.getUid();
      const empleoSub =  this.db.object(`usuarios/${uid}/anuncios/empleos/${id}`).valueChanges()
        .subscribe(empleo => {
          empleoSub.unsubscribe();
          resolve(empleo);
        });
    });
  }

  publicarEmpleo(empleo) {
    return new Promise(async (resolve, reject) => {
      const uid = await this.getUid();
      empleo.uid = uid;
      const updatedUserComent =  {};
      updatedUserComent[`usuarios/${uid}/anuncios/empleos/${empleo.id}`] = empleo;
      updatedUserComent[`anuncios/empleos/${empleo.id}`] = empleo;
      await this.db.object(`/`).update(updatedUserComent);
      resolve(true);
    });
  }

  // Inmuebles

  async publicarFotosInmueble(fotos, id) {
    return new Promise (async (resolve, reject) => {
      const uid = await this.getUid();
      const promises = [];
      fotos.forEach((foto, i) => {
        if (foto.includes('https')) {
          promises.push(foto);
        } else {
          const ref = this.fireStorage.ref(`anuncios/${uid}/${id}/${i}`);
          const task = ref.putString( foto, 'base64', { contentType: 'image/jpeg'} );

          const p = new Promise ((resolver, rejecte) => {
            const tarea = task.snapshotChanges().pipe(
              finalize(() => {
                const downloadURL = ref.getDownloadURL().toPromise();
                tarea.unsubscribe();
                resolver(downloadURL);
              })
              ).subscribe(
                x => { console.log(x); },
                err => {
                  rejecte();
                  console.log(err);
                }
              );
          });
          promises.push(p);
        }
      });
      resolve(Promise.all(promises));
    });
  }

  async getAnuncioInmueble(id) {
    return new Promise(async (resolve, reject) => {
      const uid = await this.getUid();
      const inmuebleSub =  this.db.object(`usuarios/${uid}/anuncios/inmuebles/${id}`).valueChanges()
        .subscribe(inmuebles => {
          inmuebleSub.unsubscribe();
          resolve(inmuebles);
        });
    });
  }

  publicarInmueble(inmueble) {
    return new Promise(async (resolve, reject) => {
      const uid = await this.getUid();
      inmueble.uid = uid;
      const updatedUserComent =  {};
      updatedUserComent[`usuarios/${uid}/anuncios/inmuebles/${inmueble.id}`] = inmueble;
      updatedUserComent[`anuncios/inmuebles/${inmueble.id}`] = inmueble;
      await this.db.object(`/`).update(updatedUserComent);
      resolve(true);
    });
  }

  // General

  async borrarAnuncio(categoria, id) {
    return new Promise(async (resolve, reject) => {
      try {
        const uid = await this.getUid();
        await this.db.object(`usuarios/${uid}/anuncios/${categoria}/${id}`).remove();
        await this.db.object(`anuncios/${categoria}/${id}`).remove();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }


}
