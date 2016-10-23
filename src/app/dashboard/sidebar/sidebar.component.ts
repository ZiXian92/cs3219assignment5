import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { State } from '../../class/state';

@Component({
  selector: 'sidebar',
  templateUrl: 'sidebar.component.html'
})
export class SidebarComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  @Input() stateList: [State];

  logout() :void {
      this.userService.logout();
      this.router.navigate(['login']);
  }
}