import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './app.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ld-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  
  devices: any;
  deviceSubscription: Subscription;

  constructor(private appService: AppService) {}

  ngOnInit() {
      this.deviceSubscription = this.appService.getDevicesDetails()
      .subscribe(data => {
        if(data) {
          this.devices = data;
        }
      });
  }

  ngOnDestroy() {
      this.deviceSubscription.unsubscribe();
  }

}
