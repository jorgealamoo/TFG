import * as utils from '../../services/utils';
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {CreateEventPage} from "./create-event.page";
import {IonicModule} from "@ionic/angular";
import {EventFormDataService} from "../../services/event-form-data.service";
import {SupabaseService} from "../../services/supabase.service";
import {Router} from "@angular/router";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {Subject} from "rxjs";

const formDataMock = {
  setData: jest.fn(),
  getData: jest.fn().mockReturnValue({}),
};

const supabaseMock = {
  getUserId: jest.fn(),
};

const routerMock = {
  url: '/create-event',
  events: new Subject(),
  navigate: jest.fn(),
};

const flush = () => new Promise(r => setTimeout(r));

describe('CreateEventPage', () => {
  let fixture: ComponentFixture<CreateEventPage>;
  let component: CreateEventPage;

  beforeEach(async () => {
    jest.spyOn(utils, 'generateUUID').mockReturnValue('uuid‑123');

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), CreateEventPage],
      providers: [
        { provide: EventFormDataService, useValue: formDataMock },
        { provide: SupabaseService, useValue: supabaseMock },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEventPage);
    component = fixture.componentInstance;
  });

  afterEach(() => jest.clearAllMocks());

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('goToNextPage stores data and navigates when userId present', async () => {
    component.form.setValue({
      title: 'Party',
      description: 'Fun night',
      categories: ['Music'],
      location: 'Club',
      date: '2025‑06‑20',
      hour: '20:30',
      privacy: 'public',
    });

    supabaseMock.getUserId.mockResolvedValue('user‑1');

    await component.goToNextPage();
    await flush();

    expect(formDataMock.setData).toHaveBeenCalledWith('uuid', 'uuid‑123');
    expect(formDataMock.setData).toHaveBeenCalledWith('title', 'Party');
    expect(formDataMock.setData).toHaveBeenCalledWith('description', 'Fun night');
    expect(formDataMock.setData).toHaveBeenCalledWith('categories', ['Music']);
    expect(formDataMock.setData).toHaveBeenCalledWith('location', 'Club');
    expect(formDataMock.setData).toHaveBeenCalledWith('date', '2025‑06‑20');
    expect(formDataMock.setData).toHaveBeenCalledWith('hour', '20:30');
    expect(formDataMock.setData).toHaveBeenCalledWith('privacy', 'public');
    expect(formDataMock.setData).toHaveBeenCalledWith('creatorUser', 'user‑1');

    expect(routerMock.navigate).toHaveBeenCalledWith(['/create-event-shopping-list']);
  });

  it('goToNextPage stores data and navigates when no userId', async () => {
    component.form.setValue({
      title: 'Meeting',
      description: 'Work',
      categories: [],
      location: 'Office',
      date: '2025‑07‑01',
      hour: '09:00',
      privacy: 'private',
    });

    supabaseMock.getUserId.mockResolvedValue(null);

    await component.goToNextPage();
    await flush();

    expect(formDataMock.setData).not.toHaveBeenCalledWith('creatorUser', expect.anything());
    expect(routerMock.navigate).toHaveBeenCalledWith(['/create-event-shopping-list']);
  });

  it('touch helpers reflect control touched state', () => {
    const ctrl = component.form.controls.title;
    expect(component.isTitleTouched()).toBe(false);
    ctrl.markAsTouched();
    expect(component.isTitleTouched()).toBe(true);
  });
});
