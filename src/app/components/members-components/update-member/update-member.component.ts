import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Member } from 'src/app/model/member';

@Component({
  selector: 'app-update-member',
  templateUrl: './update-member.component.html',
  styleUrls: ['./update-member.component.css'],
})
export class UpdateMemberComponent implements OnInit {
  updateMemberForm: FormGroup;
  member: Member;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.member = new Member();
    this.updateMemberForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', []],
      
    });
  }
}
