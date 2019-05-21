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

  constructor(private categoriaService: CategoriasService,
              private authService: AuthService,
              private router: Router,
              private menu: MenuController) {  }

  categoriaSub: Subscription;
  categorias = [];

  ngOnInit() {
    this.getStatus();
    this.getCategorias();
  }

  getStatus() {
    this.authService.revisa().then(user => {
      if (user) {
        this.menu.enable(true, 'menu');
        return;
      }
      this.menu.enable(true, 'menuAccount');
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
