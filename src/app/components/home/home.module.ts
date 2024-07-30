import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component'; // Adjust the path as necessary
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { BrowserModule } from '@angular/platform-browser';
import { CountryStatusModalComponent } from '../country-status-modal/country-status-modal.component';

@NgModule({
  declarations: [
    HomeComponent,
    CountryStatusModalComponent
    // Other components
  ],
  imports: [
    CommonModule
    // Other modules
  ],
  exports: [
    HomeComponent // If you need to export this component for use in other modules
  ]
})
export class HomeComponentModule { }