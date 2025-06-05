import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserFollowerFollowingComponent } from './user-follower-following.component';

describe('UserFollowerFollowingComponent', () => {
  let component: UserFollowerFollowingComponent;
  let fixture: ComponentFixture<UserFollowerFollowingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFollowerFollowingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFollowerFollowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
