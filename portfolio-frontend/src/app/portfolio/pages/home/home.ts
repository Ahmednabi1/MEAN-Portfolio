import { Component } from '@angular/core';
import { Hero } from './sections/hero/hero';
import { About } from './sections/about/about';
import { Experience } from './sections/experience/experience';
import { Projects } from './sections/projects/projects';
import { Skills } from './sections/skills/skills';
import { Contact } from './sections/contact/contact';

@Component({
  selector: 'app-home',
  imports: [Hero, About, Experience, Projects, Skills, Contact],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {}
