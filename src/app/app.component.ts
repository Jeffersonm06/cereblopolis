import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { PreferencesService } from './services/preferences.service';
import { ScreenOrientation } from '@capacitor/screen-orientation'
import { Platform } from '@ionic/angular/standalone';
import { FileSystemService } from './services/file-system.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet,],
})
export class AppComponent implements OnInit {
  constructor(
    private pf: PreferencesService,
    private platform: Platform,
    private filesystem: FileSystemService
  ) {
    this.platform.backButton.subscribeWithPriority(5, () => {
      console.log('Another handler was called!');
    });

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      console.log('Handler was called!');

      processNextHandler();
    });
  }

  ngOnInit(): void {
    ScreenOrientation.lock({ orientation: 'portrait-primary' })
    this.filesystem.checkPermissions();
    setTimeout(() => {
      this.filesystem.createAppFolder()
    }, 3000);
    this.pf.init();
  }
}
