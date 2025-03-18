import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "main", loadComponent: () => import("./first-test/first-test.page")
      .then(m => m.FirstTestPage)
  }
];
