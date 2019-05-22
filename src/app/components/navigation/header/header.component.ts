import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  toggle = [true,false,false,false,false,false,false,false,false,false];
  constructor() { }

  ngOnInit() {
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.logout.emit();
  }

  changeFoco(index){
    this.toggle.forEach((a,i)=>{
      if(i == index)this.toggle[i] = true;
      if(i != index)this.toggle[i] = false;
    })
  }
}
