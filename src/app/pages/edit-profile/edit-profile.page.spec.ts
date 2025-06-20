import {ComponentFixture, TestBed} from "@angular/core/testing";
import {EditProfilePage} from "./edit-profile.page";
import {AlertController, IonicModule} from "@ionic/angular";
import {SupabaseService} from "../../services/supabase.service";
import {Router} from "@angular/router";
import {ChangeDetectorRef, NO_ERRORS_SCHEMA} from "@angular/core";
import * as utils from '../../services/utils';

const supabaseMock = {
  getUserId:            jest.fn(),
  getEditProfileData:   jest.fn(),
  updateProfile:        jest.fn(),
};

const routerMock = {
  navigate: jest.fn(),
};

const alertCtrlMock = {
  create: jest.fn().mockResolvedValue({ present: jest.fn() }),
};

const cdrMock = { detectChanges: jest.fn() };

const flush = () => new Promise(r => setTimeout(r));

describe('EditProfilePage', () => {
  let fixture: ComponentFixture<EditProfilePage>;
  let component: EditProfilePage;

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => 'blob:preview');
    global.URL.revokeObjectURL = jest.fn();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), EditProfilePage],
      providers: [
        { provide: SupabaseService, useValue: supabaseMock },
        { provide: Router, useValue: routerMock },
        { provide: AlertController, useValue: alertCtrlMock },
        { provide: ChangeDetectorRef, useValue: cdrMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProfilePage);
    component = fixture.componentInstance;
  });

  afterEach(() => jest.clearAllMocks());

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('loads profile data on ionViewWillEnter', async () => {
    supabaseMock.getUserId.mockResolvedValue('u1');
    supabaseMock.getEditProfileData.mockResolvedValue({
      profile_image: 'pic.png',
      email: 'a@b.com',
      name: 'Alice',
      surname: 'Smith',
      username: 'alice',
    });

    const detectSpy = jest.spyOn((component as any).cdr, 'detectChanges');

    await component.ionViewWillEnter();
    await flush();

    expect(component.userId).toBe('u1');
    expect(component.imagePreviewUrl).toBe('pic.png');
    expect(component.email).toBe('a@b.com');
    expect(detectSpy).toHaveBeenCalled();
  });

  it('ionViewWillEnter exits when no user', async () => {
    supabaseMock.getUserId.mockResolvedValue(null);
    await component.ionViewWillEnter();
    expect(supabaseMock.getEditProfileData).not.toHaveBeenCalled();
  });

  it('saveProfile validates empty username', async () => {
    component.username = '';
    const alertSpy = jest.spyOn(utils, 'showAlert').mockResolvedValue();
    await component.saveProfile();
    expect(alertSpy).toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it('saveProfile updates profile and navigates', async () => {
    component.userId = 'u1';
    component.username = 'bob';
    component.name = 'Bob';
    component.surname = 'Builder';
    component.profileImage = 'pic.png';

    await component.saveProfile();

    expect(supabaseMock.updateProfile).toHaveBeenCalledWith('u1', {
      username: 'bob',
      name: 'Bob',
      surname: 'Builder',
      profile_image: 'pic.png',
    });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/my-profile']);
  });

  it('onImageChange sets preview and revokes old blob', () => {
    component.imagePreviewUrl = 'blob:old';
    component.onImageChange(new File([''], 'new.png', { type: 'image/png' }));

    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:old');
    expect(component.profileImage).toBeInstanceOf(File);
    expect(component.imagePreviewUrl).toBe('blob:preview');
  });

  it('ngOnDestroy revokes blob preview', () => {
    component.imagePreviewUrl = 'blob:prev';
    component.ngOnDestroy();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:prev');
  });
});
