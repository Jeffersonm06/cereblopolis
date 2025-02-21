import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonIcon, IonContent, IonButton,
  IonTab, IonTabBar, IonTabButton, IonTabs, IonLabel, IonCard,
  IonModal, IonButtons, IonCardHeader, IonCardTitle, IonCardContent
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  bookOutline, brush, bulbOutline, earth, flask, gameController, glassesOutline,
  leaf, leafOutline, list, people, skull, star, stopwatchOutline,
  swapHorizontal
} from 'ionicons/icons';
import { modes, Modo } from '../data/modos';
import { Categoria, categorias } from '../data/trivia';
import { PreferencesService } from '../services/preferences.service';
import { LoadingPage } from '../loading/loading.page';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonContent, IonHeader, IonIcon, IonTab, IonTabBar, IonTabButton,
    IonTabs, IonTitle, IonToolbar, IonLabel, IonCard, IonModal, IonButtons,
    IonButton, LoadingPage, IonCardHeader, IonCardTitle, IonCardContent
  ],
})
export class HomePage implements OnInit {

  modes = modes;
  isModalModeOpen = false;
  modo!: Modo;
  dificuldade: string = '';
  listaCategorias: Categoria[] = categorias;
  categoria: string = '';
  processando: boolean = false;

  listaDificuldades = [
    { name: 'Fácil', value: 'facil', desc: 'Conhecimento mais comum.', slot: 'start' },
    { name: 'Médio', value: 'medio', desc: 'Conhecimento nem todos mundo sabe.', slot: 'end' },
    { name: 'Difícil', value: 'dificil', desc: 'Tem que ser sabido em.', slot: 'start' },
  ]

  constructor(
    private pf: PreferencesService,
    private router: Router
  ) {
    addIcons(
      {
        gameController, people, list, star, leafOutline,
        stopwatchOutline, bookOutline, leaf, earth, brush,
        glassesOutline, flask, bulbOutline, skull, swapHorizontal
      });
  }

  ngOnInit(): void {
    this.pf.init()
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

  startGame(multiplayer:string) {
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
}
