import {ComponentFixture, TestBed} from "@angular/core/testing";
import {NotificationsPage} from "./notifications.page";
import {IonicModule} from "@ionic/angular";
import {SupabaseService} from "../../services/supabase.service";
import {NO_ERRORS_SCHEMA} from "@angular/core";

const supabaseMock = {
  getNotificationsForUser: jest.fn(),
};

describe('NotificationsPage', () => {
  let fixture: ComponentFixture<NotificationsPage>;
  let component: NotificationsPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), NotificationsPage],
      providers: [
        { provide: SupabaseService, useValue: supabaseMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsPage);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load notifications on ionViewWillEnter', async () => {
    const mockNotifications = [
      { id: 1, message: 'Notification 1' },
      { id: 2, message: 'Notification 2' },
    ];
    supabaseMock.getNotificationsForUser.mockResolvedValue(mockNotifications);

    await component.ionViewWillEnter();

    expect(supabaseMock.getNotificationsForUser).toHaveBeenCalledTimes(1);
    expect(component.notifications).toEqual(mockNotifications);
  });

  it('should handle empty notifications', async () => {
    supabaseMock.getNotificationsForUser.mockResolvedValue([]);

    await component.ionViewWillEnter();

    expect(component.notifications).toEqual([]);
  });

  it('should handle error when loading notifications', async () => {
    const error = new Error('Failed to load');
    supabaseMock.getNotificationsForUser.mockRejectedValue(error);

    jest.spyOn(console, 'error').mockImplementation(() => {});

    await component.ionViewWillEnter();

    expect(supabaseMock.getNotificationsForUser).toHaveBeenCalled();
    expect(component.notifications).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(error);

    (console.error as jest.Mock).mockRestore();
  });
});
