import {Component, Input} from '@angular/core';
import {IonCheckbox} from "@ionic/angular/standalone";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.scss'],
  imports: [
    IonCheckbox,
    FormsModule
  ]
})
export class SelectUserComponent {
  @Input() username: string = "Username";
  @Input() profileImage!: string | null;
  @Input() id: string | null = null;
  isSelected: boolean = false;

  constructor(private router: Router) { }

  goToUserProfile() {
    this.router.navigate(['/profile', this.id]);
  }
}
