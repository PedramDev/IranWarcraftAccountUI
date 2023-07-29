import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {  CreateRegion ,UpdateRegion } from 'src/app/models/shop/regions';
import { AppRegionService } from 'src/app/services/region.service';
import { MessageType } from 'src/app/services/MessageType';
import { AppToasterService } from 'src/app/services/toaster.service';
import { MSG } from 'src/app/utils/messages';

@Component({
    selector: "app-region-edit",
    templateUrl: "./edit.component.html"
})
export class AppRegionComponent implements OnInit  {
    isEdit=false;
    id : number;
    form: FormGroup;
    isLoading=false;
    submitted = false;

    
    constructor(
      private toaster:AppToasterService,
      private formBuilder: FormBuilder,
      private service : AppRegionService,
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

        if(this.isEdit){

          let request = new UpdateRegion();
          request.faName= this.form.value.faName;
          request.enName= this.form.value.enName;
          request.id= this.id;

          this.update(request);
        }
        else{
          

          let request = new CreateRegion();
          request.faName= this.form.value.faName;
          request.enName= this.form.value.enName;

          this.create(request);
        }

      }


      update(request : UpdateRegion){
        this.submitted = true;
        this.service.update(request).subscribe({
          next: (v) => {
            this.submitted = false;
            this.toaster.toast(MessageType.success,MSG.region.update.success);
            this.router.navigate(['../'], { relativeTo: this.route });
          },
          error: (e) => {
            this.submitted = false;
            console.error(e)
            this.toaster.toast(MessageType.error,MSG.region.update.error);
          },
          complete: () => console.info('complete') 
      });
      }

      create(request : CreateRegion){
        this.submitted = true;
        this.service.add(request).subscribe({
          next: (v) => {
            this.submitted = false;
            this.toaster.toast(MessageType.success,MSG.region.create.success);
            this.router.navigate(['../'], { relativeTo: this.route });
          },
          error: (e) => {
            this.submitted = false;
            console.error(e)
            this.toaster.toast(MessageType.error,MSG.region.create.error);
          },
          complete: () => {}
      });
      }

      buildForm({...data}){
        console.log(data);
        this.form = this.formBuilder.group({
          faName: [data.faName, [Validators.required]],
          enName: [data.enName, [Validators.required]],
        });
      }
    
      ngOnInit(): void {
        this.buildForm({faName:'',enName:''});
        
        if(this.isEdit){
          this.load()
        }

      }

      load(){
        this.isLoading=true;
        this.toaster.loadingMessage(MSG.region.loading);
        this.service.get(this.id).subscribe({
          next: (v) => {
            this.form.patchValue(v.data);
            this.isLoading=false;
          },
          error: (e) => {
            console.error(e);
            this.isLoading=false;
          },
          complete: () => {}
      })
      }

      
  onBack(){
    this.router.navigate(['../'], { relativeTo: this.route });
  }
    }


