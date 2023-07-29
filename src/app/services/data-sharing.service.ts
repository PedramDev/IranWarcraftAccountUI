import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserViewModel } from '../models/user';

@Injectable()
export class DataSharingService {
    public currentUser: BehaviorSubject<UserViewModel> = new BehaviorSubject<UserViewModel>(null);
}