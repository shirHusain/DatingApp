import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { MemberUpdateParams } from 'src/app/_requestParametrs/member-update-params';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  member: Member;
  user: User;
  @HostListener('window:beforeunload') unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  constructor(
    private accounService: AccountService,
    private memberService: MembersService,
    private toastr: ToastrService
  ) {
    this.accounService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    this.memberService
      .getMember(this.user.username)
      .subscribe((member) => (this.member = member));
  }

  updateMember() {
    const introduction = this.member.introduction;
    const lookingFor = this.member.lookingFor;
    const interests = this.member.interests;
    const city = this.member.city;
    const country = this.member.country;
    const memberUpdateParams = {
      introduction,
      lookingFor,
      interests,
      city,
      country,
    } as MemberUpdateParams;
    this.memberService
      .updateMember(memberUpdateParams, this.member)
      .subscribe(() => {
        this.toastr.success('Profile updated successfully');
        this.editForm.reset(this.member);
      });
  }
}
