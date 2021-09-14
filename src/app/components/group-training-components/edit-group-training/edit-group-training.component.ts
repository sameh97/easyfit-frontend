import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subscription } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { GroupTraining } from 'src/app/model/group-training';
import { Member } from 'src/app/model/member';
import { Trainer } from 'src/app/model/trainer';
import { GroupTrainingService } from 'src/app/services/group-training-service/group-training.service';
import { MembersService } from 'src/app/services/members-service/members.service';
import { TrainersService } from 'src/app/services/trainers-service/trainers.service';
import { FormInputComponent } from 'src/app/shared/components/form-input/form-input.component';

@Component({
  selector: 'app-edit-group-training',
  templateUrl: './edit-group-training.component.html',
  styleUrls: ['./edit-group-training.component.css'],
})
export class EditGroupTrainingComponent
  extends FormInputComponent
  implements OnInit, OnDestroy
{
  editGroupTrainingForm: FormGroup;
  private subscriptions: Subscription[] = [];
  allMembers: Member[] = [];
  allTrainers: Trainer[] = [];

  // members dropdown
  membersDropdownList = [];
  selectedMembers = [];
  membersDropdownSettings: IDropdownSettings = {};

  // trainers dropdown
  trainersDropdownList = [];
  selectedTrainers = [];
  trainersDropdownSettings: IDropdownSettings = {};

  constructor(
    private membersService: MembersService,
    private trainersService: TrainersService,
    @Inject(MAT_DIALOG_DATA) private groupTraining: GroupTraining,
    private formBuilder: FormBuilder,
    private groupTrainingService: GroupTrainingService,
    public dialogRef: MatDialogRef<EditGroupTrainingComponent>
  ) {
    super();
  }

  ngOnInit(): void {
    this.fillMembersSelectionList();
    this.fillTrainersSelectionList();
  }

  private buildForm = (): void => {
    this.editGroupTrainingForm = this.formBuilder.group({
      // TODO: make the validators more relevant:
      startTime: [this.groupTraining.startTime, [Validators.required]],
      description: [this.groupTraining.description, [Validators.required]],
      members: [this.groupTraining.members, [Validators.required]],
      trainerId: [this.groupTraining.trainerId, [Validators.required]],
    });
  };

  private fillMembersSelectionList = (): void => {
    this.subscriptions.push(
      this.membersService.getAll().subscribe((members) => {
        this.allMembers = members;

        for (let member of this.allMembers) {
          const item: any = {
            item_id: member.id,
            item_text: `${member.firstName} ${member.lastName}`,
          };
          this.membersDropdownList.push(item);
        }

        this.membersDropdownList = [...this.membersDropdownList];
      })
    );

    this.membersDropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.groupTraining.members.forEach((member) => {
      const item: any = {
        item_id: member.id,
        item_text: `${member.firstName} ${member.lastName}`,
      };

      this.selectedMembers.push(item);
    });

    this.membersDropdownList = [...this.membersDropdownList];
  };

  private fillTrainersSelectionList = (): void => {
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
      this.trainersService.getAll().subscribe((trainers) => {
        this.allTrainers = trainers;

        for (let trainer of this.allTrainers) {
          const item: any = {
            item_id: trainer.id,
            item_text: `${trainer.firstName} ${trainer.lastName}`,
          };
          this.trainersDropdownList.push(item);
        }

        this.trainersDropdownList = [...this.trainersDropdownList];

        // find the selected trainer:
        for (const trainer of this.allTrainers) {
          if (trainer.id === this.groupTraining.trainerId) {
            const item: any = {
              item_id: trainer.id,
              item_text: `${trainer.firstName} ${trainer.lastName}`,
            };

            this.selectedTrainers.push(item);
            this.trainersDropdownList = [...this.trainersDropdownList];
            // after finding the selected trainer then build the form:
            this.buildForm();
            break;
          }
        }
      })
    );
  };

  // member selection functions:
  onMemberSelect(item: any) {
    for (let member of this.allMembers) {
      if (item.item_id === member.id) {
        this.groupTraining.members.push(member);
        break;
      }
    }
  }

  onSelectAllMembers(items: any) {
    this.groupTraining.members = this.allMembers;
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
    for (let trainer of this.allTrainers) {
      if (item.item_id === trainer.id) {
        this.groupTraining.trainerId = trainer.id;
      }
    }
  }

  onTrainerDeSelect(item: any) {
    this.groupTraining.trainerId = null;
  }

  public update = (): Promise<void> => {
    if (!AppUtil.hasValue(this.groupTraining)) {
      AppUtil.showWarningMessage(
        `cannot update training because there is a missing fields`
      );
      return;
    }

    this.subscriptions.push(
      this.groupTrainingService.update(this.groupTraining).subscribe(
        (catalog) => {
          this.dialogRef.close();
        },
        (err: Error) => {
          AppUtil.showError(err);
        }
      )
    );
  };

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
