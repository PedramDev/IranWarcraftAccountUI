import { Pipe, PipeTransform } from '@angular/core';
import { LicenseStatus } from 'src/app/models/shop/licenses/enums/LicenseStatus';

@Pipe({ name: 'licenseStatus', pure: false })
export class LicenseStatusPipe implements PipeTransform {
  transform(status: string | null): string {
    if (status == null || status == undefined) {
      return '';
    }
    let name = '';

    switch (status.toLowerCase()) {
      case LicenseStatus.Approved.toLowerCase():
        name = 'تایید';
        break;
      case LicenseStatus.ForSale.toLowerCase():
        name = 'برای فروش';
        break;
      case LicenseStatus.Pending.toLowerCase():
        name = 'درانتظار تایید';
        break;
      case LicenseStatus.Reject.toLowerCase():
        name = 'رد شد';
        break;
      case LicenseStatus.Sold.toLowerCase():
        name = 'فروخته شد';
        break;
    }
    return name;
  }
}
