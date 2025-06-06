import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {SupabaseService} from "../services/supabase.service";

export const authGuard: CanActivateFn = async () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  const userId = await supabaseService.getUserId();

  if (userId) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
