import {ComponentFixture, TestBed} from "@angular/core/testing";
import {MyProfilePage} from "./my-profile.page";
import {IonicModule} from "@ionic/angular";
import {RouterTestingModule} from "@angular/router/testing";
import {SupabaseService} from "../../services/supabase.service";
import {Router} from "@angular/router";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {Subject} from "rxjs";

const supabaseMock = {
  getUserId:                  jest.fn(),
  getUserProfileData:         jest.fn(),
  getMyCreatedEventsByUserId: jest.fn(),
};

const routerMock = {
  url: '/my-profile',
  events: new Subject(),
  navigate: jest.fn(),
};

describe('MyProfilePage', () => {
  let fixture: ComponentFixture<MyProfilePage>;
  let component: MyProfilePage;

  const clean = () => {
    jest.resetAllMocks();
    component.userId             = null;
    component.username           = 'username';
    component.nameAndSurname     = 'Name Surname';
    component.profileImage       = null;
    component.createdEventsCount = 0;
    component.followersCount     = 0;
    component.followingCount     = 0;
    component.userEvents         = [];
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), RouterTestingModule, MyProfilePage],
      providers: [
        { provide: SupabaseService, useValue: supabaseMock },
        { provide: Router,         useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture   = TestBed.createComponent(MyProfilePage);
    component = fixture.componentInstance;
  });


  it('creates the component', () => {
    clean();
    expect(component).toBeTruthy();
  });

  it('does nothing if no authenticated user on ionViewWillEnter', async () => {
    clean();
    supabaseMock.getUserId.mockResolvedValue(null);

    await component.ionViewWillEnter();

    expect(supabaseMock.getUserProfileData).not.toHaveBeenCalled();
    expect(component.userId).toBeNull();
  });

  it('does nothing if profile data is not found', async () => {
    clean();
    supabaseMock.getUserId.mockResolvedValue('u1');
    supabaseMock.getUserProfileData.mockResolvedValue(null);

    await component.ionViewWillEnter();

    expect(component.username).toBe('username');
    expect(supabaseMock.getMyCreatedEventsByUserId).not.toHaveBeenCalled();
  });

  it('loads profile data and events on ionViewWillEnter', async () => {
    clean();
    supabaseMock.getUserId.mockResolvedValue('u123');

    supabaseMock.getUserProfileData.mockResolvedValue({
      username:             'alice',
      name:                 'Alice',
      surname:              'Wonder',
      profile_image:        'img.png',
      createdEventsCount:   3,
      followersCount:       10,
      followingCount:       5,
    });

    supabaseMock.getMyCreatedEventsByUserId.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    await component.ionViewWillEnter();

    expect(component.userId).toBe('u123');
    expect(component.username).toBe('alice');
    expect(component.nameAndSurname).toBe('Alice Wonder');
    expect(component.profileImage).toBe('img.png');
    expect(component.createdEventsCount).toBe(3);
    expect(component.followersCount).toBe(10);
    expect(component.followingCount).toBe(5);
    expect(component.userEvents).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('openSettings navigates to /edit-profile', () => {
    clean();
    component.openSettings();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/edit-profile']);
  });
});
