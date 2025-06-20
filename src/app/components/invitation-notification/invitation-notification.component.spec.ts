import {InvitationNotificationComponent} from "./invitation-notification.component";
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";
import {SupabaseService} from "../../services/supabase.service";
import {Router} from "@angular/router";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('InvitationNotificationComponent', () => {
  let component: InvitationNotificationComponent;
  let fixture: ComponentFixture<InvitationNotificationComponent>;
  let supabaseMock: any;
  let routerMock: any;

  beforeEach(waitForAsync(() => {
    supabaseMock = {
      markNotificationAsRead: jest.fn().mockResolvedValue(undefined),
      getUserId: jest.fn().mockResolvedValue('user-1'),
      joinEvent: jest.fn().mockResolvedValue(undefined),
      updateNotificationType: jest.fn().mockResolvedValue(undefined),
    };
    routerMock = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), InvitationNotificationComponent],
      providers: [
        { provide: SupabaseService, useValue: supabaseMock },
        { provide: Router, useValue: routerMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationNotificationComponent);
    component = fixture.componentInstance;
    component.notificationId = 'notif-123';
    component.notificationType = 'event_invitation';
    component.notificationData = { event_id: 'event-456' };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit marks notification read and sets eventId/userId when type is event_invitation', async () => {
    await component.ngOnInit();
    expect(supabaseMock.markNotificationAsRead).toHaveBeenCalledWith('notif-123');
    expect(component.eventId).toBe('event-456');
    expect(supabaseMock.getUserId).toHaveBeenCalled();
    expect(component.userId).toBe('user-1');
  });

  it('onAccept calls joinEvent and then updateNotificationType', async () => {
    component.eventId = 'event-456';
    component.userId = 'user-1';
    component.notificationType = 'event_invitation';

    component.onAccept();
    await Promise.resolve();
    expect(supabaseMock.joinEvent).toHaveBeenCalledWith('user-1', 'event-456');
    expect(supabaseMock.updateNotificationType).toHaveBeenCalledWith(
      'notif-123',
      'event_invitation_accepted'
    );
    expect(component.notificationType).toBe('event_invitation_accepted');
  });

  it('onAccept does nothing if eventId or userId missing', async () => {
    component.eventId = null;
    component.userId = null;
    component.notificationType = 'event_invitation';
    component.onAccept();
    expect(supabaseMock.joinEvent).not.toHaveBeenCalled();
    expect(supabaseMock.updateNotificationType).not.toHaveBeenCalled();
  });

  it('onDecline updates notificationType to declined', async () => {
    component.eventId = 'event-456';
    component.userId = 'user-1';
    component.notificationType = 'event_invitation';
    await component.onDecline();
    expect(supabaseMock.updateNotificationType).toHaveBeenCalledWith(
      'notif-123',
      'event_invitation_declined'
    );
    expect(component.notificationType).toBe('event_invitation_declined');
  });

  it('onDecline does nothing if eventId or userId missing', async () => {
    component.eventId = null;
    component.userId = null;
    await component.onDecline();
    expect(supabaseMock.updateNotificationType).not.toHaveBeenCalled();
  });

  it('goToEvent navigates when eventId is set', () => {
    component.eventId = 'event-456';
    component.goToEvent();
    expect(routerMock.navigate).toHaveBeenCalledWith(['event', 'event-456']);
  });

  it('goToEvent does nothing if eventId not set', () => {
    component.eventId = null;
    component.goToEvent();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
