import {BehaviorSubject, Subject} from "rxjs";
import {ActivatedRoute, convertToParamMap, NavigationEnd, ParamMap, Router} from "@angular/router";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ProfilePage} from "./profile.page";
import {IonicModule} from "@ionic/angular";
import {SupabaseService} from "../../services/supabase.service";
import {NO_ERRORS_SCHEMA} from "@angular/core";

const supabaseMock = {
  getUserId: jest.fn(),
  getUserProfileData: jest.fn(),
  getCreatedEventsByUserId: jest.fn(),
};

const routerMock = {
  url: '/profile/u123',
  events: new Subject<NavigationEnd>(),
  navigate: jest.fn(),
};

const param$ = new BehaviorSubject<ParamMap>(
  convertToParamMap({ userId: 'u123' }),
);

const activatedRouteMock = { paramMap: param$.asObservable() };

const flushPromises = () => new Promise(r => setTimeout(r));

describe('ProfilePage', () => {
  let fixture: ComponentFixture<ProfilePage>;
  let component: ProfilePage;

  const resetState = () => {
    jest.resetAllMocks();
    component.reset();
    component.userId = undefined as any;
    component.username = 'username';
    component.nameAndSurname = 'Name Surname';
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), ProfilePage],
      providers: [
        { provide: SupabaseService, useValue: supabaseMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
  });

  it('creates the component', () => {
    resetState();
    expect(component).toBeTruthy();
  });

  it('navigates to /my-profile when viewing own profile', async () => {
    resetState();
    supabaseMock.getUserId.mockResolvedValue('u123');

    component.ngOnInit();
    await flushPromises();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/my-profile']);
    expect(supabaseMock.getUserProfileData).not.toHaveBeenCalled();
  });

  it('loads profile data and events for another user', async () => {
    resetState();
    supabaseMock.getUserId.mockResolvedValue('me');
    supabaseMock.getUserProfileData.mockResolvedValue({
      username: 'bob',
      name: 'Bob',
      surname: 'Builder',
      profile_image: 'pic.png',
      followersCount: 4,
      followingCount: 2,
    });
    supabaseMock.getCreatedEventsByUserId.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    component.ngOnInit();
    await flushPromises();

    expect(component.username).toBe('bob');
    expect(component.nameAndSurname).toBe('Bob Builder');
    expect(component.profileImage).toBe('pic.png');
    expect(component.followersCount).toBe(4);
    expect(component.followingCount).toBe(2);
    expect(component.userEvents).toEqual([{ id: 1 }, { id: 2 }]);
    expect(component.createdEventsCount).toBe(2);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('navigates to /home when profile data not found', async () => {
    resetState();
    supabaseMock.getUserId.mockResolvedValue('me');
    supabaseMock.getUserProfileData.mockResolvedValue(null);

    component.ngOnInit();
    await flushPromises();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('navigates to /home on service error', async () => {
    resetState();
    supabaseMock.getUserId.mockResolvedValue('me');
    supabaseMock.getUserProfileData.mockRejectedValue(new Error('Oops'));

    component.ngOnInit();
    await flushPromises();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('onFollowStatusChanged increases/decreases followersCount', () => {
    component.followersCount = 5;

    component.onFollowStatusChanged('followed');
    expect(component.followersCount).toBe(6);

    component.onFollowStatusChanged('unfollowed');
    expect(component.followersCount).toBe(5);

    component.onFollowStatusChanged('unfollowed');
    component.onFollowStatusChanged('unfollowed');
    expect(component.followersCount).toBe(3);
  });

  it('ionViewWillEnter resets state', async () => {
    component.userEvents = [{ id: 1 }];
    component.followersCount = 10;
    component.followingCount = 10;
    component.createdEventsCount = 5;
    component.profileImage = 'x.png';

    await component.ionViewWillEnter();

    expect(component.userEvents).toEqual([]);
    expect(component.followersCount).toBe(0);
    expect(component.followingCount).toBe(0);
    expect(component.createdEventsCount).toBe(0);
    expect(component.profileImage).toBeNull();
  });
});
