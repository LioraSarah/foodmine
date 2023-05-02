import { Injectable } from '@angular/core';
import { Order } from '../shared/models/Order';
import { HttpClient } from '@angular/common/http';
import { CREATE_ORDER_URL, GET_ORDER_URL } from '../shared/constants/urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  create (order: Order) {
    return this.http.post<Order>(CREATE_ORDER_URL, order);
  }

  getUserOrder():Observable<Order> {
    return this.http.get<Order>(GET_ORDER_URL);
  }

}
