import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.page.html',
  styleUrls: ['./comentarios.page.scss'],
})
export class ComentariosPage implements OnInit {

  comentarios = [];

  constructor(private location: Location,
              public actionSheetController: ActionSheetController,
              private router: Router,
              private authService: AuthService,
              private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    const userSub = this.authService.revisaSub().subscribe((user: any) => {
      const uid = user.uid;
      this.getComentarios(uid);
    });
  }

  getComentarios(uid) {
    const comentariosSub = this.usuarioService.getComentarios(uid).subscribe(comentarios => {
      comentariosSub.unsubscribe();
      this.comentarios = Object.values(comentarios);
      console.log(this.comentarios);
    });
  }

  async presentOpciones(comentario) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Editar',
        icon: 'create',
        handler: () => {
          this.router.navigate(['/calificar', this.negocio.categoria, comentario.id, comentario.puntos]);
        }
      }, {
        text: 'Eliminar',
        icon: 'trash',
        handler: () => {
          this.borrarComentario();
        }
      }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
          }
      }]
    });
    await actionSheet.present();
  }

  borrarComentario() {

  }

  regresar() {
    this.location.back();
  }

}
