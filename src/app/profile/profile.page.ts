import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonAvatar, IonCard, IonLabel,
  IonButton, IonIcon, IonAlert
} from '@ionic/angular/standalone';
import { User } from '../data/User';
import { PreferencesService } from '../services/preferences.service';
import { addIcons } from 'ionicons';
import { camera } from 'ionicons/icons';
import { FileSystemService } from '../services/file-system.service';
import type { OverlayEventDetail } from '@ionic/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonContent, CommonModule, FormsModule,
    IonAvatar, IonCard, IonAlert
  ]
})
export class ProfilePage implements OnInit {

  user: User = {
    id: 0,
    name: '',
    email: '',
    pic: '',
    created_at: '',
  }

  historico: any[] = [];

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Sim!',
      role: 'confirm',
      handler: () => {
        this.limparPerfil()
      },
    },
  ];

  setResult(event: CustomEvent<OverlayEventDetail>) {
    console.log(`Dismissed with role: ${event.detail.role}`);
  }

  constructor(
    private pf: PreferencesService,
    private filesystem: FileSystemService,
    private router: Router,
  ) {
    addIcons({ camera })
  }

  ngOnInit() {
    this.getUser()
  }

  atualizarPerfil() {
    this.pf.set([
      { key: 'userName', value: this.user.name },
      { key: 'userEmail', value: this.user.email },
      { key: 'userPic', value: this.user.pic }
    ])
  }

  limparPerfil() {
    this.pf.remove([
      'userName',
      'userEmail',
      'userPic',
    ])
    this.user.name = '';
    this.user.email = '';
    this.user.pic = '';
  }

  async getUser() {
    const userParams = await this.pf.get([
      'userName',
      'userEmail',
      'userPic',
      'userCreatedAt'
    ])
    if (userParams && userParams.length > 0) {
      userParams.forEach((item) => {
        if (item.key === 'userName') this.user.name = item.value;
        if (item.key === 'userEmail') this.user.email = item.value;
        if (item.key === 'userPic') this.user.pic = item.value;
        if (item.key === 'userCreatedAt') this.user.created_at = item.value;
      })
      console.log(this.user)
    } else {
      console.log('Não foi possível recuperar os dados do usuário')
    }
  }

  async uploadPic(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // Obtém a extensão do arquivo (ex: jpg, png)
      const fileExtension = file.type.split('/')[1];
      // Define um nome único para o arquivo
      const fileName = `profile_pic_${new Date().getTime()}.${fileExtension}`;
      try {
        // Certifica-se de que a pasta do app exista
        await this.filesystem.createAppFolder();
        // Armazena o arquivo no sistema de arquivos
        await this.filesystem.writeBinaryFile(fileName, file);
        // Lê o arquivo armazenado e obtém a URL em base64
        const url = await this.filesystem.readBinaryFile(fileName);
        if (url) {
          this.user.pic = url;
          // Atualiza o perfil com a nova URL da imagem
          this.atualizarPerfil();
        }
      } catch (error) {
        console.error('Erro ao carregar a imagem:', error);
      }
    }
  }

  nav(){
    this.router.navigateByUrl('/home');
  }
}
