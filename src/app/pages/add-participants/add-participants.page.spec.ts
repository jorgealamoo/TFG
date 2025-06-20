import {ActivatedRoute} from "@angular/router";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {AddParticipantsPage} from "./add-participants.page";
import {IonicModule} from "@ionic/angular";
import {SupabaseService} from "../../services/supabase.service";
import {NO_ERRORS_SCHEMA} from "@angular/core";

const supabaseMock = {
  getUserId:              jest.fn(),
  getEventMoreInfo:       jest.fn(),
  getFollowingByUserId:   jest.fn(),
  getEventTitleById:      jest.fn(),
  sendEventInvitations:   jest.fn(),
  searchUsersByUsername:  jest.fn(),
};

const activatedRouteMock = {
  snapshot: { paramMap: { get: () => 'e1' } },
} as unknown as ActivatedRoute;

const flush = () => new Promise(r => setTimeout(r));

describe('AddParticipantsPage', () => {
  let fixture: ComponentFixture<AddParticipantsPage>;
  let component: AddParticipantsPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), AddParticipantsPage],
      providers: [
        { provide: SupabaseService, useValue: supabaseMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture   = TestBed.createComponent(AddParticipantsPage);
    component = fixture.componentInstance;
  });

  afterEach(() => jest.clearAllMocks());

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('ionViewWillEnter loads participants and filters following list', async () => {
    const followers   = [{ id: 'f1' }, { id: 'f2' }, { id: 'u3' }];
    const participants = [{ id: 'f1' }];

    supabaseMock.getUserId.mockResolvedValue('u1');
    supabaseMock.getEventMoreInfo.mockResolvedValue({ participants });
    supabaseMock.getFollowingByUserId.mockResolvedValue(followers);

    await component.ionViewWillEnter();
    await flush();

    expect(component.eventId).toBe('e1');
    expect(component.participants).toEqual(participants);
    expect(component.foundUsers).toEqual([{ id: 'f2' }, { id: 'u3' }]);
  });

  it('onSearch excludes already selected and existing participants', async () => {
    component.selectedUsers = [{ id: 'sel' }];
    component.participants  = [{ id: 'part' }];

    supabaseMock.searchUsersByUsername.mockResolvedValue([
      { id: 'sel' }, { id: 'part' }, { id: 'open' },
    ]);

    await component.onSearch('x');
    await flush();

    expect(component.foundUsers).toEqual([{ id: 'open' }]);
  });

  it('onUserSelectionChange adds and removes users correctly', () => {
    const a = { id: 'a' };
    const b = { id: 'b' };
    component.foundUsers = [a, b];

    component.onUserSelectionChange({ selected: true }, a);
    expect(component.selectedUsers).toEqual([a]);
    expect(component.foundUsers).toEqual([b]);

    component.onUserSelectionChange({ selected: false }, a);
    expect(component.selectedUsers).toEqual([]);
    expect(component.foundUsers).toEqual(expect.arrayContaining([a]));
  });

  it('finalizeAddParticipants sends invitations and calls history.back', async () => {
    component.eventId = 'e2';
    component.userId  = 'u2';
    component.selectedUsers = [{ id: 'x' }];

    supabaseMock.getEventTitleById.mockResolvedValue('My Event');

    const backSpy = jest.spyOn(window.history, 'back').mockImplementation(jest.fn());

    await component.finalizeAddParticipants();
    await flush();

    expect(supabaseMock.sendEventInvitations).toHaveBeenCalledWith(
      [{ id: 'x' }],
      'e2',
      'My Event',
      'u2'
    );
    expect(backSpy).toHaveBeenCalled();
    backSpy.mockRestore();
  });

  it('finalizeAddParticipants does nothing if title not found', async () => {
    component.eventId = 'e3';
    component.selectedUsers = [];
    supabaseMock.getEventTitleById.mockResolvedValue(null);

    const backSpy = jest.spyOn(window.history, 'back').mockImplementation(jest.fn());

    await component.finalizeAddParticipants();
    await flush();

    expect(supabaseMock.sendEventInvitations).not.toHaveBeenCalled();
    expect(backSpy).toHaveBeenCalled();
    backSpy.mockRestore();
  });
});
