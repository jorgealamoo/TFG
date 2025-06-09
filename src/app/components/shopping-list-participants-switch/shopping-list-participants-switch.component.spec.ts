import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShoppingListParticipantsSwitchComponent } from './shopping-list-participants-switch.component';

describe('ShoppingListParticipantsSwitchComponent', () => {
  let component: ShoppingListParticipantsSwitchComponent;
  let fixture: ComponentFixture<ShoppingListParticipantsSwitchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingListParticipantsSwitchComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingListParticipantsSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
