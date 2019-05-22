import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnunciosService {

  constructor(private db: AngularFireDatabase,
              private fireStorage: AngularFireStorage) { }


  publicarFotosBazar(fotos, uid, id) {
    return new Promise ((resolve, reject) => {
      const promises = [];
      fotos.forEach((foto, i) => {
        if (foto.includes('https')) {
          promises.push(foto);
        } else {
          const ref = this.fireStorage.ref(`negocios/${uid}/${id}/${i}`);
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
      const updatedUserComent =  {};
      updatedUserComent[`usuarios/${producto.uid}/anuncios/bazar/${producto.id}`] = producto;
      updatedUserComent[`anuncios/bazar/${producto.categoria}/${producto.id}`] = producto;
      await this.db.object(`/`).update(updatedUserComent);
      resolve(true);
    });
  }


}
