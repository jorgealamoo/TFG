import {SupabaseService} from "../services/supabase.service";
import {Router} from "@angular/router";
import {TestBed} from "@angular/core/testing";
import {authGuard} from "./auth.guard";

describe('authGuard', () => {
  let supabaseServiceMock: Partial<SupabaseService>;
  let routerMock: Partial<Router>;
  let navigateSpy: jest.SpyInstance;

  beforeEach(() => {
    supabaseServiceMock = {
      getUserId: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: SupabaseService, useValue: supabaseServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    navigateSpy = jest.spyOn(routerMock, 'navigate');
  });

  it('should allow activation when userId exists', async () => {
    (supabaseServiceMock.getUserId as jest.Mock).mockResolvedValue('user-123');

    const result = await TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any)
    );

    expect(result).toBe(true);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should deny activation and navigate to /login when userId does not exist', async () => {
    (supabaseServiceMock.getUserId as jest.Mock).mockResolvedValue(null);

    const result = await TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any)
    );

    expect(result).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
