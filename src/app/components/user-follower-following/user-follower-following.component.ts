import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-follower-following',
  templateUrl: './user-follower-following.component.html',
  styleUrls: ['./user-follower-following.component.scss'],
})
export class UserFollowerFollowingComponent {
  @Input() userId: string = '';
  @Input() username: string = 'Username';
  @Input() profileImage: string = '/assets/images/default_profile_image.png';

  constructor(private router: Router) { }

  goToUserProfile() {
    if (this.userId) {
      this.router.navigate(['/profile', this.userId]);
    }
  }
}
