import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {FooterComponent} from "../../components/footer/footer.component";
import {HomeHeaderComponent} from "../../components/home-header/home-header.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
    imports: [CommonModule, FormsModule, HomeHeaderComponent, FooterComponent]
})
export class HomePage {

  constructor() { }

}
