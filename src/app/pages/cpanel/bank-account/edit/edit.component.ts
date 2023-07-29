import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BankAccountViewModel,
  CreateBankAccount,
  PatchBankAccount,
  UpdateBankAccount,
} from 'src/app/models/shared/bank-accounts';
import { AppBankAccountService } from 'src/app/services/bank-account.service';
import { MessageType } from 'src/app/services/MessageType';
import { AppToasterService } from 'src/app/services/toaster.service';
import { MSG } from 'src/app/utils/messages';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-bankAccount-edit',
  templateUrl: './edit.component.html',
})
export class AppBankAccountComponent implements OnInit {
  isEdit = false;
  id: number;
  form: FormGroup;
  isLoading = false;
  submitted = false;
  showEditable = false;
  isEditable = false;
  toggleEditableLoading = false;

  constructor(
    private toaster: AppToasterService,
    private formBuilder: FormBuilder,
    private service: AppBankAccountService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.params['id'];
    this.isEdit = !!this.id;

    if (authService.isModerator()) {
      this.showEditable = true;
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    if (this.isEdit) {
      let request = new UpdateBankAccount();
      request = { ...this.form.value };
      request.id = this.id;
      this.update(request);
    } else {
      let request = new CreateBankAccount();
      request = { ...this.form.value };
      this.create(request);
    }
  }

  toggleEditable() {
    this.toggleEditableLoading = true;
    let request = new PatchBankAccount();
    request.id = this.id;
    request.editable = !this.isEditable;

    this.service.patch(request).subscribe({
      next: (v) => {
        this.isEditable = request.editable;
        this.toggleEditableLoading = false;
      },
      error: (e) => {
        this.toggleEditableLoading = false;
        console.error(e);
      },
    });
  }

  update(request: UpdateBankAccount) {
    this.submitted = true;
    this.service.update(request).subscribe({
      next: (v) => {
        this.submitted = false;
        this.toaster.toast(MessageType.success, MSG.bankAccount.update.success);
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (e) => {
        this.submitted = false;
        console.error(e);
        this.toaster.toast(MessageType.error, MSG.bankAccount.update.error);
      },
    });
  }

  create(request: CreateBankAccount) {
    this.submitted = true;
    this.service.add(request).subscribe({
      next: (v) => {
        this.submitted = false;
        this.toaster.toast(MessageType.success, MSG.bankAccount.create.success);
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (e) => {
        this.submitted = false;
        console.error(e);
        this.toaster.toast(MessageType.error, MSG.bankAccount.create.error);
      },
    });
  }

  buildForm({ ...data }) {
    this.form = this.formBuilder.group({
      title: [data.title, [Validators.required]],
      ownerName: [data.ownerName, [Validators.required]],
      bankName: [data.bankName, [Validators.required]],
      accountNumber: [data.accountNumber, [Validators.required]],
      cardNumber: [data.cardNumber, null],
      sheba: [data.sheba, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.buildForm({});

    if (this.isEdit) {
      this.load();
    }
  }

  load() {
    this.isLoading = true;
    this.toaster.loadingMessage(MSG.bankAccount.loading);
    this.service.get(this.id).subscribe({
      next: (v) => {
        this.form.patchValue(v.data);
        this.isEditable = v.data.isEditable;
        this.isLoading = false;
      },
      error: (e) => {
        console.error(e);
        this.isLoading = false;
      },
      complete: () => {},
    });
  }

  
  onBack(){
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
