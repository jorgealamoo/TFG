import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { LoginPage } from './login.page';
import {ReactiveFormsModule} from "@angular/forms";
import {SupabaseService} from "../../services/supabase.service";
import {Router} from "@angular/router";
import {AlertController} from "@ionic/angular";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>;
  let component: LoginPage;

  let supabaseMock: { signIn: jest.Mock };
  let routerMock: { navigate: jest.Mock };
  let alertCtrlMock: {
    create: jest.Mock<Promise<{ present: jest.Mock }>, any>;
  };

  beforeEach(
    waitForAsync(() => {
      supabaseMock = { signIn: jest.fn() };
      routerMock = { navigate: jest.fn() };
      alertCtrlMock = {
        create: jest.fn().mockResolvedValue({ present: jest.fn() }),
      };

      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, LoginPage],
        providers: [
          { provide: SupabaseService, useValue: supabaseMock },
          { provide: Router, useValue: routerMock },
          { provide: AlertController, useValue: alertCtrlMock },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(LoginPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit()', () => {
    it('should call signIn and navigate to /home when form is valid and credentials are correct', async () => {
      component.form.setValue({
        email: 'test@example.com',
        password: '123456',
      });
      supabaseMock.signIn.mockResolvedValue({ user: { id: '1' } });

      await component.onSubmit();

      expect(supabaseMock.signIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: '123456',
      });
      expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should show an alert when signIn fails', async () => {
      component.form.setValue({
        email: 'wrong@example.com',
        password: 'badpass',
      });
      supabaseMock.signIn.mockRejectedValue(new Error('invalid-login'));

      await component.onSubmit();

      expect(alertCtrlMock.create).toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should show an alert and not call signIn when form is invalid', async () => {
      component.form.setValue({ email: '', password: '' });

      await component.onSubmit();

      expect(supabaseMock.signIn).not.toHaveBeenCalled();
      expect(alertCtrlMock.create).toHaveBeenCalled();
    });
  });
});
