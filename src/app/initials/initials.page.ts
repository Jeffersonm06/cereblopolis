import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PreferencesService } from '../services/preferences.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-initials',
  templateUrl: './initials.page.html',
  styleUrls: ['./initials.page.scss'],
  standalone: true,
  imports: [IonContent, IonTitle, CommonModule, FormsModule,

  ]
})
export class InitialsPage implements OnInit {

  constructor(
    private pf: PreferencesService
  ) { }

  ngOnInit(): void {
    this.pf.init();
  }

  check() {
    this.pf.checkIn()
  }
}
