import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './appmodule';

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
