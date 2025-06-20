import {Subject} from "rxjs";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {CreateEventParticipantsPage} from "./create-event-participants.page";
import {IonicModule} from "@ionic/angular";
import {EventFormDataService} from "../../services/event-form-data.service";
import {SupabaseService} from "../../services/supabase.service";
import {Router} from "@angular/router";
import {NO_ERRORS_SCHEMA} from "@angular/core";

const formDataMock = {
  getData: jest.fn(),
  setData: jest.fn(),
};

const supabaseMock = {
  getUserId:            jest.fn(),
  getFollowingByUserId: jest.fn(),
  searchUsersByUsername: jest.fn(),
  createEvent:          jest.fn().mockResolvedValue({}),
  sendEventInvitations: jest.fn().mockResolvedValue({}),
  joinEvent:            jest.fn().mockResolvedValue({}),
};

const routerMock = {
  url: '/create-event-participants',
  events: new Subject(),
  navigate: jest.fn(),
};

const flush = () => new Promise(r => setTimeout(r));

describe('CreateEventParticipantsPage', () => {
  let fixture: ComponentFixture<CreateEventParticipantsPage>;
  let component: CreateEventParticipantsPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), CreateEventParticipantsPage],
      providers: [
        { provide: EventFormDataService, useValue: formDataMock },
        { provide: SupabaseService, useValue: supabaseMock },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEventParticipantsPage);
    component = fixture.componentInstance;
  });

  afterEach(() => jest.clearAllMocks());

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('redirects to /create-event if no uuid', async () => {
    formDataMock.getData.mockReturnValue({});
    await component.ngOnInit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/create-event']);
  });

  it('ngOnInit loads following users when uuid and user present', async () => {
    formDataMock.getData.mockReturnValue({ uuid: 'ev-1' });
    supabaseMock.getUserId.mockResolvedValue('u1');
    supabaseMock.getFollowingByUserId.mockResolvedValue([{ id: 'f1' }, { id: 'f2' }]);

    await component.ngOnInit();
    await flush();

    expect(component.eventUuid).toBe('ev-1');
    expect(component.userId).toBe('u1');
    expect(component.foundUsers).toEqual([{ id: 'f1' }, { id: 'f2' }]);
  });

  it('finalizeEventCreation stores data, calls services and navigates', async () => {
    component.eventUuid = 'ev-2';
    component.userId    = 'u2';
    component.selectedUsers = [{ id: 's1' }];
    component.maxParticipants = 30;
    component.maxParticipantsEnabled = true;

    formDataMock.getData.mockReturnValue({
      uuid: 'ev-2',
      title: 'Party',
    });

    await component.finalizeEventCreation();
    await flush();

    expect(formDataMock.setData).toHaveBeenCalledWith('maxParticipants', 30);
    expect(formDataMock.setData).toHaveBeenCalledWith('maxParticipantsEnabled', true);
    expect(supabaseMock.createEvent).toHaveBeenCalled();
    expect(supabaseMock.sendEventInvitations).toHaveBeenCalledWith(
      [{ id: 's1' }],
      'ev-2',
      'Party',
      'u2'
    );
    expect(supabaseMock.joinEvent).toHaveBeenCalledWith('u2', 'ev-2');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('onSearch filters out already selected users', async () => {
    component.selectedUsers = [{ id: 'sel' }];
    supabaseMock.searchUsersByUsername.mockResolvedValue([
      { id: 'sel' },
      { id: 'other' },
    ]);

    await component.onSearch('o');
    await flush();

    expect(component.foundUsers).toEqual([{ id: 'other' }]);
  });

  it('onUserSelectionChange adds and removes users properly', () => {
    const userA = { id: 'a' };
    const userB = { id: 'b' };
    component.foundUsers = [userA, userB];

    component.onUserSelectionChange({ selected: true }, userA);
    expect(component.selectedUsers).toEqual([userA]);
    expect(component.foundUsers).toEqual([userB]);

    component.onUserSelectionChange({ selected: false }, userA);
    expect(component.selectedUsers).toEqual([]);
    expect(component.foundUsers).toEqual(expect.arrayContaining([userA]));
  });
});
