import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { PageStatus, SellToUsStatus } from 'src/app/models/shared-models';
import { AddLicenseListBySeller } from 'src/app/models/shop/licenses';
import { GetProductList, ProductViewModel, VariantViewModel } from 'src/app/models/shop/products';
import { AppLicenseService } from 'src/app/services/license.service';
import { AppLicenseGroupService } from 'src/app/services/licensegroup.service';
import { MessageType } from 'src/app/services/MessageType';
import { AppProductService } from 'src/app/services/product.service';
import { AppToasterService } from 'src/app/services/toaster.service';
import { MSG } from 'src/app/utils/messages';

@Component({
    selector: "app-license-edit",
    templateUrl: "./edit.component.html"
})
export class AppLicenseComponent implements OnInit  {
    isEdit=false;
    id : number;
    isLoading=false;
    submitted = false;

    public addLicenseRequest = new AddLicenseListBySeller();

    
    constructor(
      private toaster:AppToasterService,
      private formBuilder: FormBuilder,
      private licenseGroupService : AppLicenseGroupService,
      private licenseService : AppLicenseService,
      private productService : AppProductService,
      private router: Router,
      private route: ActivatedRoute,
      ) {
        this.id = this.route.snapshot.params['id'];
        this.isEdit = !!this.id;
      }

      // convenience getter for easy access to form fields
      selectedVariant: number | null;

      variants : VariantViewModel[] = [];
      variantIsLoading = true;
      loadVariants(){
        this.variantIsLoading = true;

        const getProductRequest = new GetProductList();
        getProductRequest.recordPerPage = 2147483647;
        getProductRequest.status = PageStatus.Published;
        getProductRequest.sellToUsStatus = SellToUsStatus.Available;

        this.productService.list(getProductRequest).subscribe({
          next: (v) => {
            this.variantIsLoading = false;

            let variantArr = v.data.map(x=>x.variants);
            variantArr.forEach(x=>{
              this.variants.concat(x);
            });
          },
          error: (e:HttpErrorResponse) => {
            this.variantIsLoading = false;
            console.error(e.message);
            this.toaster.toast(MessageType.error, e.error);
          },
        });
      }

      addLicense(){
        this.submitted = true;
        this.licenseService.add(this.addLicenseRequest).subscribe({
          next: (v) => {
            this.submitted = false;
            this.toaster.toast(MessageType.success, MSG.license.create.success);
          },
          error: (e:HttpErrorResponse) => {
            this.submitted = false;
            console.error(e.message);
            this.toaster.toast(MessageType.error, e.error);
          },
        });
      }

      public selectedVariantChanged(variantId: number | null) {
        this.addLicenseRequest.variantId = variantId;
      }

      getPaidPrice(){
        if (this.addLicenseRequest.variantId > 0) {
          const selectedVariant = this.variants.find(
            (x) => x.id == this.addLicenseRequest.variantId
          );
          if (selectedVariant) {
            const costPerLicense = selectedVariant.buyPrice;
            return costPerLicense;
          }
        }
        return 0;
      }

      private splitCodes(text:string){
        return text.split(/\r?\n/);
      }

      private isDuplicate(code : string, codes : string[]) : boolean{
        for (let i = 0; i < codes.length; i++) {
          const element = codes[i];
          if (code == element) {
            return true;
          }
        }
        return false;
      }

      fileList: NzUploadFile[] = [];
      beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
     
        let fr = new FileReader();
        fr.readAsText(file.originFileObj);
        fr.onloadend = (e) => {
        console.log(fr.result);
        this.addLicenseRequest.codes.concat(this.splitCodes(fr.result?.toString()));
      };
    
        return false;
      };

      handleRemove = (file: NzUploadFile) => new Observable<boolean>((obs) => {
            const fileIndex = this.fileList.findIndex(x=>x.uid == file.uid);
            
            // <remove code 
            let fr = new FileReader();
            fr.readAsText(this.fileList[fileIndex].originFileObj);
            fr.onloadend = (e) => {
              console.log(fr.result);
              const codes = this.splitCodes(fr.result?.toString())
              codes.forEach(element => {
                this.addLicenseRequest.codes.splice(this.addLicenseRequest.codes.findIndex(x=>x == element),1);
              });
           };
            // </remove code 

            this.fileList.splice(fileIndex,1);
      });
      

      ngOnInit(): void {
        this.loadVariants();
      }

      
  onBack(){
    this.router.navigate(['../'], { relativeTo: this.route });
  }
    }


