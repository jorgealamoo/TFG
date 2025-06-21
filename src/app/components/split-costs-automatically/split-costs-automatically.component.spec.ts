import {SplitCostsAutomaticallyComponent} from "./split-costs-automatically.component";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {TotalPriceComponent} from "../total-price/total-price.component";
import {By} from "@angular/platform-browser";

describe('SplitCostsAutomaticallyComponent', () => {
  let component: SplitCostsAutomaticallyComponent;
  let fixture: ComponentFixture<SplitCostsAutomaticallyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IonicModule,
        FormsModule,
        NgIf,
        TotalPriceComponent,
        SplitCostsAutomaticallyComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SplitCostsAutomaticallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit splitCostsEnabledChange and entryPriceChange when toggled off', () => {
    const splitCostsSpy = jest.spyOn(component.splitCostsEnabledChange, 'emit');
    const priceSpy = jest.spyOn(component.entryPriceChange, 'emit');

    const toggleEvent = {
      target: { checked: false }
    } as unknown as Event;

    component.entryPrice = 50;
    component.onToggleChange(toggleEvent);

    expect(component.splitCostsEnabled).toBe(false);
    expect(component.entryPrice).toBe(0);
    expect(splitCostsSpy).toHaveBeenCalledWith(false);
    expect(priceSpy).toHaveBeenCalledWith(0);
  });

  it('should emit updated price when onEntryPriceChange is called', () => {
    const priceSpy = jest.spyOn(component.entryPriceChange, 'emit');

    component.onEntryPriceChange(42);

    expect(component.entryPrice).toBe(42);
    expect(priceSpy).toHaveBeenCalledWith(42);
  });

  it('should disable entryPrice if toggle is unchecked', () => {
    component.splitCostsEnabled = false;
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input[type="number"]'));
    expect(input).toBeNull();
  });
});
