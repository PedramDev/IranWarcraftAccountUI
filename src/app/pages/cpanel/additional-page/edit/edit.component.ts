import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppAdditionalPageService } from 'src/app/services/additional-page.service';
import { MessageType } from 'src/app/services/MessageType';
import { AppToasterService } from 'src/app/services/toaster.service';
import { MSG } from 'src/app/utils/messages';
import {
  UpdateAdditionalPage
} from 'src/app/models/shared/additional-page';

import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { MyUploadAdapter } from "../../../../utils/ckeditor/myUploadAdapter";
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { CONSTANST } from 'src/app/utils/constanst';
import { MediaType } from "src/app/models/media/requests/MediaType";
import { AppMediaService } from 'src/app/services/media.service';
import { Observable } from 'rxjs';
import { Slugator } from 'src/app/utils/slugator';
import { PageStatus } from 'src/app/models/shared-models';

// https://stackoverflow.com/questions/46765197/how-to-enable-image-upload-support-in-ckeditor-5

@Component({
  selector: 'app-additional-page-edit',
  templateUrl: './edit.component.html',
  styles: [
    `
      nz-select {
        width: 100% !important;
      }
    `,
  ],
})
export class AppAdditionalPageComponent implements OnInit {
  fileList: NzUploadFile[] = [];
  mediaUrl : string;
  id: number;
  form: FormGroup;
  isLoading = false;
  submitted = false;
  public Editor = ClassicEditorBuild;
  public content = '';

  selectedAdditionalPageStatus:string;

  additionalPageStatusList=Object.keys(PageStatus);

  constructor(
    private toaster: AppToasterService,
    private formBuilder: FormBuilder,
    private service: AppAdditionalPageService,
    private mediaService : AppMediaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }
  
  public onCkChange( { editor }: ChangeEvent ) {
    if(editor != undefined){
      const content = editor.getData();
      this.form.controls['content'].setValue(content);
    }
  }

  onSubmit(): void {
    console.log(this.form.value);

    if (this.form.invalid) {
      return;
    }

      let request = new UpdateAdditionalPage();
      request = {...this.form.value}

      request.id = Number(this.id);

      this.update(request);
  }

  update(request: UpdateAdditionalPage) {
    this.submitted = true;
    this.service.update(request).subscribe({
      next: (v) => {
        this.submitted = false;
        this.toaster.toast(MessageType.success, MSG.additionalPage.update.success);
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (e) => {
        this.submitted = false;
        console.error(e);
        this.toaster.toast(MessageType.error, MSG.additionalPage.update.error);
      },
      complete: () => console.info('complete'),
    });
  }

  buildForm({ ...data }) {
    this.form = this.formBuilder.group({
      content: [data.content, [Validators.required]],
      status: [data.status, [Validators.required]],
      title: [data.title, [Validators.required]],
      description: [data.description, []],
      slug: [data.slug, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.buildForm({});
    this.load();

   this.mediaUrl = CONSTANST.routes.media +'/query'+'?type='+MediaType.AdditionalPageSingleImage+'&key='+this.id.toString()
  }


  load() {
    this.isLoading = true;
    this.toaster.loadingMessage(MSG.additionalPage.loading);
    this.service.get(this.id).subscribe({
      next: (v) => {

        this.form.patchValue(v.data.webPage);
       

        this.content = v.data.content;
        this.selectedAdditionalPageStatus = v.data.status;

        if(v.data.image != null){
          this.fileList = [{
            uid: v.data.image?.id.toString(),
            name: v.data.image?.name + v.data.image?.extension,
            status: 'done',
            url: CONSTANST.Front + v.data.image?.url
          }]
        }
        this.updateSlug();
        this.isLoading = false;
      },
      error: (e) => {
        console.error(e);
        this.isLoading = false;
      },
      complete: () => {},
    });
  }
  

  public selectedAdditionalPageStatusChanged(data:PageStatus) {
    this.form.controls['status'].setValue(data);
  }


  public onCkReady(editor: any) {
    
    editor.plugins.get("FileRepository").createUploadAdapter = (loader:any) => {
      return new MyUploadAdapter(loader,MediaType.AdditionalPageContentImage,this.id);
    };
    
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );

      
  }

  previewImage: string | undefined = '';
  previewVisible = false;

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file.preview) {
      file.preview = await this.mediaService.getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
  };
  
    handleRemove = (file: NzUploadFile) => new Observable<boolean>((obs) => {
      console.log(file);
      
      this.mediaService.delete(Number(file.uid), MediaType.AdditionalPageSingleImage).subscribe({
      next: (v) => {
        let index = this.fileList.findIndex(x=>x.uid==file.uid);
        this.fileList.splice(index,1);
        return true;
      },
      error: (e) => {
        console.error(e);
        return false;
      }
    });
  });
  slugOut = '';
  updateSlug(){
    this.slugOut = new Slugator().generate(this.form.controls['slug'].value);
  }

  onBack(){
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
