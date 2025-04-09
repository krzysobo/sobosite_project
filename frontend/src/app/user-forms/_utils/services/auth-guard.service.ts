import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { UserStateService } from './user-state-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(private userStateService: UserStateService,
      private router: Router) { 
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
      return this.pass_if_logged();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
      return this.pass_if_logged();
  }

  private pass_if_logged(): boolean {
    if(this.userStateService.is_logged()) {
      return true;
    }

    this.router.navigateByUrl("/login");
    return false;
  }
}
