import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GetProductCategoryList,
  ProductCategoryViewModel,
  UpdateProductCategory,
} from 'src/app/models/shop/product-category';
import { AppProductCategoryService } from 'src/app/services/product-category.service';
import { MessageType } from 'src/app/services/MessageType';
import { AppToasterService } from 'src/app/services/toaster.service';
import { MSG } from 'src/app/utils/messages';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { MediaType } from 'src/app/models/media';
import { AppMediaService } from 'src/app/services/media.service';
import { MyUploadAdapter } from 'src/app/utils/ckeditor/myUploadAdapter';
import { Slugator } from 'src/app/utils/slugator';
import { PageStatusList } from 'src/app/utils/PageStatusList';
import { CONSTANST } from 'src/app/utils/constanst';

@Component({
  selector: 'app-product-category-edit',
  templateUrl: './edit.component.html',
  styles: [
    `
      nz-select {
        width: 200px !important;
      }
    `,
  ],
})
export class AppProductCategoryComponent implements OnInit {
  fileList: NzUploadFile[] = [];
  mediaUrl : string;
  id: number;
  form: FormGroup;
  isLoading = false;
  isCategoriesLoading = false;
  categories: ProductCategoryViewModel[] = [];
  selectedParent: number | null;
  selectedPageStatus: string;
  submitted = false;
  pageStatusList = new PageStatusList().toList()
  public Editor = ClassicEditorBuild;

  public content =  '<p>Hello, world!</p>';
  constructor(
    private toaster: AppToasterService,
    private formBuilder: FormBuilder,
    private service: AppProductCategoryService,
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
    if (this.form.invalid) {
      return;
    }

      let request = new UpdateProductCategory();
      request = {...this.form.value};
      request.id = Number(this.id);

      this.update(request);
  }

  public selectedCategoryChanged(parentId:number| null){
    this.form.controls['parentId'].setValue(parentId);
  }
  public selectedPageStatusChanged(status:string){
    this.form.controls['status'].setValue(status);
  }

  update(request: UpdateProductCategory) {
    this.submitted = true;
    this.service.update(request).subscribe({
      next: (v) => {
        this.submitted = false;
        this.toaster.toast(
          MessageType.success,
          MSG.productCategory.update.success
        );
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (e) => {
        this.submitted = false;
        console.error(e);
        this.toaster.toast(MessageType.error, MSG.productCategory.update.error);
      },
      complete: () => console.info('complete'),
    });
  }

  buildForm({ ...data }) {
    console.log(data);
    this.form = this.formBuilder.group({
      title: [data.title, [Validators.required]],
      description: [data.description, null],
      slug: [data.slug, [Validators.required]],
      name: [data.name, [Validators.required]],
      status: [data.status, [Validators.required]],
      content: [data.content, null],
      excerpt: [data.excerpt, null],
      webPageId: [data.webPageId, null],
      parentId: [data.parentId, null],
    });
  }

  ngOnInit(): void {
    this.buildForm({
    });

      this.loadCategories();
      this.load();
      this.mediaUrl = CONSTANST.routes.media+'/query' +'?type='+MediaType.ProductCategorySingleImage+'&key='+this.id.toString()
  }

  loadCategories(){
      this.isCategoriesLoading = true;
      this.service.list(new GetProductCategoryList()).subscribe({
        next: (v) => {
          this.categories = v.data;
          this.isCategoriesLoading = false;
        },
        error: (e) => {
          console.error(e);
          this.isCategoriesLoading = false;
        },
        complete: () => {},
      });
  }

  load() {
    this.isLoading = true;
    this.toaster.loadingMessage(MSG.productCategory.loading);
    this.service.get(this.id).subscribe({
      next: (v) => {
        this.form.patchValue(v.data);
        this.form.patchValue(v.data.webPage);
        this.content = v.data.content;

        this.selectedPageStatus = v.data.status;
        this.selectedParent = v.data.parentId;

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
        console.log('load')
      },
      error: (e) => {
        console.error(e);
        this.isLoading = false;
      },
      complete: () => {},
    });
  }

  
  public onCkReady(editor: any) {
    
    editor.plugins.get("FileRepository").createUploadAdapter = (loader:any) => {
      return new MyUploadAdapter(loader,MediaType.ProductCategoryContentImage,this.id);
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
      
      this.mediaService.delete(Number(file.uid), MediaType.ProductCategorySingleImage).subscribe({
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
