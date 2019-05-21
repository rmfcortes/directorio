import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoriasService } from '../services/categorias.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.page.html',
  styleUrls: ['./contenido.page.scss'],
})
export class ContenidoPage implements OnInit, OnDestroy {

  constructor(private categoriaService: CategoriasService,
              private authService: AuthService,
              private router: Router) {  }

  categoriaSub: Subscription;
  categorias = [];

  ngOnInit() {
    this.getCategorias();
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
