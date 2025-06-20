import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {FooterComponent} from "./footer.component";
import {NavigationEnd, Router} from "@angular/router";
import {Subject} from "rxjs";
import {RouterTestingModule} from "@angular/router/testing";
import {IonicModule} from "@ionic/angular";

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let router: Router;
  let routerEvents$: Subject<any>;

  beforeEach(waitForAsync(() => {
    routerEvents$ = new Subject();

    TestBed.configureTestingModule({
      imports: [
        FooterComponent,
        RouterTestingModule.withRoutes([]),
        IonicModule.forRoot()
      ],
    }).compileComponents().then(() => {
      router = TestBed.inject(Router);
      Object.defineProperty(router, 'events', {
        get: () => routerEvents$.asObservable()
      });

      fixture = TestBed.createComponent(FooterComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentRoute from router.url', () => {
    expect(component.currentRoute).toBe(router.url);
  });

  it('should update currentRoute on NavigationEnd events', () => {
    routerEvents$.next(new NavigationEnd(0, '/from', '/to'));
    expect(component.currentRoute).toBe('/from');
  });

  it('selectTab should call router.navigate with the tab route', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const tab = { name: 'search', route: '/search' };

    component.selectTab(tab);

    expect(navigateSpy).toHaveBeenCalledWith(['/search']);
  });

  it('tabs array should contain the expected routes', () => {
    const routes = component.tabs.map(t => t.route);
    expect(routes).toEqual([
      '/my-events',
      '/create-event',
      '/home',
      '/search',
      '/my-profile'
    ]);
  });

  it('selectedTab defaults to "home"', () => {
    expect(component.selectedTab).toBe('home');
  });
});
