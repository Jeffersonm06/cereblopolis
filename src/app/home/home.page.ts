import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonIcon, IonContent, IonButton,
  IonTab, IonTabBar, IonTabButton, IonTabs, IonLabel, IonCard,
  IonModal, IonButtons, IonCardHeader, IonCardTitle, IonCardContent,
  IonInput, IonBadge, IonText, IonAvatar, IonItem, IonList
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  bluetooth,
  bookOutline, brush, bulbOutline, earth, flask, gameController, glassesOutline,
  leaf, leafOutline, list, people, skull, star, stopwatchOutline,
  swapHorizontal
} from 'ionicons/icons';
import { modes, Modo } from '../data/modos';
import { Categoria, categorias } from '../data/trivia';
import { PreferencesService } from '../services/preferences.service';
import { LoadingPage } from '../loading/loading.page';
import { User } from '../data/User';
import { EmailComposer } from 'capacitor-email-composer'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonContent, IonHeader, IonIcon, IonTab, IonTabBar, IonTabButton, FormsModule,
    IonTabs, IonTitle, IonToolbar, IonLabel, IonCard, IonModal, IonButtons,
    IonButton, LoadingPage, IonCardHeader, IonCardTitle, IonCardContent, IonText,
    IonAvatar, IonItem,
  ],
})
export class HomePage implements OnInit {

  user: User = {
    id: 0,
    name: '',
    email: '',
    pic: '',
    created_at: '',
  }

  modes = modes;
  isModalModeOpen = false;
  modo!: Modo;
  dificuldade: string = '';
  listaCategorias: Categoria[] = categorias;
  categoria: string = '';
  processando: boolean = false;
  isConnected = false;
  message: string = '';
  email = {
    to: ['wellingtonalexandre857@gmail.com'],
    subject: '',
    body: ''
  }

  listaDificuldades = [
    { name: 'Fácil', value: 'facil', desc: 'Conhecimento mais comum.', slot: 'start' },
    { name: 'Médio', value: 'medio', desc: 'Conhecimento nem todos mundo sabe.', slot: 'end' },
    { name: 'Difícil', value: 'dificil', desc: 'Tem que ser sabido em.', slot: 'start' },
  ]

  constructor(
    private pf: PreferencesService,
    private router: Router,
  ) {
    addIcons(
      {
        gameController, people, list, star, leafOutline, bluetooth,
        stopwatchOutline, bookOutline, leaf, earth, brush,
        glassesOutline, flask, bulbOutline, skull, swapHorizontal
      });
  }

  async ngOnInit() {
    this.pf.init()
    await this.getUser();
    console.log(this.user);
  }

  setOpen(modal: string, isOpen: boolean) {
    switch (modal) {
      case 'mode':
        this.isModalModeOpen = isOpen;
        break;
      default:
        return;
    }
  }

  setMode(modo: Modo) {
    this.modo = modo
  }

  selectDif(dificuldade: string) {
    this.dificuldade = dificuldade;
  }

  selectCat(categoria: string) {
    this.categoria = categoria;
  }

  startGame(multiplayer: string) {
    this.processando = true;
    this.pf.set(
      [
        { key: 'modo', value: this.modo.name },
        { key: 'dificuldade', value: this.dificuldade },
        { key: 'categoria', value: this.categoria },
        { key: 'multiplayer', value: multiplayer },
      ]
    )
    setTimeout(() => {
      this.processando = false;
      this.router.navigateByUrl('/playing');
    }, 2000)
  }

  clear() {
    this.pf.clear();
  }

  nav(rota: string) {
    this.router.navigateByUrl(rota);
  }

  async getUser() {
    const userParams = await this.pf.get([
      'userName',
      'userEmail',
      'userPassword',
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

  async sendEmail() {
    await EmailComposer.open(this.email);
  }
}
