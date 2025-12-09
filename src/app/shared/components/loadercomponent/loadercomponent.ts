import { CommonModule } from '@angular/common';
import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loadercomponent.html',
  styleUrl: './loadercomponent.scss',
})
export class Loadercomponent {
@Input() isLoading: boolean = false;
}
