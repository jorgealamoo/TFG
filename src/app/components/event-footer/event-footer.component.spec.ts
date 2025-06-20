import {EventFooterComponent} from "./event-footer.component";
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";
import {SupabaseService} from "../../services/supabase.service";
import {Router} from "@angular/router";

const supabaseServiceMock = {
  getUserId: jest.fn(),
  getEventById: jest.fn(),
  joinEvent: jest.fn(),
};

const routerMock = {
  navigate: jest.fn(),
};

describe('EventFooterComponent', () => {
  let component: EventFooterComponent;
  let fixture: ComponentFixture<EventFooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), EventFooterComponent],
      providers: [
        { provide: SupabaseService, useValue: supabaseServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventFooterComponent);
    component = fixture.componentInstance;

    jest.clearAllMocks();
    component.eventId = 'test-event-id';
  });

  describe('ngOnInit', () => {
    it('should set joined=false and due="0.00" if user not logged in', async () => {
      supabaseServiceMock.getUserId.mockResolvedValue(null);

      await component.ngOnInit();

      expect(component.joined).toBe(false);
      expect(component.due).toBe('0.00');
    });

    it('should handle event not found', async () => {
      supabaseServiceMock.getUserId.mockResolvedValue('user-1');
      supabaseServiceMock.getEventById.mockResolvedValue(null);

      await component.ngOnInit();

      expect(component.event).toBeNull();
      expect(component.joined).toBe(false);
      expect(component.due).toBe('0.00');
    });

    it('should set joined and due correctly if user joined as creator', async () => {
      const event = {
        participants: ['user-1', 'user-2'],
        creator_user: 'user-1',
        split_costs_enabled: true,
        total_price: '100.00',
        entry_price: '25.00'
      };
      supabaseServiceMock.getUserId.mockResolvedValue('user-1');
      supabaseServiceMock.getEventById.mockResolvedValue(event);

      await component.ngOnInit();

      expect(component.joined).toBe(true);
      expect(component.due).toBe('0.00');
    });

    it('should calculate due correctly if user joined and split costs enabled', async () => {
      const event = {
        participants: ['user-1', 'user-2', 'user-3'],
        creator_user: 'user-9',
        split_costs_enabled: true,
        total_price: '90.00',
        entry_price: '30.00'
      };
      supabaseServiceMock.getUserId.mockResolvedValue('user-2');
      supabaseServiceMock.getEventById.mockResolvedValue(event);

      await component.ngOnInit();

      expect(component.joined).toBe(true);
      expect(component.due).toBe('30.00');
    });

    it('should set due to entry_price if split costs disabled', async () => {
      const event = {
        participants: ['user-2'],
        creator_user: 'user-9',
        split_costs_enabled: false,
        total_price: '90.00',
        entry_price: '50.00'
      };
      supabaseServiceMock.getUserId.mockResolvedValue('user-2');
      supabaseServiceMock.getEventById.mockResolvedValue(event);

      await component.ngOnInit();

      expect(component.joined).toBe(true);
      expect(component.due).toBe('50.00');
    });
  });

  describe('joinEvent', () => {
    it('should warn and do nothing if user not logged in', async () => {
      supabaseServiceMock.getUserId.mockResolvedValue(null);
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await component.joinEvent();

      expect(warnSpy).toHaveBeenCalledWith('User not logged in. Cannot join the event.');
      warnSpy.mockRestore();
    });

    it('should join event, update joined and due values', async () => {
      const userId = 'user-3';
      const initialEvent = {
        participants: ['user-1', 'user-2'],
        creator_user: 'user-9',
        split_costs_enabled: true,
        total_price: '90.00',
        entry_price: '30.00'
      };
      const updatedEvent = {
        participants: ['user-1', 'user-2', 'user-3'],
        creator_user: 'user-9',
        split_costs_enabled: true,
        total_price: '90.00',
        entry_price: '30.00'
      };

      supabaseServiceMock.getUserId.mockResolvedValue(userId);
      supabaseServiceMock.joinEvent.mockResolvedValue(undefined);
      supabaseServiceMock.getEventById.mockResolvedValueOnce(initialEvent).mockResolvedValueOnce(updatedEvent);

      const logSpy = jest.spyOn(console, 'log').mockImplementation();

      await component.ngOnInit();
      await component.joinEvent();

      expect(supabaseServiceMock.joinEvent).toHaveBeenCalledWith(userId, component.eventId);
      expect(component.joined).toBe(true);
      expect(component.due).toBe('30.00');
      expect(logSpy).toHaveBeenCalledWith('User successfully joined the event.');

      logSpy.mockRestore();
    });
  });

  describe('goToMoreInfo', () => {
    it('should navigate to event more info page', () => {
      component.goToMoreInfo();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/event-more-info', component.eventId]);
    });
  });
});
