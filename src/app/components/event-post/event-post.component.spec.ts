import {EventPostComponent} from "./event-post.component";
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {SupabaseService} from "../../services/supabase.service";
import {Router} from "@angular/router";

describe('EventPostComponent', () => {
  let component: EventPostComponent;
  let fixture: ComponentFixture<EventPostComponent>;
  let supabaseServiceMock: any;
  let routerMock: any;

  const dummyEvent = {
    id: 'event123',
    creator_user: 'user456',
    images: ['image1.jpg', 'image2.jpg']
  };

  beforeEach(waitForAsync(() => {
    supabaseServiceMock = {
      getEventImageUrl: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [EventPostComponent],
      providers: [
        {provide: SupabaseService, useValue: supabaseServiceMock},
        {provide: Router, useValue: routerMock}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventPostComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load image URLs on ngOnInit if event has images', async () => {
    const mockUrls = ['https://cdn/image1.jpg', 'https://cdn/image2.jpg'];
    supabaseServiceMock.getEventImageUrl.mockImplementation((path: string) => {
      return Promise.resolve(`https://cdn/${path}`);
    });

    component.event = dummyEvent;

    await component.ngOnInit();

    expect(supabaseServiceMock.getEventImageUrl).toHaveBeenCalledTimes(2);
    expect(component.imagesUrls).toEqual(mockUrls);
  });

  it('should not load images if event has no images', async () => {
    component.event = { id: '1', images: [] };
    await component.ngOnInit();

    expect(supabaseServiceMock.getEventImageUrl).not.toHaveBeenCalled();
    expect(component.imagesUrls).toEqual([]);
  });

  it('should navigate to user profile on goToUserProfile', () => {
    component.event = dummyEvent;
    const eventMock = new MouseEvent('click');
    const stopPropagationSpy = jest.spyOn(eventMock, 'stopPropagation');

    component.goToUserProfile(eventMock);

    expect(stopPropagationSpy).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/profile', dummyEvent.creator_user]);
  });

  it('should not navigate to profile if user ID is missing', () => {
    component.event = { ...dummyEvent, creator_user: undefined };
    const eventMock = new MouseEvent('click');

    component.goToUserProfile(eventMock);

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to event detail on goToEvent', () => {
    component.event = dummyEvent;

    component.goToEvent();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/event', dummyEvent.id]);
  });

  it('should not navigate if event ID is missing', () => {
    component.event = { ...dummyEvent, id: null };

    component.goToEvent();

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should stop propagation when openMoreOptions is called', () => {
    const eventMock = new MouseEvent('click');
    const stopPropagationSpy = jest.spyOn(eventMock, 'stopPropagation');

    component.openMoreOptions(eventMock);

    expect(stopPropagationSpy).toHaveBeenCalled();
  });
});
