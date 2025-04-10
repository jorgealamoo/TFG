import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEventShoppingListPage } from './create-event-shopping-list.page';

describe('CreateEventShoppingListPage', () => {
  let component: CreateEventShoppingListPage;
  let fixture: ComponentFixture<CreateEventShoppingListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEventShoppingListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
