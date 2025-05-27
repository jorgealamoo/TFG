import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IonButton} from "@ionic/angular/standalone";
import {SupabaseService} from "../../services/supabase.service";

@Component({
  selector: 'app-profile-follow-button',
  templateUrl: './profile-follow-button.component.html',
  styleUrls: ['./profile-follow-button.component.scss'],
  imports: [
    IonButton
  ]
})
export class ProfileFollowButtonComponent  implements OnInit {
  @Input() targetUserId!: string;
  @Output() followStatusChanged = new EventEmitter<'followed' | 'unfollowed'>();
  followFlag: string = "Follow";
  isFollowing: boolean = false;
  currentUserId: string | null = null;

  constructor(private supabaseService: SupabaseService) { }

  async ngOnInit() {
    this.currentUserId = await this.supabaseService.getUserId();

    if (!this.currentUserId || !this.targetUserId || this.currentUserId === this.targetUserId) return;

    const isFollowing = await this.supabaseService.isFollowing(this.currentUserId, this.targetUserId);
    this.isFollowing = isFollowing;
    this.followFlag = isFollowing ? "Following" : "Follow";
  }

  async toggleFollow(): Promise<void> {
    if (!this.currentUserId || !this.targetUserId) return;

    try {
      if (this.isFollowing) {
        await this.supabaseService.unfollowUser(this.currentUserId, this.targetUserId);
        this.followStatusChanged.emit('unfollowed');
      } else {
        await this.supabaseService.followUser(this.currentUserId, this.targetUserId);
        this.followStatusChanged.emit('followed');
      }

      this.isFollowing = !this.isFollowing;
      this.followFlag = this.isFollowing ? "Following" : "Follow";
    } catch (err) {
      console.error('Error changing follow status:', err);
    }
  }
}
