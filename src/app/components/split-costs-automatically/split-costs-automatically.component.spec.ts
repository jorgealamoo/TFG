import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SplitCostsAutomaticallyComponent } from './split-costs-automatically.component';

describe('SplitCostsAutomaticallyComponent', () => {
  let component: SplitCostsAutomaticallyComponent;
  let fixture: ComponentFixture<SplitCostsAutomaticallyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SplitCostsAutomaticallyComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SplitCostsAutomaticallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
