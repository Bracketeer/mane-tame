import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { DayOverviewComponent } from './components/calendar/day-overview/day-overview.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    DayOverviewComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
