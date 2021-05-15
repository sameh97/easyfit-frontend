import { Component, OnInit } from '@angular/core';
import { AppNotificationMessage } from 'src/app/model/app-notification-message';
import { MachineScheduledJob } from 'src/app/model/machine-scheduled-job';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { SocketTopics } from 'src/app/shared/util/socket-util';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.css'],
})
export class MachinesComponent implements OnInit {
  scheduledJob: MachineScheduledJob;

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.webSocketService
      .onMessage(SocketTopics.TOPIC_CLEAN_MACHINE)
      .subscribe((job: AppNotificationMessage) => {
        console.log(`Got the message from server: ${JSON.stringify(job)}`);
        this.scheduledJob = job.content as MachineScheduledJob;
      });
  }
}
