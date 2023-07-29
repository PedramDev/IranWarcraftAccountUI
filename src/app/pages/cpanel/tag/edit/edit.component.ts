import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateTag } from 'src/app/models/blog/tag';
import { AppTagService } from 'src/app/services/tag.service';
import { MessageType } from 'src/app/services/MessageType';
import { AppToasterService } from 'src/app/services/toaster.service';
import { MSG } from 'src/app/utils/messages';
import { Slugator } from 'src/app/utils/slugator';

@Component({
  selector: "app-tag-edit",
  templateUrl: "./edit.component.html"
})
export class AppTagComponent implements OnInit {
  isEdit = false;
  id: number;
  form: FormGroup;
  isLoading = false;
  submitted = false;


  constructor(
    private toaster: AppToasterService,
    private formBuilder: FormBuilder,
    private service: AppTagService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.id = this.route.snapshot.params['id'];
    this.isEdit = !!this.id;
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit(): void {

    if (this.form.invalid) {
      return;
    }

    if (this.isEdit) {

      let request = new UpdateTag();
      request = { ...this.form.value };
      request.id = this.id;
      this.update(request);
    }

  }


  update(request: UpdateTag) {
    console.log(request);

    this.submitted = true;
    this.service.update(request).subscribe({
      next: (v) => {
        this.submitted = false;
        this.toaster.toast(MessageType.success, MSG.tag.update.success);
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (e) => {
        this.submitted = false;
        console.error(e)
        this.toaster.toast(MessageType.error, MSG.tag.update.error);
      },
      complete: () => console.info('complete')
    });
  }


  buildForm({ ...data }) {
    console.log(data);
    this.form = this.formBuilder.group({
      name: [data.name, [Validators.required]],
      title: [data.title, [Validators.required]],
      description: [data.description, []],
      slug: [data.slug, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.buildForm({});

    if (this.isEdit) {
      this.load()
    }

  }

  load() {
    this.isLoading = true;
    this.toaster.loadingMessage(MSG.tag.loading);
    this.service.get(this.id).subscribe({
      next: (v) => {
        this.form.patchValue(v.data);
        this.form.patchValue(v.data.webPage);
        this.isLoading = false;
        this.updateSlug();
      },
      error: (e) => {
        console.error(e);
        this.isLoading = false;
      },
      complete: () => { }
    })
  }
  slugOut = '';
  updateSlug() {
    this.slugOut = new Slugator().generate(this.form.controls['slug'].value);
  }

  
  onBack(){
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}


