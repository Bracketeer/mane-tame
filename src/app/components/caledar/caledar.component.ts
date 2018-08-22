import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-caledar',
  templateUrl: './caledar.component.html',
  styleUrls: ['./caledar.component.sass']
})
export class CaledarComponent implements OnInit {

  constructor() { }
  months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  date = new Date();
  firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
  lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
  gridsize: number;
  monthgrid = new Array(this.firstDay + this.lastDay <= 35 ? 35 : 42).map((day, index) => index);
  currentMonth: number;
  displayMonth: number;
  currentYear: number;
  currentDay: number;
  highlightedDay: number;
  newDate(val){
    this.displayMonth = this.displayMonth + val;
    this.date = new Date(this.currentYear, this.displayMonth, this.currentDay);
    this.firstDay = new Date(this.currentYear, this.displayMonth, 1).getDay();
    this.lastDay = new Date(this.currentYear, this.displayMonth + 1, 0).getDate();
    this.monthgrid = new Array(this.firstDay + this.lastDay <= 35 ? 35 : 42).map((day, index) => index);
    if(this.displayMonth > 11){ 
      this.displayMonth = 0
      this.currentYear = this.currentYear + 1;
    };
    if(this.displayMonth < 0){
      this.displayMonth = 11;
      this.currentYear = this.currentYear - 1;
    };
  }
  getGridSize(){
    console.log(this.firstDay + this.lastDay)
    return 
  }
  ngOnInit() {
    this.currentMonth = this.date.getMonth();
    this.displayMonth = this.date.getMonth();
    this.currentYear = this.date.getFullYear();
    this.currentDay = this.date.getDate();
    this.gridsize = this.firstDay + this.lastDay <= 35 ? 35 : 42;
  }

}
