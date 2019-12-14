import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  navbarCollapsed = true;
  @Output() featureSelected = new EventEmitter<string>();

  toggleNavbarCollapsing() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  constructor() { }

  onSelect(feature: string){
    this.featureSelected.emit(feature)
  }


}
