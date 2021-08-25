import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'node_modules/chart.js';
@Component({
  selector: 'app-members-chart',
  templateUrl: './members-chart.component.html',
  styleUrls: ['./members-chart.component.css'],
})
export class MembersChartComponent implements OnInit {
  @Input() canvasId: string = 'membersChart';
  
  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    const labels = this.months({ count: 7 });
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'My First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };

    const membersChart = new Chart(this.canvasId, {
      type: 'line',
      data: data,
    });
  }
  // TODO: add to utils:
  months(config) {
    var cfg = config || {};
    var count = cfg.count || 12;
    var section = cfg.section;
    var values = [];
    var i, value;

    for (i = 0; i < count; ++i) {
      value = this.MONTHS[Math.ceil(i) % 12];
      values.push(value.substring(0, section));
    }

    return values;
  }

  MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
}
