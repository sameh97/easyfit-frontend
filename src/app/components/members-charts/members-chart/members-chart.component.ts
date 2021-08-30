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
    var myChart = new Chart("Chart", {
      type: 'bar',
      data: {
          labels: ['January','February','March','April','May','June','July','August','September','October','November','December'],
          datasets: [{
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3,20,9,4,8,5,6,],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
  }
}
