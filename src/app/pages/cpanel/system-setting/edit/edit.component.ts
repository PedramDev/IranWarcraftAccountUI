import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {  SystemSettingViewModel ,UpdateSystemSetting } from 'src/app/models/shared/system-setting';
import { AppSystemSettingService } from 'src/app/services/system-setting.service';
import { MessageType } from 'src/app/services/MessageType';
import { AppToasterService } from 'src/app/services/toaster.service';
import { MSG } from 'src/app/utils/messages';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { CommentStatus } from 'src/app/models/blog/comment/enums/CommentStatus';
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
  selector: 'app-systemSetting-edit',
  templateUrl: './edit.component.html',
  styles: [
    `
      nz-select {
        width: 100% !important;
      }
    `,
  ],
})
export class AppSystemSettingComponent implements OnInit {
  fileList: NzUploadFile[] = [];
  id: number;
  form: FormGroup;
  isLoading = false;
  submitted = false;
  public Editor = ClassicEditorBuild;
  public privacy = '';
  public termOfService = '';


  constructor(
    private toaster: AppToasterService,
    private formBuilder: FormBuilder,
    private service: AppSystemSettingService,
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
  
  public onCkChange( { editor }: ChangeEvent ,key :string) {
    if(editor != undefined){
      const key = editor.getData();
      this.form.controls[key].setValue(key);
    }
  }  

  onSubmit(): void {
    console.log(this.form.value);

    if (this.form.invalid) {
      return;
    }
      let request = new UpdateSystemSetting();
      request = {...this.form.value}
      this.update(request);
  }

  update(request: UpdateSystemSetting) {
    this.submitted = true;
    this.service.update(request).subscribe({
      next: (v) => {
        this.submitted = false;
        this.toaster.toast(MessageType.success, MSG.systemSetting.update.success);
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (e) => {
        this.submitted = false;
        console.error(e);
        this.toaster.toast(MessageType.error, MSG.systemSetting.update.error);
      },
      complete: () => console.info('complete'),
    });
  }

  buildForm({ ...data }) {
    this.form = this.formBuilder.group({
      privacy: [data.content, null],
      termOfService: [data.excerpt, null]
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.isLoading = true;
    this.toaster.loadingMessage(MSG.systemSetting.loading);
    this.service.get(this.id).subscribe({
      next: (v) => {

        this.privacy = v.data.privacy;
        this.termOfService = v.data.termOfService;
        this.isLoading = false;
      },
      error: (e) => {
        console.error(e);
        this.isLoading = false;
      },
      complete: () => {},
    });
  }

  public onCkReady(editor: any,key:string) {
    
    editor.plugins.get("FileRepository").createUploadAdapter = (loader:any) => {
      return new MyUploadAdapter(loader,MediaType.Asset,this.id);
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
      
      this.mediaService.delete(Number(file.uid), MediaType.Asset).subscribe({
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

  
  onBack(){
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
