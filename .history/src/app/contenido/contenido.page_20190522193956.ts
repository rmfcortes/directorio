import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CategoriasService } from '../services/categorias.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.page.html',
  styleUrls: ['./contenido.page.scss'],
})
export class ContenidoPage implements OnInit, OnDestroy {

  menuGeneral = true;
  menuAccount = false;

  constructor(private categoriaService: CategoriasService,
              private authService: AuthService,
              private router: Router,
              private menuCtrl: MenuController) {  }

  categoriaSub: Subscription;
  categorias = [];
  user = {
    foto: '../../assets/images/no-foto-perfil.png',
    nombre:  '',
    apellido: ''
  };

  ngOnInit() {
    this.getStatus();
    this.getCategorias();
  }

  getStatus() {
    this.authService.revisaSub().subscribe(user => {
      if (user) {
        console.log(user);
        if (user.photoURL) {
          this.user.foto = user.photoURL;
        }
        this.user.nombre = user.displayName;
        this.menuAccount = false;
        this.menuGeneral = true;
        return;
      }
      this.menuAccount = true;
      this.menuGeneral = false;
    });
  }

  getCategorias() {
    this.categoriaSub = this.categoriaService.getCategorias().subscribe(data => {
      this.categorias = Object.keys(data);
    });
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/ofertas']);
  }

  ngOnDestroy(): void {
    this.categoriaSub.unsubscribe();
  }

}
