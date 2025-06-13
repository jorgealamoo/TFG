import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddParticipantsPage } from './add-participants.page';

describe('AddParticipantsPage', () => {
  let component: AddParticipantsPage;
  let fixture: ComponentFixture<AddParticipantsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddParticipantsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
