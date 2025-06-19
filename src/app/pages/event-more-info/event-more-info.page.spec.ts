import {ActivatedRoute, Router} from "@angular/router";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {EventMoreInfoPage} from "./event-more-info.page";
import {IonicModule} from "@ionic/angular";
import {SupabaseService} from "../../services/supabase.service";
import {NO_ERRORS_SCHEMA} from "@angular/core";

jest.useFakeTimers();

const supabaseMock = {
  getUserId: jest.fn(),
  getEventMoreInfo: jest.fn(),
  updateShoppingList: jest.fn().mockResolvedValue({ error: null }),
};

const routerMock = {
  navigate: jest.fn(),
};

const activatedRouteMock = {
  snapshot: { paramMap: { get: () => 'e1' } },
} as unknown as ActivatedRoute;

const mockDetails = {
  creatorUserId: 'u1',
  title: 'Party',
  shopping_list: [
    { name: 'chips', price: 2 },
    { name: 'soda', price: 3 },
  ],
  total_price: 5,
  entry_price: 1,
  split_costs_enabled: true,
  creatorUsername: 'alice',
  max_participants: 10,
  max_participants_enabled: true,
  participants: [{ id: 'u1', username: 'alice', profile_image: '' }],
};

describe('EventMoreInfoPage', () => {
  let fixture: ComponentFixture<EventMoreInfoPage>;
  let component: EventMoreInfoPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), EventMoreInfoPage],
      providers: [
        { provide: SupabaseService, useValue: supabaseMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EventMoreInfoPage);
    component = fixture.componentInstance;
  });

  afterEach(() => jest.clearAllMocks());

  it('loads event info on ionViewWillEnter', async () => {
    supabaseMock.getUserId.mockResolvedValue('u1');
    supabaseMock.getEventMoreInfo.mockResolvedValue(mockDetails);

    await component.ionViewWillEnter();

    expect(component.title).toBe('Party');
    expect(component.shoppingListItems.length).toBe(2);
    expect(component.totalPrice).toBe(5);
    expect(component.creatorId).toBe('u1');
    expect(component.participantsLength).toBe(1);
  });

  it('onViewChange sets selected view', () => {
    component.onViewChange('participants');
    expect(component.selectedView).toBe('participants');
  });

  it('updateTotalPrice recalculates rounded total', () => {
    component.shoppingListItems = [
      { name: 'a', price: 1.111 },
      { name: 'b', price: 2.222 },
    ];
    component.updateTotalPrice();
    expect(component.totalPrice).toBeCloseTo(3.33);
  });

  it('addItem adds blank item and schedules auto‑save', () => {
    const initial = component.shoppingListItems.length;
    const spy = jest.spyOn(component, 'scheduleAutoSave');
    component.addItem();
    expect(component.shoppingListItems.length).toBe(initial + 1);
    expect(spy).toHaveBeenCalled();
  });

  it('removeItem deletes item and schedules auto‑save', () => {
    component.shoppingListItems = [
      { name: 'a', price: 1 },
      { name: 'b', price: 2 },
    ];
    const spy = jest.spyOn(component, 'scheduleAutoSave');
    component.removeItem(0);
    expect(component.shoppingListItems).toEqual([{ name: 'b', price: 2 }]);
    expect(spy).toHaveBeenCalled();
  });

  it('calculateDue for creator returns 0', () => {
    component.userId = 'u1';
    component.creatorId = 'u1';
    expect(component.calculateDue()).toBe(0);
  });

  it('calculateDue with split ON divides total', () => {
    component.userId = 'u2';
    component.creatorId = 'u1';
    component.totalPrice = 8;
    component.splitCostsEnabled = true;
    component.participantsLength = 4;
    expect(component.calculateDue()).toBe(2);
  });

  it('calculateDue with split OFF returns entry price', () => {
    component.userId = 'user123';
    component.creatorId = 'creator456';
    component.splitCostsEnabled = false;
    component.entryPrice = 3;
    expect(component.calculateDue()).toBe(3);
  });

  it('auto‑save triggers updateShoppingList after debounce', () => {
    component.eventId = 'e1';
    component.shoppingListItems = [{ name: 'x', price: 1 }];
    component.totalPrice = 1;
    component.entryPrice = 0;
    component.splitCostsEnabled = true;

    component.scheduleAutoSave();
    jest.advanceTimersByTime(1500);

    expect(supabaseMock.updateShoppingList).toHaveBeenCalledWith(
      'e1',
      component.shoppingListItems,
      1,
      0,
      true
    );
  });

  it('addParticipant navigates to add‑participants page', () => {
    component.eventId = 'e1';
    component.addParticipant();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/add-participants', 'e1']);
  });
});
