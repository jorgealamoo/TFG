import {Component, EventEmitter, Input, Output} from '@angular/core';
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
  @Input() isSelected: boolean = false;

  @Output() selectionChange = new EventEmitter<{ id: string | null; selected: boolean }>();

  constructor(private router: Router) { }

  goToUserProfile() {
    this.router.navigate(['/profile', this.id]);
  }

  onCheckboxChange() {
    this.selectionChange.emit({ id: this.id, selected: this.isSelected });
  }
}
