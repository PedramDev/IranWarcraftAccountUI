import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BankAccountViewModel , GetBankAccountList, PatchBankAccount } from 'src/app/models/shared/bank-accounts';
import { AppBankAccountService } from 'src/app/services/bank-account.service';
import { MessageType } from 'src/app/services/MessageType';
import { AppToasterService } from 'src/app/services/toaster.service';
import { MSG } from 'src/app/utils/messages';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: "app-bankAccount-list",
    templateUrl: "./list.component.html",
    styles: [
      `
        [nz-button] {
          margin-right: 8px;
        }
      `
    ]
})
export class AppBankAccountListComponent implements OnInit {
    constructor(
      private route: ActivatedRoute,
      private service : AppBankAccountService,
      private toaster:AppToasterService,
      private router: Router,
    private authService: AuthService,
    ){

      if (authService.isModerator()) {
        this.showEditable = true;
      }
    }
    listOfSelection = [
      {
        text: 'انتخاب همه',
        onSelect: () => {
          this.onAllChecked(true);
        }
      }
    ];
    showEditable = false;

    deleteInProgress = false;
    isLoading = true;
    deletingRows : Array<number> = [];
    toggleLoading : Array<number> = [];
    options : GetBankAccountList = new GetBankAccountList();    
    checked = false;
    indeterminate = false;
    listOfCurrentPageData: readonly BankAccountViewModel[] = [];
    listOfData: readonly BankAccountViewModel[] = [];
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
  
    onCurrentPageDataChange($event: readonly BankAccountViewModel[]): void {
      this.listOfCurrentPageData = $event;
      this.refreshCheckedStatus();
    }
  
    refreshCheckedStatus(): void {
      this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
      this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
    }
  
    ngOnInit(): void {
    console.log(this.options);
      this.applyRouteParams();
      this.filter();
    }

    applyRouteParams(){
     this.options ={...this.options,...this.route.snapshot.params};
    }

    load(options : GetBankAccountList | null){
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

    isRowDeleting(item:BankAccountViewModel){
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
    
    toggleEditable(item:BankAccountViewModel){
      this.toggleLoading.push( item.id )

      let request = new PatchBankAccount();
      request.id = item.id;
      request.editable = item.isEditable;

      this.service.patch(request)
      .subscribe({
        next:(v) =>{
          item.isEditable = !item.isEditable;
          this.isLoading = false;
          this.toggleLoading.splice(this.toggleLoading.findIndex(x=>x == item.id),1);
        },
        error: (e) =>{
          this.isLoading = false;
          this.toggleLoading.splice(this.toggleLoading.findIndex(x=>x == item.id),1);
          console.error(e)
        }
      });
    }
    toggleEditableLoading(item:BankAccountViewModel){
      return this.toggleLoading.findIndex(x=>x==item.id)>-1;
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
  }