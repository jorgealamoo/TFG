import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {SupabaseService} from "../../services/supabase.service";

@Component({
  selector: 'app-logout-button',
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.scss'],
  imports: [
    NgOptimizedImage
  ]
})
export class LogoutButtonComponent {

  constructor(private supabaseService: SupabaseService) { }


  logout() {
    this.supabaseService.signOut();
  }
}
