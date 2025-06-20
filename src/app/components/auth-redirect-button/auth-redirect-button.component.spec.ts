import {ComponentFixture, TestBed} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";
import {AuthRedirectButtonComponent} from "./auth-redirect-button.component";
import {Router} from "@angular/router";

describe('AuthRedirectButtonComponent', () => {
  let component: AuthRedirectButtonComponent;
  let fixture: ComponentFixture<AuthRedirectButtonComponent>;
  let routerMock: Partial<Router>;

  beforeEach(async () => {
    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), AuthRedirectButtonComponent],
      providers: [
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthRedirectButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should navigate to /login by default when onClick is called', () => {
    component.redirectTo = 'login';
    component.onClick();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to /signup when redirectTo is signup and onClick is called', () => {
    component.redirectTo = 'signup';
    component.onClick();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/signup']);
  });
});
