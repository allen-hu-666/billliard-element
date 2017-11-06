import { Component } from '@angular/core';
import { BilliardElement, BilliardConfigInterface } from '../../../';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  billiardConfig: BilliardConfigInterface = {
    touchDriveCoefficient: 1,
    frictionSpeed: 2000
  };
  constructor() {

  }
  billiardElCreated(billiardEl: BilliardElement) {
      billiardEl.drive(4000,247);
  }
}