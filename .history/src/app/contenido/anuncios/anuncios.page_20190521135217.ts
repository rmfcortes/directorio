import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.page.html',
  styleUrls: ['./anuncios.page.scss'],
})
export class AnunciosPage implements OnInit {

  uid: string;

  constructor(private authService: AuthService,
              private userService: UsuarioService) { }

  ngOnInit() {
    this.getUsuario();
  }

  getUsuario() {
    const userSub = this.authService.revisaSub().subscribe(user => {
      this.uid = user.uid;
      userSub.unsubscribe();
      this
      console.log(this.uid);
    });
  }

  getAnuncios() {
    this.userService.getAnuncios(this.uid).subscribe(anuncios => {
      console.log(anuncios);
    });
  }

}
