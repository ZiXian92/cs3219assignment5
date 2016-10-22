import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

import "../styles/bootstrap.min.css";
import "../styles/bootstrap-flex.min.css";
import "../styles/bootstrap-grid.min.css";
import "../styles/bootstrap-reboot.min.css";

// To import external JS libraries
// Heres to 3 hours of my time...
import "../../node_modules/chart.js/src/chart.js";

platformBrowserDynamic().bootstrapModule(AppModule);