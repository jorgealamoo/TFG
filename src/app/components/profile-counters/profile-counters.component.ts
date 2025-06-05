import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile-counters',
  templateUrl: './profile-counters.component.html',
  styleUrls: ['./profile-counters.component.scss'],
})
export class ProfileCountersComponent {
  @Input() postsNumber: number = 0;
  @Input() followersNumber: number = 0;
  @Input() followingNumber: number = 0;
  @Input() userId: string | null = null;

  constructor(private router: Router) { }

  goToFollowers() {
    if (this.userId) {
      this.router.navigate(['/followers', this.userId]);
    }
  }

  goToFollowing() {
    if (this.userId) {
      this.router.navigate(['/following', this.userId]);
    }
  }
}
