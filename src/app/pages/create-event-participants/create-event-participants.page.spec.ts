import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEventParticipantsPage } from './create-event-participants.page';

describe('CreateEventParticipantsPage', () => {
  let component: CreateEventParticipantsPage;
  let fixture: ComponentFixture<CreateEventParticipantsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEventParticipantsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
