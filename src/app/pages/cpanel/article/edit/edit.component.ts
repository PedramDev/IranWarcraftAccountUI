import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleType,  UpdateArticle } from 'src/app/models/blog/article';
import { AppArticleService } from 'src/app/services/article.service';
import { MessageType } from 'src/app/services/MessageType';
import { AppToasterService } from 'src/app/services/toaster.service';
import { MSG } from 'src/app/utils/messages';
import { AppArticleCategoryService } from 'src/app/services/article-category.service';
import {
  ArticleCategoryViewModel,
  GetArticleCategoryList,
} from 'src/app/models/blog/article-category';
import { GetTagList, TagViewModel } from 'src/app/models/blog/tag';

import { AppTagService } from 'src/app/services/tag.service';
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
  selector: 'app-article-edit',
  templateUrl: './edit.component.html',
  styles: [
    `
      nz-select {
        width: 100% !important;
      }
    `,
  ],
})
export class AppArticleComponent implements OnInit {
  fileList: NzUploadFile[] = [];
  mediaUrl : string;
  id: number;
  form: FormGroup;
  isLoading = false;
  submitted = false;
  isCategoryLoading = false;
  isTagLoading = false;
  isGenreLoading = false;
  selectedCategory: number | null;
  selectedTags: number[] = [];
  public Editor = ClassicEditorBuild;
  public content = '';

  categories: ArticleCategoryViewModel[] = [];
  tags: TagViewModel[] = [];

  selectedArticleType:string;
  selectedPageStatus:string;
  selectedCommentStatus:string;


  constructor(
    private toaster: AppToasterService,
    private formBuilder: FormBuilder,
    private service: AppArticleService,
    private categoryService: AppArticleCategoryService,
    private tagService: AppTagService,
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

      let request = new UpdateArticle();
      request = {...this.form.value}

      request.id = Number(this.id);

      this.update(request);
  }

  update(request: UpdateArticle) {
    this.submitted = true;
    this.service.update(request).subscribe({
      next: (v) => {
        this.submitted = false;
        this.toaster.toast(MessageType.success, MSG.article.update.success);
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (e) => {
        this.submitted = false;
        console.error(e);
        this.toaster.toast(MessageType.error, MSG.article.update.error);
      },
      complete: () => console.info('complete'),
    });
  }

  buildForm({ ...data }) {
    this.form = this.formBuilder.group({
      content: [data.content, [Validators.required]],
      excerpt: [data.excerpt, [Validators.required]],
      status: [data.status, [Validators.required]],
      commentStatus: [data.commentStatus, [Validators.required]],
      type: [data.type, [Validators.required]],
      categoryId: [data.categoryId, []],
      title: [data.title, [Validators.required]],
      description: [data.description, []],
      slug: [data.slug, [Validators.required]],
      tags: [data.tags, []],
      genres: [data.genres, []]
    });
  }

  ngOnInit(): void {
    this.buildForm({ tags: [], genres: [] });
    
    this.articleTypeList=Object.keys(ArticleType);
    this.pageStatusList=Object.keys(PageStatus);
    this.commentStatusList=Object.keys(CommentStatus);

    this.loadCategories();
    this.loadTags();
    this.load();

   this.mediaUrl = CONSTANST.routes.media +'/query'+'?type='+MediaType.ArticleSingleImage+'&key='+this.id.toString()
  }

  loadCategories() {
    this.isCategoryLoading = true;
    this.toaster.loadingMessage(MSG.articleCategory.loading);
    this.categoryService.list(new GetArticleCategoryList()).subscribe({
      next: (v) => {
        this.categories = v.data;
        this.isCategoryLoading = false;
      },
      error: (e) => {
        console.error(e);
        this.isCategoryLoading = false;
      },
      complete: () => {},
    });
  }

  loadTags() {
    this.isTagLoading = true;
    this.toaster.loadingMessage(MSG.tag.loading);
    this.tagService.list(new GetTagList()).subscribe({
      next: (v) => {
        this.tags = v.data;
        this.isTagLoading = false;
      },
      error: (e) => {
        console.error(e);
        this.isTagLoading = false;
      },
      complete: () => {},
    });
  }

  load() {
    this.isLoading = true;
    this.toaster.loadingMessage(MSG.article.loading);
    this.service.get(this.id).subscribe({
      next: (v) => {

        this.form.patchValue(v.data.webPage);
       

        this.content = v.data.content;
        this.selectedCategory = v.data.categoryId;
        this.selectedTags = v.data.tags.map(x=>x.id);
        this.selectedPageStatus = v.data.status;
        this.selectedArticleType = v.data.type;
        this.selectedCommentStatus = v.data.commentStatus;

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
  

  public selectedCategoryChanged(categoryId: number | null) {
    this.form.controls['categoryId'].setValue(categoryId);
  }

  public selectedTagChanged(tags:number[]|null) {
    this.form.controls['tags'].setValue(tags);
  }

  public selectedArticleTypeChanged(type:ArticleType) {
    this.form.controls['type'].setValue(type);
  }

  public selectedPageStatusChanged(data:PageStatus) {
    this.form.controls['status'].setValue(data);
  }
  public selectedCommentStatusChanged(data:CommentStatus) {
    this.form.controls['commentStatus'].setValue(data);
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

  articleTypeList : string[];
  pageStatusList : string[];
  commentStatusList : string[];
 

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
  slugOut = '';
  updateSlug(){
    this.slugOut = new Slugator().generate(this.form.controls['slug'].value);
  }
  
  onBack(){
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
