import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as model from 'src/app/models/shared/ticket';
import { AppTicketService } from 'src/app/services/ticket.service';
import { MessageType } from 'src/app/services/MessageType';
import { AppToasterService } from 'src/app/services/toaster.service';
import { MSG } from 'src/app/utils/messages';
import { AuthService } from 'src/app/services/auth.service';
import { AppUserService } from 'src/app/services/user.service';
import { GetUserList, UserViewModel } from 'src/app/models/user';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { UserRole } from 'src/app/models/auth';
import { CkConfig } from 'src/app/utils/ckeditor/ckconfigs';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { CONSTANST } from 'src/app/utils/constanst';
import { AppTempFileService } from 'src/app/services/temp.service';
import { Observable } from 'rxjs';

@Component({
    selector: "app-ticket-edit",
    templateUrl: "./edit.component.html",
    styles: [
      `
        nz-select {
          width: 100% !important;
        }
      `,
    ],
})
export class AppTicketComponent implements OnInit  {
    isCreate=false;
    ticketId : number;
    form: FormGroup;
    isLoading=false;
    submitted = false;
    isModerator=false;
    userList : UserViewModel[];
    isUserLoading = false;
    selectedUser:number;
    ticket : model.TicketViewModel;
    
    public Editor = ClassicEditorBuild;
    public message = '';


    constructor(
      private toaster:AppToasterService,
      private formBuilder: FormBuilder,
      private service : AppTicketService,
      private auth : AuthService,
      private userService:AppUserService,
      private tempService : AppTempFileService,
      private router: Router,
      private route: ActivatedRoute,
      ) {
        this.ticketId = this.route.snapshot.params['ticketId'];

        if(this.route.snapshot.params['ticketId'] == 'add'){
          this.isCreate = true;
        }
    
        if(this.auth.isModerator()){
          this.isModerator = true;
        }
      }

      // convenience getter for easy access to form fields
      get f() { return this.form.controls; }

      onSubmit(): void {

        if (this.form.invalid) {
          return;
        }

        if(this.isCreate){

          if(this.isModerator){
            
          let request = new model.CreateTicketByAdmin();
          request = {...this.form.value};
          this.createTicket(request);

          }
          else{

            let request = new model.CreateTicketByCustomer();
            request = {...this.form.value};
            this.createTicket(request);
          }
        }
        else{
          //is reply

          if(this.isModerator){
            
            let request = new model.CreateReplyByAdmin();
            request = {...this.form.value};
            this.createReply(request);
  
            }
            else{
  
              let request = new model.CreateReplyByCustomer();
              request = {...this.form.value};
              this.createReply(request);
            }
        }

      }

      createReply(request :  model.CreateReplyByAdmin |  model.CreateReplyByCustomer){
        this.submitted = true;
        this.service.addReply(request).subscribe({
          next: (v) => {
            this.submitted = false;
            this.toaster.toast(MessageType.success,MSG.ticket.reply.success);
            this.router.navigate(['../'], { relativeTo: this.route });
          },
          error: (e) => {
            this.submitted = false;
            console.error(e)
            this.toaster.toast(MessageType.error,MSG.ticket.reply.error);
          }
      });
      }


      createTicket(request :  model.CreateTicketByAdmin |  model.CreateTicketByCustomer){
        this.submitted = true;
        this.service.add(request).subscribe({
          next: (v) => {
            this.submitted = false;
            this.toaster.toast(MessageType.success,MSG.ticket.create.success);
            this.router.navigate(['../'], { relativeTo: this.route });
          },
          error: (e) => {
            this.submitted = false;
            console.error(e)
            this.toaster.toast(MessageType.error,MSG.ticket.create.error);
          }
      });
      }

      hasPolicy(policy : string){
        return this.auth.hasPolicy(policy);
      }


      buildForm({...data}){

        
        if(this.isCreate){

          if(this.isModerator){


            this.form = this.formBuilder.group({
              subject: [data.subject, [Validators.required]],
              message: [data.message, [Validators.required]],
              customerId: [data.customerId, [Validators.required]],
              tokens: [null, []],
            });
  
          }
          else{

            this.form = this.formBuilder.group({
              subject: [data.subject, [Validators.required]],
              message: [data.message, [Validators.required]],
              tokens: [null, []]
            });
  
          }

        }
        else{
            
          this.form = this.formBuilder.group({
            ticketId: [data.id, [Validators.required]],
            message: [data.message, [Validators.required]],
            tokens: [null, []],
          });

        }

       
       
      }

      public onCkReady(editor: any) {
    
        // editor.plugins.get("FileRepository").createUploadAdapter = (loader:any) => {
        //   return new MyUploadAdapter(loader,MediaType.ArticleContentImage,this.id);
        // };
        
        editor.ui
          .getEditableElement()
          .parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
          );
    
          
      }

      public onCkChange( { editor }: ChangeEvent ) {
        if(editor != undefined){
          const message = editor.getData();
          this.form.controls['message'].setValue(message);
        }
      }

      public selectedUserChanged(userId:number) {
        this.form.controls['customerId'].setValue(userId);
      }

      ngOnInit(): void {
        this.buildForm({});
        
        if(!this.isCreate){
          this.load();
        }

        if(this.isModerator){

          let request = new GetUserList();
          request.role = [];
          request.role.push(UserRole.Seller ,UserRole.Buyer);

          this.userService.list(request).subscribe({
            next: (v) => {
              this.userList = v.data;
              this.isUserLoading=false;
            },
            error: (e) => {
              console.error(e);
              this.isUserLoading=false;
            }
        })
      }
      this.mediaUrl = CONSTANST.routes.tempFile;

      }
      mediaUrl : string;

      buildName(user : UserViewModel){
        return `${user.mobileNumber} : ${user.name}`;
      }


      load(){
        this.isLoading=true;
        this.toaster.loadingMessage(MSG.ticket.loading);
        this.service.get(this.ticketId).subscribe({
          next: (v) => {
            this.ticket = v.data;
            this.form.patchValue(v.data);
            this.form.controls['ticketId'].setValue(v.data.id);
            this.isLoading=false;
          },
          error: (e) => {
            console.error(e);
            this.isLoading=false;
          },
          complete: () => {}
      })
      }

      back(){
        if(this.isCreate){
          this.router.navigate(['../'], { relativeTo: this.route });
        }
        else{
          this.router.navigate(['../'], { relativeTo: this.route });
        }
      }
  EditorConfig = new CkConfig().ticketEditor();

  uploading = false;
  fileList: NzUploadFile[] = [];
  tokenList : {token : string , file : NzUploadFile}[] = [];

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    this.tempService.upload(file).subscribe({
      next: (v) => {
        this.tokenList = this.tokenList.concat({token : v.data.token, file : file});
      },
      error: (e) => {
        // this.fileList.splice(this.fileList.findIndex(x=>x.uid == file.uid),1);
        console.error(e);
      }, 
    })

    return false;
  };
  handleChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      // this.msg.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      // this.msg.error(`${file.name} file upload failed.`);
    }
  }
  handleRemove = (file: NzUploadFile) => new Observable<boolean>((obs) => {
    console.log(file);
        this.tokenList.splice(this.tokenList.findIndex(x=>x.file.uid == file.uid),1);
        this.fileList.splice(this.fileList.findIndex(x=>x.uid == file.uid),1);
  });
  

  }


