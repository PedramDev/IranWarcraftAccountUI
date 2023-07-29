import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetLicenseList, LicenseGroupViewModel, GetLicenseGroupList } from 'src/app/models/shop/licenses';
import { AppLicenseService } from 'src/app/services/license.service';
import { AppLicenseGroupService } from 'src/app/services/licensegroup.service';

@Component({
    selector: "app-license-list",
    templateUrl: "./list.component.html",
    styles: [
      `
        [nz-button] {
          margin-right: 8px;
        }
      `
    ]
})
export class AppLicenseListComponent implements OnInit {
    constructor(
      private route: ActivatedRoute,
      private licenseService : AppLicenseService,
      private licenseGroupService : AppLicenseGroupService,
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
    toggleLoading : Array<number> = [];
    options : GetLicenseList = new GetLicenseList();    
    checked = false;
    indeterminate = false;
    listOfCurrentPageData: readonly LicenseGroupViewModel[] = [];
    listOfData: readonly LicenseGroupViewModel[] = [];
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
  
    onCurrentPageDataChange($event: readonly LicenseGroupViewModel[]): void {
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

    load(options : GetLicenseGroupList | null){
      this.isLoading=true;
      this.licenseGroupService.list(options)
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

    isRowDeleting(item:LicenseGroupViewModel){
      return this.deletingRows.findIndex(x=>x == item.id)> -1;
    }

    tableDeleteRowDisabled(){
      return this.getSelected().length==0
    }

    private getSelected(){
      return this.listOfCurrentPageData.filter(item => this.setOfCheckedId.has(item.id));
    }

    delete(){
      // this.deleteInProgress = true;
      // let checkedRows = this.getSelected();
      // const checkedIds = checkedRows.map(x=>x.id);
      
      // checkedIds.forEach(id=>{
      //   this.deletingRows.push( id );
      // })

      // this.licenseGroupService.delete(checkedIds)
      // .subscribe({
      //   next:(v) =>{
      //     checkedIds.forEach(id=>{
      //       this.deletingRows.splice(this.deletingRows.findIndex(x=>x == id),1);
      //     })
      //   this.deleteInProgress = false;
      //   this.filter();
      // },
      //   error: (e) =>{
      //     checkedIds.forEach(id=>{
      //       this.deletingRows.splice(this.deletingRows.findIndex(x=>x == id),1);
      //     })
      //     console.error(e)
      //     this.deleteInProgress = false;
      //   }
      // });

    }
    
    toggleEnabled(item:LicenseGroupViewModel){
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
    toggleEnabledLoading(item:LicenseGroupViewModel){
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