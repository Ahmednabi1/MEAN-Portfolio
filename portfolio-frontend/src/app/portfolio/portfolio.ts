import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';

@Component({
  selector: 'app-portfolio',
  imports: [RouterOutlet, Navbar],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css'
})
export class Portfolio {}