import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactMessageViewModel , GetContactMessageList, PatchContactMessage } from 'src/app/models/shared/contact-message';
import { AppContactMessageService } from 'src/app/services/contact-message.service';
import { MessageType } from 'src/app/services/MessageType';
import { AppToasterService } from 'src/app/services/toaster.service';
import { MSG } from 'src/app/utils/messages';

@Component({
    selector: "app-contact-message-list",
    templateUrl: "./list.component.html",
    styles: [
      `
        [nz-button] {
          margin-right: 8px;
        }
      `
    ]
})
export class AppContactMessageListComponent implements OnInit {
    constructor(
      private route: ActivatedRoute,
      private service : AppContactMessageService,
      private toaster:AppToasterService,
      private router: Router,
    ){
    }
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
    toggleArchiveLoadingArray : Array<number> = [];
    toggleReadLoadingArray : Array<number> = [];
    options : GetContactMessageList = new GetContactMessageList();    
    checked = false;
    indeterminate = false;
    listOfCurrentPageData: readonly ContactMessageViewModel[] = [];
    listOfData: readonly ContactMessageViewModel[] = [];
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
  
    onCurrentPageDataChange($event: readonly ContactMessageViewModel[]): void {
      this.listOfCurrentPageData = $event;
      this.refreshCheckedStatus();
    }
  
    refreshCheckedStatus(): void {
      this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
      this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
    }
  
    ngOnInit(): void {
      this.applyRouteParams();
      this.filter();
    }

    applyRouteParams(){
     this.options ={...this.options,...this.route.snapshot.params};
    }

    load(options : GetContactMessageList | null){
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

    isRowDeleting(item:ContactMessageViewModel){
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
    
  patch(isArchived : boolean | null , read : boolean | null , id : number) {
    let request = new PatchContactMessage();

    if(isArchived != null){
      request.archived = isArchived;
    }
    if(read != null){
      request.read = read;
    }

    request.id = id;
    return this.service.patch(request)
  }

    toggleArchive(item:ContactMessageViewModel){
      this.toggleArchiveLoadingArray.push( item.id )

      this.patch(!item.archived,null,item.id)
      .subscribe({
        next:(v) =>{
          item.archived = !item.archived;
          this.toggleArchiveLoadingArray.splice(this.toggleArchiveLoadingArray.findIndex(x=>x == item.id),1);
        },
        error: (e) =>{
          this.toggleArchiveLoadingArray.splice(this.toggleArchiveLoadingArray.findIndex(x=>x == item.id),1);
          console.error(e)
        }
      });
    }

    toggleRead(item:ContactMessageViewModel){
      this.toggleReadLoadingArray.push( item.id )

      this.patch(null,!item.read,item.id)
      .subscribe({
        next:(v) =>{
          item.read = !item.read;
          this.toggleReadLoadingArray.splice(this.toggleReadLoadingArray.findIndex(x=>x == item.id),1);
        },
        error: (e) =>{
          this.toggleReadLoadingArray.splice(this.toggleReadLoadingArray.findIndex(x=>x == item.id),1);
          console.error(e)
        }
      });
    }
    
    toggleReadLoading(item:ContactMessageViewModel){
      return this.toggleReadLoadingArray.findIndex(x=>x==item.id)>-1;
    }
    toggleArchiveLoading(item:ContactMessageViewModel){
      return this.toggleArchiveLoadingArray.findIndex(x=>x==item.id)>-1;
    }
    filter(){
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
          this.router.navigate(['/cpanel/contact-message/'+v.data], { relativeTo: this.route });
        },
        error: (e) => {
          console.error(e)
          this.toaster.toast(MessageType.error,MSG.productCategory.create.error);
        },
        complete: () => {}
    });
    }
  }