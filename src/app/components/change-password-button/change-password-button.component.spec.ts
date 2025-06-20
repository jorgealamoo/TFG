import { ChangePasswordButtonComponent } from "./change-password-button.component";
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {AlertController, IonicModule} from "@ionic/angular";
import {SupabaseService} from "../../services/supabase.service";
import {showAlert} from "../../services/utils";

jest.mock('../../services/utils', () => ({
  showAlert: jest.fn()
}));

describe('ChangePasswordButtonComponent', () => {
  let component: ChangePasswordButtonComponent;
  let fixture: ComponentFixture<ChangePasswordButtonComponent>;
  let alertControllerMock: Partial<AlertController>;
  let supabaseServiceMock: Partial<SupabaseService>;

  beforeEach(waitForAsync(() => {
    alertControllerMock = {
      create: jest.fn()
    };

    supabaseServiceMock = {
      verifyCurrentPassword: jest.fn(),
      changePassword: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), ChangePasswordButtonComponent],
      providers: [
        { provide: AlertController, useValue: alertControllerMock },
        { provide: SupabaseService, useValue: supabaseServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordButtonComponent);
    component = fixture.componentInstance;
    jest.clearAllMocks();
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should show change password form when changePassword() is called', () => {
    expect(component.showChangePasswordForm).toBe(false);
    component.changePassword();
    expect(component.showChangePasswordForm).toBe(true);
  });

  it('should reset form and hide popup when closePopup() is called', () => {
    component.showChangePasswordForm = true;
    component.currentPassword = 'abc';
    component.newPassword = '123';
    component.confirmPassword = '123';

    component.closePopup();

    expect(component.showChangePasswordForm).toBe(false);
    expect(component.currentPassword).toBe('');
    expect(component.newPassword).toBe('');
    expect(component.confirmPassword).toBe('');
  });

  it('should show alert if new passwords do not match', async () => {
    component.currentPassword = 'current';
    component.newPassword = 'password1';
    component.confirmPassword = 'password2';

    (showAlert as jest.Mock).mockResolvedValue(undefined);

    await component.submitPasswordChange();

    expect(showAlert).toHaveBeenCalledWith(expect.anything(), "Invalid Passwords", "Passwords do not match.");
    expect(supabaseServiceMock.verifyCurrentPassword).not.toHaveBeenCalled();
  });

  it('should show alert if new password is too short', async () => {
    component.currentPassword = 'current';
    component.newPassword = '123';
    component.confirmPassword = '123';

    (showAlert as jest.Mock).mockResolvedValue(undefined);

    await component.submitPasswordChange();

    expect(showAlert).toHaveBeenCalledWith(expect.anything(), "Weak Password", "Password must be at least 6 characters long.");
    expect(supabaseServiceMock.verifyCurrentPassword).not.toHaveBeenCalled();
  });

  it('should show alert if current password verification fails', async () => {
    component.currentPassword = 'wrongpassword';
    component.newPassword = 'strongpassword';
    component.confirmPassword = 'strongpassword';

    (supabaseServiceMock.verifyCurrentPassword as jest.Mock).mockResolvedValue(false);
    (showAlert as jest.Mock).mockResolvedValue(undefined);

    await component.submitPasswordChange();

    expect(supabaseServiceMock.verifyCurrentPassword).toHaveBeenCalledWith('wrongpassword');
    expect(showAlert).toHaveBeenCalledWith(expect.anything(), "Incorrect Password", "The current password is incorrect.");
    expect(supabaseServiceMock.changePassword).not.toHaveBeenCalled();
  });

  it('should call changePassword and close popup on successful password change', async () => {
    component.currentPassword = 'correctpassword';
    component.newPassword = 'newstrongpassword';
    component.confirmPassword = 'newstrongpassword';

    (supabaseServiceMock.verifyCurrentPassword as jest.Mock).mockResolvedValue(true);
    (supabaseServiceMock.changePassword as jest.Mock).mockResolvedValue(undefined);

    const closePopupSpy = jest.spyOn(component, 'closePopup');

    await component.submitPasswordChange();

    expect(supabaseServiceMock.verifyCurrentPassword).toHaveBeenCalledWith('correctpassword');
    expect(supabaseServiceMock.changePassword).toHaveBeenCalledWith('newstrongpassword');
    expect(closePopupSpy).toHaveBeenCalled();
  });
});
