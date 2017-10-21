import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BilliardElementModule } from './billiard-element.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BilliardElementModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
