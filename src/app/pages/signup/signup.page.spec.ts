import {SignupPage} from "./signup.page";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {SupabaseService} from "../../services/supabase.service";
import {AlertController} from "@ionic/angular";
import {Router} from "@angular/router";

const supabaseServiceMock = {
  signUp: jest.fn(),
};

const alertControllerMock = {
  create: jest.fn().mockResolvedValue({
    present: jest.fn(),
  }),
};

const routerMock = {
  navigate: jest.fn(),
};

describe('SignupPage', () => {
  let component: SignupPage;
  let fixture: ComponentFixture<SignupPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupPage],
      providers: [
        { provide: SupabaseService, useValue: supabaseServiceMock },
        { provide: AlertController, useValue: alertControllerMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as invalid if empty', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should validate password mismatch in repeatPassword', () => {
    const passwordControl = component.form.controls['password'];
    const repeatPasswordControl = component.form.controls['repeatPassword'];

    passwordControl.setValue('123456');
    repeatPasswordControl.setValue('654321');

    repeatPasswordControl.updateValueAndValidity();

    const errors = repeatPasswordControl.errors || {};
    expect(errors['notSame']).toBe(true);
  });

  it('should call supabaseService.signUp and navigate on valid submit', async () => {
    component.form.setValue({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      repeatPassword: 'password123',
    });

    supabaseServiceMock.signUp.mockResolvedValue({ user: 'someUser' });

    await component.onSubmit();

    expect(supabaseServiceMock.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      repeatPassword: 'password123',
    });

    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show alert if passwords do not match on submit', async () => {
    component.form.setValue({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      repeatPassword: 'wrongpassword',
    });

    component.form.controls['repeatPassword'].setErrors(null);

    jest.spyOn(component.form, 'valid', 'get').mockReturnValue(true);

    await component.onSubmit();

    expect(alertControllerMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        header: 'Error',
        message: 'Passwords do not match',
      })
    );
  });

  it('should show alert if form invalid on submit', async () => {
    component.form.setValue({
      email: '',
      username: '',
      password: '',
      repeatPassword: '',
    });

    await component.onSubmit();

    expect(alertControllerMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        header: 'Invalid Form',
        message: 'Please fill all required fields.',
      })
    );
  });

  it('should show alert on signup error', async () => {
    component.form.setValue({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      repeatPassword: 'password123',
    });

    supabaseServiceMock.signUp.mockRejectedValue(new Error('Signup failed'));

    await component.onSubmit();

    expect(alertControllerMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        header: 'Signup Error',
        message: 'Signup failed',
      })
    );
  });
});
