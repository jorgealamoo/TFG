import {Component, OnInit} from '@angular/core';
import {IonButton} from "@ionic/angular/standalone";
import {NgOptimizedImage} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {SupabaseService} from "../../services/supabase.service";

@Component({
  selector: 'app-leave-event-button',
  templateUrl: './leave-event-button.component.html',
  styleUrls: ['./leave-event-button.component.scss'],
  imports: [
    IonButton,
    NgOptimizedImage
  ]
})
export class LeaveEventButtonComponent implements OnInit {
  eventId!: string;
  userId!: string | null;

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id')!;
    this.userId = await this.supabaseService.getUserId()
  }

  leaveEvent() {
    this.supabaseService.leaveEvent(this.userId, this.eventId);
    window.history.back();
  }
}
