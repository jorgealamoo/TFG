import {ComponentFixture, TestBed} from "@angular/core/testing";
import {MyEventsPage} from "./my-events.page";
import {IonicModule} from "@ionic/angular";
import {RouterTestingModule} from "@angular/router/testing";
import {SupabaseService} from "../../services/supabase.service";
import {NO_ERRORS_SCHEMA} from "@angular/core";

const supabaseMock = {
  getUserId:        jest.fn(),
  getJoinedEvents:  jest.fn(),
};

describe('MyEventsPage', () => {
  let fixture: ComponentFixture<MyEventsPage>;
  let component: MyEventsPage;

  const clean = () => {
    jest.resetAllMocks();
    component.reset();
    component.userId = null;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        MyEventsPage,
      ],
      providers: [{ provide: SupabaseService, useValue: supabaseMock }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture   = TestBed.createComponent(MyEventsPage);
    component = fixture.componentInstance;
  });


  it('creates the component', () => {
    clean();
    expect(component).toBeTruthy();
  });

  it('does NOT load events if getUserId() returns null', async () => {
    clean();
    supabaseMock.getUserId.mockResolvedValue(null);

    await component.ngOnInit();

    expect(supabaseMock.getJoinedEvents).not.toHaveBeenCalled();
    expect(component.events).toEqual([]);
  });

  it('loads events on ngOnInit when userId exists', async () => {
    clean();
    supabaseMock.getUserId.mockResolvedValue('userABC');
    supabaseMock.getJoinedEvents.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    await component.ngOnInit();

    expect(component.userId).toBe('userABC');
    expect(supabaseMock.getJoinedEvents).toHaveBeenCalledWith(
      'userABC',
      'all',
      'date_desc',
      5,
      0,
    );
    expect(component.events).toEqual([{ id: 1 }, { id: 2 }]);
    expect(component.offset).toBe(5);
  });

  it('appends events and increases offset on loadMoreEvents()', async () => {
    clean();
    component.userId = 'userABC';
    supabaseMock.getJoinedEvents.mockResolvedValue([{ id: 3 }, { id: 4 }]);

    await component.loadMoreEvents();

    expect(component.events).toEqual([{ id: 3 }, { id: 4 }]);
    expect(component.offset).toBe(5);
  });

  it('does NOT load more events when loading flag is true', async () => {
    clean();
    component.userId = 'userABC';
    component.loading = true;

    await component.loadMoreEvents();

    expect(supabaseMock.getJoinedEvents).not.toHaveBeenCalled();
  });

  it('disables infinite scroll when fewer items than limit are returned', async () => {
    clean();
    component.userId = 'userABC';

    const scrollEvt = { target: { complete: jest.fn(), disabled: false } };
    supabaseMock.getJoinedEvents.mockResolvedValue([{ id: 9 }]);

    await component.loadMoreEvents(scrollEvt);

    expect(scrollEvt.target.complete).toHaveBeenCalled();
    expect(scrollEvt.target.disabled).toBe(true);
  });

  it('resets state and loads events on ionViewWillEnter()', async () => {
    clean();
    supabaseMock.getUserId.mockResolvedValue('userXYZ');
    supabaseMock.getJoinedEvents.mockResolvedValue([{ id: 7 }]);

    component.events = [{ id: 0 }];
    component.offset = 50;

    await component.ionViewWillEnter();

    expect(component.events).toEqual([{ id: 7 }]);
    expect(component.offset).toBe(5);
  });

  it('reset() clears events, offset and loading', () => {
    clean();
    component.events  = [{ id: 99 }];
    component.offset  = 15;
    component.loading = true;

    component.reset();

    expect(component.events).toEqual([]);
    expect(component.offset).toBe(0);
    expect(component.loading).toBe(false);
  });
});
