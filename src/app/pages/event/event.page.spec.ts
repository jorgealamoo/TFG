import {BehaviorSubject} from "rxjs";
import {ActivatedRoute, convertToParamMap, ParamMap, Router} from "@angular/router";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {EventPage} from "./event.page";
import {IonicModule} from "@ionic/angular";
import {SupabaseService} from "../../services/supabase.service";
import {NO_ERRORS_SCHEMA} from "@angular/core";

const supabaseMock = {
  getEventById:         jest.fn(),
  getEventImageUrl:     jest.fn((p: string) => `url/${p}`),
  getUserProfileImage:  jest.fn(),
  getUsernameById:      jest.fn(),
};

const routerMock = {
  navigate: jest.fn(),
};

const param$ = new BehaviorSubject<ParamMap>(
  convertToParamMap({ id: 'e1' }),
);

const activatedRouteMock = {
  paramMap: param$.asObservable(),
};

const mockEvent = {
  id: 'e1',
  title: 'Party',
  hour: '19:30:00',
  images: ['a.jpg', 'b.jpg'],
  creator_user: 'u99',
};

describe('EventPage', () => {
  let fixture: ComponentFixture<EventPage>;
  let component: EventPage;

  const flushPromises = () => new Promise(r => setTimeout(r));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), EventPage],
      providers: [
        { provide: SupabaseService, useValue: supabaseMock },
        { provide: Router,         useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture   = TestBed.createComponent(EventPage);
    component = fixture.componentInstance;
  });

  afterEach(() => jest.clearAllMocks());

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('loads event details on ionViewWillEnter', async () => {
    supabaseMock.getEventById.mockResolvedValue(mockEvent);
    supabaseMock.getUserProfileImage.mockResolvedValue('avatar.png');
    supabaseMock.getUsernameById.mockResolvedValue('alice');

    await component.ionViewWillEnter();
    await flushPromises();

    expect(component.event).toEqual(mockEvent);
    expect(component.imageUrls).toEqual(['url/a.jpg', 'url/b.jpg']);
    expect(component.creatorProfileImageUrl).toBe('avatar.png');
    expect(component.creatorUsername).toBe('alice');
  });

  it('formattedHour returns HH:MM', () => {
    component.event = { hour: '08:15:20' } as any;
    expect(component.formattedHour).toBe('08:15');
  });

  it('formattedHour returns null if event/hour missing', () => {
    component.event = undefined as any;
    expect(component.formattedHour).toBeNull();
  });

  it('goToUserProfile navigates to creator profile', () => {
    component.event = { creator_user: 'u42' } as any;
    component.goToUserProfile();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/profile', 'u42']);
  });

  it('does nothing if route id param missing', async () => {
    param$.next(convertToParamMap({}));
    await component.ionViewWillEnter();
    await flushPromises();
    expect(supabaseMock.getEventById).not.toHaveBeenCalled();
  });
});
