import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from "./home/home.component";

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, HomeComponent],
  template: `

    <app-header></app-header>
    <app-home></app-home>
  `,
  styles: `
  main{
    padding:16px;
  }
  `,
})
export class AppComponent {

}
