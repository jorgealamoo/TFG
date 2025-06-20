import {Subject} from "rxjs";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {CreateEventShoppingListPage} from "./create-event-shopping-list.page";
import {IonicModule} from "@ionic/angular";
import {EventFormDataService} from "../../services/event-form-data.service";
import {Router} from "@angular/router";
import {NO_ERRORS_SCHEMA} from "@angular/core";

const formDataMock = {
  getData: jest.fn(),
  setData: jest.fn(),
};

const routerMock = {
  url: '/create-event-shopping-list',
  events: new Subject(),
  navigate: jest.fn(),
};

describe('CreateEventShoppingListPage', () => {
  let fixture: ComponentFixture<CreateEventShoppingListPage>;
  let component: CreateEventShoppingListPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), CreateEventShoppingListPage],
      providers: [
        { provide: EventFormDataService, useValue: formDataMock },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEventShoppingListPage);
    component = fixture.componentInstance;
  });

  afterEach(() => jest.clearAllMocks());

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('redirects to /create-event if no uuid in data', () => {
    formDataMock.getData.mockReturnValue({});
    component.ngOnInit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/create-event']);
  });

  it('does not redirect if uuid present', () => {
    formDataMock.getData.mockReturnValue({ uuid: 'x' });
    component.ngOnInit();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('addItem pushes new item and updates total', () => {
    component.shoppingListItems = [{ name: 'a', price: 1 }];
    component.totalPrice = 1;
    component.addItem();
    expect(component.shoppingListItems.length).toBe(2);
    expect(component.totalPrice).toBe(1);
  });

  it('updateTotalPrice rounds to 2 decimals', () => {
    component.shoppingListItems = [
      { name: 'a', price: 1.111 },
      { name: 'b', price: 2.222 },
    ];
    component.updateTotalPrice();
    expect(component.totalPrice).toBeCloseTo(3.33);
  });

  it('removeItem deletes correct element and recalculates total', () => {
    component.shoppingListItems = [
      { name: 'x', price: 2 },
      { name: 'y', price: 3 },
    ];
    component.removeItem(0);
    expect(component.shoppingListItems).toEqual([{ name: 'y', price: 3 }]);
    expect(component.totalPrice).toBe(3);
  });

  it('goToNextPage stores data and navigates', () => {
    formDataMock.setData.mockClear();
    component.shoppingListItems = [{ name: 'n', price: 4 }];
    component.totalPrice = 4;

    (component as any).splitCostsComponent = {
      splitCostsEnabled: true,
      entryPrice: 1,
    };

    component.goToNextPage();

    expect(formDataMock.setData).toHaveBeenCalledWith('shoppingList', [{ name: 'n', price: 4 }]);
    expect(formDataMock.setData).toHaveBeenCalledWith('totalPrice', 4);
    expect(formDataMock.setData).toHaveBeenCalledWith('splitCostsEnabled', true);
    expect(formDataMock.setData).toHaveBeenCalledWith('entryPrice', 1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/create-event-participants']);
  });
});
