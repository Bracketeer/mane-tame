import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-day-overview',
  templateUrl: './day-overview.component.html',
  styleUrls: ['./day-overview.component.sass']
})
export class DayOverviewComponent implements OnInit {

  constructor() { }
  enlarge = false;
  hours = new Array(24).map((hour, index) => index);
  ngOnInit() {
  }

}
