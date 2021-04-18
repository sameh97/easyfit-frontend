import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Member } from 'src/app/model/member';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css'],
})
export class AddMemberComponent implements OnInit {
  addMemberForm: FormGroup;
  member: Member;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.member = new Member();
    this.addMemberForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      description: ['', []],
    });
  }
}
