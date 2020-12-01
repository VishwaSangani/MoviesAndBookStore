import { Injectable } from '@angular/core';
import { UserDetails } from 'src/app/models/userDetails';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  userInfo: UserDetails;
  isValid = false;
  
  constructor() { }
}
