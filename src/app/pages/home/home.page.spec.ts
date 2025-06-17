import {HomePage} from "./home.page";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";
import {SupabaseService} from "../../services/supabase.service";
import {RouterTestingModule} from "@angular/router/testing";
import {NO_ERRORS_SCHEMA} from "@angular/core";

const mockSupabaseService = {
  getUserId:               jest.fn(),
  getEventsFromFollowedUsers: jest.fn(),
  hasUnreadNotifications:     jest.fn(),
};

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), RouterTestingModule, HomePage],
      providers: [{ provide: SupabaseService, useValue: mockSupabaseService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture   = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
  });

  const resetMocksAndState = () => {
    jest.resetAllMocks();
    component.reset();
    component.userId = null;
  };

  it('creates the component', () => {
    resetMocksAndState();
    expect(component).toBeTruthy();
  });

  it('does NOT load events when getUserId() returns null', async () => {
    resetMocksAndState();
    mockSupabaseService.getUserId.mockResolvedValue(null);

    await component.ngOnInit();

    expect(mockSupabaseService.getEventsFromFollowedUsers).not.toHaveBeenCalled();
    expect(component.events).toEqual([]);
  });

  it('loads events on ngOnInit when userId exists', async () => {
    resetMocksAndState();
    mockSupabaseService.getUserId.mockResolvedValue('user123');
    mockSupabaseService.getEventsFromFollowedUsers.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    await component.ngOnInit();

    expect(component.userId).toBe('user123');
    expect(mockSupabaseService.getEventsFromFollowedUsers)
      .toHaveBeenCalledWith('user123', 5, 0);
    expect(component.events).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('appends events and increases offset on loadMoreEvents()', async () => {
    resetMocksAndState();
    component.userId = 'user123';
    mockSupabaseService.getEventsFromFollowedUsers
      .mockResolvedValue([{ id: 3 }, { id: 4 }]);

    await component.loadMoreEvents();

    expect(component.events).toEqual([{ id: 3 }, { id: 4 }]);
    expect(component.offset).toBe(5);
  });

  it('does NOT load more events if already loading', async () => {
    resetMocksAndState();
    component.userId = 'user123';
    component.loading = true;

    await component.loadMoreEvents();

    expect(mockSupabaseService.getEventsFromFollowedUsers).not.toHaveBeenCalled();
  });

  it('disables infinite scroll when fewer items than limit are returned', async () => {
    resetMocksAndState();
    component.userId = 'user123';
    const ev = { target: { complete: jest.fn(), disabled: false } };

    mockSupabaseService.getEventsFromFollowedUsers.mockResolvedValue([{ id: 1 }]);

    await component.loadMoreEvents(ev);

    expect(ev.target.complete).toHaveBeenCalled();
    expect(ev.target.disabled).toBe(true);
  });

  it('resets state and loads events on ionViewWillEnter()', async () => {
    resetMocksAndState();
    mockSupabaseService.getUserId.mockResolvedValue('user456');
    mockSupabaseService.getEventsFromFollowedUsers.mockResolvedValue([{ id: 1 }]);
    mockSupabaseService.hasUnreadNotifications.mockResolvedValue(true);

    await component.ionViewWillEnter();

    expect(component.events).toEqual([{ id: 1 }]);
    expect(component.offset).toBe(5);
    expect(component.hasUnread).toBe(true);
  });

  it('reset() clears events, offset and loading', () => {
    resetMocksAndState();
    component.events  = [{ id: 1 }];
    component.offset  = 10;
    component.loading = true;

    component.reset();

    expect(component.events).toEqual([]);
    expect(component.offset).toBe(0);
    expect(component.loading).toBe(false);
  });
});
