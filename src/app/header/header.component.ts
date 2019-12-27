import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {DataStorageService} from '../shared/data-storage.service';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  isAuthenticated = false;
  navbarCollapsed = true;
  private userSub: Subscription;


  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(){
    this.userSub = this.authService.user.subscribe(
      user => {
        this.isAuthenticated = !!user;
      }
    );
  }

  toggleNavbarCollapsing() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }


  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
