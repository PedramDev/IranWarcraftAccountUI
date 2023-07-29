import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  UpdateProduct,
  UpdateVariant,
  VariantViewModel,
} from 'src/app/models/shop/products';
import { AppProductService } from 'src/app/services/product.service';
import { MessageType } from 'src/app/services/MessageType';
import { AppToasterService } from 'src/app/services/toaster.service';
import { MSG } from 'src/app/utils/messages';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import {
  GetProductCategoryList,
  ProductCategoryViewModel,
} from 'src/app/models/shop/product-category';
import { AppProductCategoryService } from 'src/app/services/product-category.service';
import { GetRegionList, RegionViewModel } from 'src/app/models/shop/regions';
import { AppRegionService } from 'src/app/services/region.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { MediaType } from 'src/app/models/media';
import { AppMediaService } from 'src/app/services/media.service';
import { MyUploadAdapter } from 'src/app/utils/ckeditor/myUploadAdapter';
import { CONSTANST } from 'src/app/utils/constanst';
import { Slugator } from 'src/app/utils/slugator';
import { PageStatusList } from 'src/app/utils/PageStatusList';
import { CkConfig } from 'src/app/utils/ckeditor/ckconfigs';

@Component({
  selector: 'app-product-edit',
  templateUrl: './edit.component.html',
  styles: [
    `
      nz-select {
        width: 200px !important;
      }
    `,
  ],
})
export class AppProductComponent implements OnInit {
  fileList: NzUploadFile[] = [];
  mediaUrl : string;
  id: number;
  form: FormGroup;
  isLoading = false;
  isCategoriesLoading = false;
  isRegionsLoading = false;

  submitted = false;
  selectedPageStatus: string;
  pageStatusList = new PageStatusList().toList()

  Variants: UpdateVariant[] = [];
  selectedCategory: number | null;
  selectedDefaultVariant: number | null;
  categories: ProductCategoryViewModel[] = [];
  regions : RegionViewModel[] = [];
  removeListOfVariants: number[] = [];

  public Editor = ClassicEditorBuild;
  public content = '<p>Hello, world!</p>';

  constructor(
    private toaster: AppToasterService,
    private formBuilder: FormBuilder,
    private service: AppProductService,
    private categoryService: AppProductCategoryService,
    private regionService: AppRegionService,
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

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }


      let request = new UpdateProduct();
      request = {...this.form.value};
      request.variants = [];

      this.Variants.forEach((item)=>{
        request.variants.push(item);
      });

      this.removeListOfVariants.forEach((item)=>{
        request.removeListOfVariants.push(item);
      });

      request.id = this.id;

      this.update(request);
  }

  update(request: UpdateProduct) {
    this.submitted = true;
    this.service.update(request).subscribe({
      next: (v) => {
        this.submitted = false;
        this.toaster.toast(MessageType.success, MSG.product.update.success);
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (e) => {
        this.submitted = false;
        console.error(e);
        this.toaster.toast(MessageType.error, MSG.product.update.error);
      },
      complete: () => console.info('complete'),
    });
  }

  create() {
    this.submitted = true;
    this.service.add().subscribe({
      next: (v) => {
        this.submitted = false;
        this.toaster.toast(MessageType.success, MSG.product.create.success);
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (e) => {
        this.submitted = false;
        console.error(e);
        this.toaster.toast(MessageType.error, MSG.product.create.error);
      },
      complete: () => {},
    });
  }

  buildForm({ ...data }) {
    console.log(data);
    this.form = this.formBuilder.group({
      status:[data.status,[Validators.required]],
      name: [data.name, [Validators.required]],
      content: [data.content, null],
      excerpt: [data.excerpt, null],
      defaultVariantId: [data.defaultVariantId,null],
      categoryId: [data.categoryId, null],
      title: [data.title, null],
      description: [data.description, null],
      slug: [data.slug, null],
      variants: [data.variants, null],
    });
  }

  ngOnInit(): void {
    this.buildForm({ variants: [] });

    this.load();
    this.loadCategories();
    this.loadRegions();
    this.mediaUrl = CONSTANST.routes.media +'/query'+'?type='+MediaType.ProductSingleImage+'&key='+this.id.toString()
  }

  loadRegions() {
    this.isRegionsLoading = true;
    this.regionService.list(new GetRegionList()).subscribe({
      next: (v) => {
        this.regions = v.data;
        this.isRegionsLoading = false;
      },
      error: (e) => {
        console.error(e);
        this.isRegionsLoading = false;
      },
      complete: () => {},
    });
  }

  loadCategories() {
    this.isCategoriesLoading = true;
    this.categoryService.list(new GetProductCategoryList()).subscribe({
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
    this.toaster.loadingMessage(MSG.product.loading);
    this.service.get(this.id).subscribe({
      next: (v) => {
        this.form.patchValue(v.data.webPage);
        this.form.patchValue(v.data);

        this.content = v.data.content;

        this.selectedPageStatus = v.data.status;
        this.selectedCategory = v.data.categoryId;
        this.selectedDefaultVariant = v.data.defaultVariantId;

        v.data.variants.forEach(variantVm=>{
          let variantUpdate = new UpdateVariant();
          variantUpdate = {...variantUpdate,...variantVm};
          this.Variants.push(variantUpdate);
        });

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
  public selectedDefaultVariantChanged(defaultVariantId:number | null){
    this.form.controls['defaultVariantId'].setValue(defaultVariantId);
  }

  public selectedCategoryChanged(categoryId:number | null){
    this.form.controls['categoryId'].setValue(categoryId);
  }

  public selectedPageStatusChanged(status:string){
    this.form.controls['status'].setValue(status);
  }

  public onCkReady(editor: any) {
    
    editor.plugins.get("FileRepository").createUploadAdapter = (loader:any) => {
      return new MyUploadAdapter(loader,MediaType.ArticleContentImage,this.id);
    };
    
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );

      
  }

  public onCkChange( { editor }: ChangeEvent ) {
    if(editor != undefined){
      const content = editor.getData();
      this.form.controls['content'].setValue(content);
    }
  }

  addVariantRow(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    var newVariant = new UpdateVariant();
    newVariant.buyPrice = 0;
    newVariant.sellPrice = 0;
    newVariant.id = null;
    newVariant.regionId = null;
    this.Variants.push(newVariant);
  }
  deleteVariantRow(index : number,e?: MouseEvent) {

    let id =this.Variants[index].id;
    if(id != 0){
      this.removeListOfVariants.push(id);
    }
    this.Variants.splice(index,1);
  }

  getIndex(variant:UpdateVariant){
    return this.Variants.indexOf(variant);
  }

  formatterDollar = (value: number): string => `$ ${value}`;
  parserDollar = (value: string): string => value.replace('$ ', '');

  
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
      
      this.mediaService.delete(Number(file.uid), MediaType.ArticleSingleImage).subscribe({
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

  EditorConfig = new CkConfig().htmlEditor();

  slugOut = '';
  updateSlug(){
    this.slugOut = new Slugator().generate(this.form.controls['slug'].value);
  }

  onBack(){
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
