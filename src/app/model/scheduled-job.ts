export class ScheduledJob {
  public id: number;
  public jobID: number;
  // public machineID: number;
  public machineSerialNumber: string;
  public startTime: Date;
  public endTime: Date;
  public hoursFrequency: number;
  public isActive: Boolean;
  public gymId: number;
}
