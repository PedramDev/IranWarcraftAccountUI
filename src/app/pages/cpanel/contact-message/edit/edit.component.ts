import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactMessageViewModel,  GetContactMessageList, PatchContactMessage } from 'src/app/models/shared/contact-message';
import { AppContactMessageService } from 'src/app/services/contact-message.service';
import { MessageType } from 'src/app/services/MessageType';
import { AppToasterService } from 'src/app/services/toaster.service';
import { MSG } from 'src/app/utils/messages';

// https://stackoverflow.com/questions/46765197/how-to-enable-image-upload-support-in-ckeditor-5

@Component({
  selector: 'app-contactMessage-edit',
  templateUrl: './edit.component.html',
  styles: [
    `
      nz-select {
        width: 100% !important;
      }
    `,
  ],
})
export class AppContactMessageComponent implements OnInit {
  id: number;
  isLoading = false;
  submitted = false;


  isArchived :boolean=false;
  isRead :boolean=false;
  model : ContactMessageViewModel;

  constructor(
    private toaster: AppToasterService,
    private service: AppContactMessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  toggleArchiveLoading : boolean;
  toggleArchive(){
     this.patch(!this.model.archived,null).subscribe({
       next:(v)=>{
        this.model.archived = !this.model.archived
          this.toggleArchiveLoading = false;
       },
       error: (e) =>{
        this.toggleArchiveLoading = false;
        console.error(e)
      }
     })
  }

  toggleReadLoading : boolean;
  toggleRead(){
     this.patch(null,!this.model.read).subscribe({
       next:(v)=>{
        this.model.read = !this.model.read
          this.toggleReadLoading = false;
       },
       error: (e) =>{
        this.toggleReadLoading = false;
        console.error(e)
      }
     })
  }


  patch(isArchived : boolean | null , read : boolean | null) {
    let request = new PatchContactMessage();

    request.id = this.id;
    if(isArchived != null){
      request.archived = isArchived;
    }
    if(read != null){
      request.read = read;
    }

    return this.service.patch(request)
  }


  ngOnInit(): void {
    this.model = new ContactMessageViewModel();
    this.load();
  }

  load() {
    this.isLoading = true;
    this.toaster.loadingMessage(MSG.contactMessage.loading);
    this.service.get(this.id).subscribe({
      next: (v) => {
        this.model = v.data;
        this.isLoading = false;
        
        if(v.data.read == false && v.data.readAt == null){
          this.toggleRead();
        }

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
