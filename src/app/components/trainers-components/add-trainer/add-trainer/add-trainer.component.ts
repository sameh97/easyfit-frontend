import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { Trainer } from 'src/app/model/trainer';
import { TrainersService } from 'src/app/services/trainer-service/trainer.service';

@Component({
  selector: 'app-add-trainer',
  templateUrl: './add-trainer.component.html',
  styleUrls: ['./add-trainer.component.css']
})
export class AddTrainerComponent implements OnInit , OnDestroy {
  addTrainerForm: FormGroup;
  trainer:Trainer;
  private subscriptions : Subscription[] = [];
  
  constructor(
    private formBuilder : FormBuilder,
    private trainersService : TrainersService
    ) {}
  


    ngOnInit(): void {
      this.trainer = new Trainer();
      this.addTrainerForm = this.formBuilder.group({
        firstName : ['',[Validators.required, Validators.minLength(3)]],
          lastName: ['',[Validators.required]],
          email: ['',[Validators.required , Validators.email]],
          joinDate: ['',[Validators.required]],
          certificationDate :['',[Validators.required]],
          phone : ['',[Validators.required , Validators.minLength(4)]],
          gender: [Validators.required],
          address : ['',[Validators.required , Validators.minLength(3)]],
          birthDay: ['',[Validators.required]],
          imageURL: [''],
      });
    }


    public create = () : Promise<void> => {
      if(!AppUtil.hasValue(this.trainer)) {
        AppUtil.showWarningMessage(
          `cannot create trainer because there is a missing fields`
          );
          return;
      }

      if(!AppUtil.hasValue(this.trainer.imageURL)){
        this.addImgUrl();
      }

      this.subscriptions.push(
        this.trainersService.create(this.trainer).subscribe()
      );
    }

    ngOnDestroy(): void {
      AppUtil.releaseSubscriptions(this.subscriptions);
    }

    private addImgUrl() {
      this.trainer.imageURL =
        'https://cdn4.iconfinder.com/data/icons/diversity-v2-0-volume-05/64/fitness-trainer-black-male-512.png';
    }
  

}
