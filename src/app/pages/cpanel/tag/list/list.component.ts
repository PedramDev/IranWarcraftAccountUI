import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TagViewModel , GetTagList } from 'src/app/models/blog/tag';
import { AppTagService } from 'src/app/services/tag.service';
import { MessageType } from 'src/app/services/MessageType';
import { AppToasterService } from 'src/app/services/toaster.service';
import { MSG } from 'src/app/utils/messages';
import { PageStatus } from 'src/app/models/shared-models';

@Component({
    selector: "app-tag-list",
    templateUrl: "./list.component.html",
    styles: [
      `
        [nz-button] {
          margin-right: 8px;
        }
      `
    ]
})
export class AppTagListComponent implements OnInit {
    constructor(
      private route: ActivatedRoute,
      private service : AppTagService,
      private toaster:AppToasterService,
      private router: Router,
    ){
    }
    pageStatusList =  Object.values(PageStatus);
    listOfSelection = [
      {
        text: 'انتخاب همه',
        onSelect: () => {
          this.onAllChecked(true);
        }
      }
    ];

    deleteInProgress = false;
    isLoading = true;
    deletingRows : Array<number> = [];
    toggleLoading : Array<number> = [];
    options : GetTagList = new GetTagList();    
    checked = false;
    indeterminate = false;
    listOfCurrentPageData: readonly TagViewModel[] = [];
    listOfData: readonly TagViewModel[] = [];
    setOfCheckedId = new Set<number>();
    total=0;
  
    updateCheckedSet(id: number, checked: boolean): void {
      if (checked) {
        this.setOfCheckedId.add(id);
      } else {
        this.setOfCheckedId.delete(id);
      }
    }
  
    onItemChecked(id: number, checked: boolean): void {
      this.updateCheckedSet(id, checked);
      this.refreshCheckedStatus();
    }
  
    onAllChecked(value: boolean): void {
      this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
      this.refreshCheckedStatus();
    }
  
    onCurrentPageDataChange($event: readonly TagViewModel[]): void {
      this.listOfCurrentPageData = $event;
      this.refreshCheckedStatus();
    }
  
    refreshCheckedStatus(): void {
      this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
      this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
    }
  
    ngOnInit(): void {
      this.options.status = PageStatus.Published;
      this.applyRouteParams();
      this.filter();
    }

    applyRouteParams(){
     this.options ={...this.options,...this.route.snapshot.params};
    }

    load(options : GetTagList | null){
      this.isLoading=true;
      this.service.list(options)
      .subscribe({
        next:(v) =>{
          this.listOfData = v.data ?? [];
          this.total = v.totalSize;
          this.isLoading = false;
        },
        error: (e) =>{
          this.isLoading = false;
          console.error(e)
        }
      });
    }

    isRowDeleting(item:TagViewModel){
      return this.deletingRows.findIndex(x=>x == item.id)> -1;
    }

    tableDeleteRowDisabled(){
      return this.getSelected().length==0
    }

    private getSelected(){
      return this.listOfCurrentPageData.filter(item => this.setOfCheckedId.has(item.id));
    }

    delete(){
      this.deleteInProgress = true;
      let checkedRows = this.getSelected();
      const checkedIds = checkedRows.map(x=>x.id);
      
      checkedIds.forEach(id=>{
        this.deletingRows.push( id );
      })

      this.service.delete(checkedIds)
      .subscribe({
        next:(v) =>{
          checkedIds.forEach(id=>{
            this.deletingRows.splice(this.deletingRows.findIndex(x=>x == id),1);
          })
        this.deleteInProgress = false;
        this.filter();
      },
        error: (e) =>{
          checkedIds.forEach(id=>{
            this.deletingRows.splice(this.deletingRows.findIndex(x=>x == id),1);
          })
          console.error(e)
          this.deleteInProgress = false;
        }
      });

    }
    
    toggleEnabled(item:TagViewModel){
      // this.toggleLoading.push( item.id )

      // this.service.inactivate(item.id)
      // .subscribe({
      //   next:(v) =>{
      //     item.enabled = !item.enabled;
      //     this.isLoading = false;
      //     this.toggleLoading.splice(this.toggleLoading.findIndex(x=>x == item.id),1);
      //   },
      //   error: (e) =>{
      //     this.isLoading = false;
      //     this.toggleLoading.splice(this.toggleLoading.findIndex(x=>x == item.id),1);
      //     console.error(e)
      //   }
      // });
    }
    toggleEnabledLoading(item:TagViewModel){
      return this.toggleLoading.findIndex(x=>x==item.id)>-1;
    }

    changePageStatus($event :any){
      this.options.status = $event;
      this.filter();
    }

    filter(){
      console.log(this.options.status);
      this.load(this.options);
    }

    pageIndexChange(pageIndex:number){
      this.options.pageNumber=pageIndex;
      this.filter();
    }
    pageSizeChange(pageSize:number){
      this.options.recordPerPage=pageSize;
      this.filter();
    }

    
    create(){
      this.service.add().subscribe({
        next: (v) => {
          this.router.navigate(['/cpanel/tag/'+v.data], { relativeTo: this.route });
        },
        error: (e) => {
          console.error(e)
          this.toaster.toast(MessageType.error,MSG.tag.create.error);
        },
        complete: () => {}
    });
    }
  }