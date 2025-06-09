import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventMoreInfoPage } from './event-more-info.page';

describe('EventMoreInfoPage', () => {
  let component: EventMoreInfoPage;
  let fixture: ComponentFixture<EventMoreInfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EventMoreInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
