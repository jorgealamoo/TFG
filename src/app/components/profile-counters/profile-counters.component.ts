import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-profile-counters',
  templateUrl: './profile-counters.component.html',
  styleUrls: ['./profile-counters.component.scss'],
})
export class ProfileCountersComponent {
  @Input() postsNumber: number = 0;
  @Input() followersNumber: number = 0;
  @Input() followingNumber: number = 0;

  constructor() { }

}
