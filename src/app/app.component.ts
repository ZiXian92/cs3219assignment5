import { Component } from '@angular/core';

@Component({
    selector: 'git-guard',
    template: `
    	<div class="container body-container">
    		<router-outlet></router-outlet>
  		</div>
    `
})
export class AppComponent{}