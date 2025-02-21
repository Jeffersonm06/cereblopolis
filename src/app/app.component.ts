import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { PreferencesService } from './services/preferences.service';
import { ScreenOrientation } from '@capacitor/screen-orientation'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet,],
})
export class AppComponent implements OnInit {
  constructor(
    private pf: PreferencesService,
  ) { }

  ngOnInit(): void {
    ScreenOrientation.lock({ orientation: 'portrait-primary' })
  }
}
