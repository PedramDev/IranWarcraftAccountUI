import { Pipe, PipeTransform } from '@angular/core';
import { TicketStatus } from '../models/shared/ticket';

@Pipe({name: 'ticketStatus', pure: false})
export class TicketStatusPipe implements PipeTransform {
  transform(status: string | null): string {
    if (status == null || status == undefined) {
      return '';
    }
    let name = '';

    switch (status.toLowerCase()) {
      case TicketStatus.Closed.toLowerCase():
        name = 'بسته';
        break;
      case TicketStatus.PendingReply.toLowerCase():
        name = 'در انتظار پاسخ';
        break;
      case TicketStatus.OnHold.toLowerCase():
        name = 'در دست بررسی';
        break;
      case TicketStatus.Open.toLowerCase():
        name = 'باز';
        break;
      case TicketStatus.InProgress.toLowerCase():
        name = 'درحال انجام';
        break;
    }
    return name;
  }
}
