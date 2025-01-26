import { Component, signal } from '@angular/core';
import { MatCard } from '@angular/material/card';





@Component({
  selector: 'app-header',
  imports: [MatCard],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  ImagePath: string;
  constructor(){
    this.ImagePath = "src\assets\logo.png";
  }



}
