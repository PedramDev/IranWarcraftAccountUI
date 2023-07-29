import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GetArticleCategoryList,
  ArticleCategoryViewModel,
  UpdateArticleCategory,
} from 'src/app/models/blog/article-category';
import { AppArticleCategoryService } from 'src/app/services/article-category.service';
import { MessageType } from 'src/app/services/MessageType';
import { AppToasterService } from 'src/app/services/toaster.service';
import { MSG } from 'src/app/utils/messages';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { MediaType } from 'src/app/models/media';
import { AppMediaService } from 'src/app/services/media.service';
import { CONSTANST } from 'src/app/utils/constanst';
import { Observable } from 'rxjs';
import { MyUploadAdapter } from '../../../../utils/ckeditor/myUploadAdapter';
import { Slugator } from 'src/app/utils/slugator';

@Component({
  selector: 'app-article-category-edit',
  templateUrl: './edit.component.html',
  styles: [
    `
      nz-select {
        width: 200px !important;
      }
    `,
  ],
})
export class AppArticleCategoryComponent implements OnInit {
  fileList: NzUploadFile[] = [];
  mediaUrl : string;
  id: number;
  form: FormGroup;
  isLoading = false;
  isCategoriesLoading = false;
  categories: ArticleCategoryViewModel[] = [];
  selectedParent: number | null;
  submitted = false;
  public Editor = ClassicEditorBuild;

  public content =  '<p>Hello, world!</p>';
  constructor(
    private toaster: AppToasterService,
    private formBuilder: FormBuilder,
    private service: AppArticleCategoryService,
    private mediaService : AppMediaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  public onCkChange( { editor }: ChangeEvent ) {
    if(editor != undefined){
      const content = editor.getData();
      this.form.controls['content'].setValue(content);
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

      let request = new UpdateArticleCategory();
      request = {...this.form.value};
      request.id = Number(this.id);

      this.update(request);
  }

  public selectedCategoryChanged(parentId:number| null){
    this.form.controls['parentId'].setValue(parentId);
  }

  update(request: UpdateArticleCategory) {
    this.submitted = true;
    this.service.update(request).subscribe({
      next: (v) => {
        this.submitted = false;
        this.toaster.toast(
          MessageType.success,
          MSG.articleCategory.update.success
        );
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (e) => {
        this.submitted = false;
        console.error(e);
        this.toaster.toast(MessageType.error, MSG.articleCategory.update.error);
      },
      complete: () => console.info('complete'),
    });
  }

  create() {
    this.submitted = true;
    this.service.add().subscribe({
      next: (v) => {
        this.submitted = false;
        this.toaster.toast(
          MessageType.success,
          MSG.articleCategory.create.success
        );
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (e) => {
        this.submitted = false;
        console.error(e);
        this.toaster.toast(MessageType.error, MSG.articleCategory.create.error);
      },
      complete: () => {},
    });
  }

  buildForm({ ...data }) {
    console.log(data);
    this.form = this.formBuilder.group({
      title: [data.title, [Validators.required]],
      description: [data.description, [Validators.required]],
      slug: [data.slug, [Validators.required]],
      name: [data.name, [Validators.required]],
      content: [data.content, null],
      excerpt: [data.excerpt,null ],
      webPageId: [data.webPageId, null],
      parentId: [data.parentId, null],
    });
  }

  ngOnInit(): void {
    this.buildForm({
      title: '',
      description: '',
      slug: '',
      name: '',
      content: '',
      excerpt: '',
      webPageId: '',
      parentId: null,
    });

    
    this.loadCategories();
    this.load();
    this.mediaUrl = CONSTANST.routes.media+'/query' +'?type='+MediaType.ArticleCategorySingleImage+'&key='+this.id.toString()
  }

  loadCategories(){
      this.isCategoriesLoading = true;
      this.service.list(new GetArticleCategoryList()).subscribe({
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
    this.toaster.loadingMessage(MSG.articleCategory.loading);
    this.service.get(this.id).subscribe({
      next: (v) => {
        this.form.patchValue(v.data);
        this.form.patchValue(v.data.webPage);
        this.content = v.data.content;

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
      return new MyUploadAdapter(loader,MediaType.ArticleCategoryContentImage,this.id);
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
      
      this.mediaService.delete(Number(file.uid), MediaType.ArticleCategorySingleImage).subscribe({
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
