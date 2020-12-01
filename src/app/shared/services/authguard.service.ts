import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CheckoutService } from './checkout.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {
  constructor(private checkoutService: CheckoutService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.checkoutService.isValid) {
      return true;
    } else {
      this.router.navigate(['cart'], {
        queryParams: {returnUrl: state.url}
      });
    }
  }


  // constructor(private routes: Router) { }
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): boolean {
  //   if (localStorage.getItem('UserDetails') != null) {
  //     return true;
  //   }
  //   else {
  //     this.routes.navigate(['/cart']);
  //     return false;
  //   }
  // }
}
