import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';
import { Calendar } from 'primeng/calendar';
Calendar.prototype.getDateFormat = () => 'yy/mm/dd'; // Set the date format for the calendar component

// Suppress Chrome extension errors in development
if (typeof (window as any).chrome !== 'undefined' && (window as any).chrome.runtime) {
    const originalError = console.error;
    console.error = (...args: any[]) => {
        if (args[0]?.includes?.('Unchecked runtime.lastError')) {
            return;
        }
        originalError.apply(console, args);
    };
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
