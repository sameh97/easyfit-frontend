import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subscription } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { GroupTraining } from 'src/app/model/group-training';
import { Member } from 'src/app/model/member';
import { Trainer } from 'src/app/model/trainer';
import { MembersService } from 'src/app/services/members-service/members.service';
import { TrainersService } from 'src/app/services/trainers-service/trainers.service';
import { FormInputComponent } from 'src/app/shared/components/form-input/form-input.component';
import { GroupTrainingService } from './../../../services/group-training-service/group-training.service';
@Component({
  selector: 'app-add-group-training',
  templateUrl: './add-group-training.component.html',
  styleUrls: ['./add-group-training.component.css'],
})
export class AddGroupTrainingComponent
  extends FormInputComponent
  implements OnInit
{
  public defaultTime = [new Date().getHours(), 0, 0];
  addGroupTrainingForm: FormGroup;
  groupTraining: GroupTraining;
  members: Member[] = [];
  trainers: Trainer[] = [];
  groupTrainings: GroupTraining[] = [];
  showAvailability: boolean = false;
  trainerChooesn: boolean = false;

  // members dropdown
  membersDropdownList = [];
  selectedMembers = [];
  membersDropdownSettings: IDropdownSettings = {};

  // trainers dropdown
  trainersDropdownList = [];
  selectedTrainers = [];
  trainersDropdownSettings: IDropdownSettings = {};

  private subscriptions: Subscription[] = [];

  constructor(
    private membersService: MembersService,
    private trainersService: TrainersService,
    public dialogRef: MatDialogRef<AddGroupTrainingComponent>,
    private formBuilder: FormBuilder,
    private GroupTrainingService: GroupTrainingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.membersService.getAll().subscribe((members) => {
        this.members = members;

        for (let member of this.members) {
          const item: any = {
            item_id: member.id,
            item_text: `${member.firstName} ${member.lastName}`,
          };
          this.membersDropdownList.push(item);
        }

        this.membersDropdownList = [...this.membersDropdownList];
      })
    );

    this.subscriptions.push(
      this.trainersService.getAll().subscribe((trainers) => {
        this.trainers = trainers;

        for (let trainer of this.trainers) {
          const item: any = {
            item_id: trainer.id,
            item_text: `${trainer.firstName} ${trainer.lastName}`,
          };
          this.trainersDropdownList.push(item);
        }

        this.trainersDropdownList = [...this.trainersDropdownList];
      })
    );

    this.groupTraining = new GroupTraining();
    this.groupTraining.members = [];
    this.addGroupTrainingForm = this.formBuilder.group({
      // TODO: make the validators more relevant:

      startTime: ['', [Validators.required, this.checkDate]],
      description: ['', [Validators.required]],
      members: ['', [Validators.required]],
      trainerId: ['', [Validators.required]],
    });
    this.membersDropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.trainersDropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.subscriptions.push(
      this.GroupTrainingService.getAll().subscribe((trainings) => {
        this.groupTrainings = trainings;
      })
    );
  }

  public isTimeAvailable = (): boolean => {
    this.showAvailability = true;
    let res: boolean = true;

    for (let training of this.groupTrainings) {
      if (this.groupTraining.trainerId === training.trainerId) {
        const currTrainingStartTime = new Date(training.startTime);
        const trainingToEditStartTime = new Date(this.groupTraining.startTime);
        if (
          trainingToEditStartTime.getTime() === currTrainingStartTime.getTime()
        ) {
          res = false;
        }
      }
    }
    return res;
  };

  public create = (): Promise<void> => {
    if (!AppUtil.hasValue(this.groupTraining)) {
      AppUtil.showWarningMessage(
        `cannot create group training because there is a missing fields`
      );
      return;
    }

    this.subscriptions.push(
      this.GroupTrainingService.create(this.groupTraining).subscribe(
        () => {
          this.dialogRef.close();
        },
        (err: Error) => {
          AppUtil.showError(err);
        }
      )
    );
  };

  // member selection functions:
  onMemberSelect(item: any) {
    for (let member of this.members) {
      if (item.item_id === member.id) {
        this.groupTraining.members.push(member);
        break;
      }
    }
  }

  onSelectAllMembers(items: any) {
    this.groupTraining.members = this.members;
  }

  onMemberDeSelect(item: any) {
    for (let i = 0; i < this.groupTraining.members.length; i++) {
      if (item.item_id === this.groupTraining.members[i].id) {
        this.groupTraining.members.splice(i, 1);
        break;
      }
    }
  }

  onDeSelectAllMembers(items: any) {
    this.groupTraining.members = [];
  }

  //trainer selection functions:
  onTrainerSelect(item: any) {
    this.trainerChooesn = true;
    for (let trainer of this.trainers) {
      if (item.item_id === trainer.id) {
        this.groupTraining.trainerId = trainer.id;
      }
    }
  }

  onTrainerDeSelect(item: any) {
    this.trainerChooesn = false;
    this.groupTraining.trainerId = null;
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
