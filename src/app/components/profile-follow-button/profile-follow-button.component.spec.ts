import {ProfileFollowButtonComponent} from "./profile-follow-button.component";
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";
import {SupabaseService} from "../../services/supabase.service";

describe('ProfileFollowButtonComponent', () => {
  let component: ProfileFollowButtonComponent;
  let fixture: ComponentFixture<ProfileFollowButtonComponent>;
  let supabaseMock: any;

  beforeEach(waitForAsync(() => {
    supabaseMock = {
      getUserId:    jest.fn().mockResolvedValue('me'),
      isFollowing:  jest.fn(),
      followUser:   jest.fn().mockResolvedValue(undefined),
      unfollowUser: jest.fn().mockResolvedValue(undefined),
    };

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), ProfileFollowButtonComponent],
      providers: [{ provide: SupabaseService, useValue: supabaseMock }],
    }).compileComponents();
  }));

  const initComponent = async (targetId: string, following = false) => {
    supabaseMock.isFollowing.mockResolvedValue(following);

    fixture = TestBed.createComponent(ProfileFollowButtonComponent);
    component = fixture.componentInstance;
    component.targetUserId = targetId;

    fixture.detectChanges();
    await fixture.whenStable();
  };

  it('should create', async () => {
    await initComponent('user-1');
    expect(component).toBeTruthy();
  });

  it('ngOnInit sets isFollowing=true when already following', async () => {
    supabaseMock.getUserId.mockResolvedValue('me');
    await initComponent('user-1', true);

    fixture = TestBed.createComponent(ProfileFollowButtonComponent);
    component = fixture.componentInstance;
    component.targetUserId = 'user-1';

    fixture.detectChanges();
    await component.ngOnInit();

    expect(supabaseMock.isFollowing).toHaveBeenCalledWith('me', 'user-1');
    expect(component.isFollowing).toBe(true);
    expect(component.followFlag).toBe('Following');
  });

  it('ngOnInit sets isFollowing=false when not following', async () => {
    await initComponent('user-1', false);

    expect(component.isFollowing).toBe(false);
    expect(component.followFlag).toBe('Follow');
  });

  it('ngOnInit exits when currentUserId equals targetUserId', async () => {
    await initComponent('me', false);

    expect(supabaseMock.isFollowing).not.toHaveBeenCalled();
    expect(component.followFlag).toBe('Follow');
    expect(component.isFollowing).toBe(false);
  });

  it('toggleFollow follows when not already following', async () => {
    await initComponent('user-2', false);

    const statusSpy = jest.fn();
    component.followStatusChanged.subscribe(statusSpy);

    await component.toggleFollow();

    expect(supabaseMock.followUser).toHaveBeenCalledWith('me', 'user-2');
    expect(statusSpy).toHaveBeenCalledWith('followed');
    expect(component.isFollowing).toBe(true);
    expect(component.followFlag).toBe('Following');
  });

  it('toggleFollow unfollows when already following', async () => {
    supabaseMock.getUserId.mockResolvedValue('me');
    supabaseMock.isFollowing.mockResolvedValue(true);

    fixture = TestBed.createComponent(ProfileFollowButtonComponent);
    component = fixture.componentInstance;
    component.targetUserId = 'user-3';

    fixture.detectChanges();
    await component.ngOnInit();

    const statusSpy = jest.fn();
    component.followStatusChanged.subscribe(statusSpy);

    await component.toggleFollow();

    expect(supabaseMock.unfollowUser).toHaveBeenCalledWith('me', 'user-3');
    expect(statusSpy).toHaveBeenCalledWith('unfollowed');
    expect(component.isFollowing).toBe(false);
    expect(component.followFlag).toBe('Follow');
  });

  it('toggleFollow does nothing if ids missing', async () => {
    await initComponent('user-4', false);
    component.currentUserId = null;
    supabaseMock.followUser.mockClear();

    await component.toggleFollow();

    expect(supabaseMock.followUser).not.toHaveBeenCalled();
  });
});
