import { Injectable } from '@angular/core';
import { Cart } from '../shared/models/Cart';
import { BehaviorSubject, Observable } from 'rxjs';
import { Food } from '../shared/models/Food';
import { CartItem } from '../shared/models/CartItem';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart = this.getLocalStorageCart();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);
  constructor() { }

  addToCart(food: Food):void{

    let cartItem = this.cart.items.find(item => item.food.id === food.id);

    if (cartItem) return;

    this.cart.items.push(new CartItem(food));
    this.setLocalStorageCart(); //every change in cart is saved to storage and notify subscribers

  }

  removeFromCart(foodId: string):void {
    this.cart.items = this.cart.items.filter(item => item.food.id !== foodId);
    this.setLocalStorageCart();
  }

  changeQuantity(foodId:string, quantity:number) {
    let cartItem = this.cart.items.find(item => item.food.id === foodId);

    if(!cartItem) return;

    cartItem.quantity = quantity; //** make a setQuantity in cartItem, also unsubscribe to any*/
    cartItem.price = cartItem.food.price * quantity //same - setPrice
    this.setLocalStorageCart();
  }

  clearCart(){
    this.cart = new Cart();
    this.setLocalStorageCart();
  }

  getCartObservable():Observable<Cart> {
    return this.cartSubject.asObservable(); //we convert to observable so it can't be changed outside of the service
  }

  getCart(): Cart {
    return this.cartSubject.value;
  }

  private calcTotal(property: keyof CartItem): number {
    return this.cart.items.reduce((prevSum, currentItem) => prevSum + (<number>currentItem[property]), 0);
  }

  //save cart in local storage so it won't desapear on refersh
  private setLocalStorageCart():void {
    //calculate toatal price before save to storage
    this.cart.totalPrice = this.calcTotal('price');
    this.cart.totalCount = this.calcTotal('quantity');
    const cartJson = JSON.stringify(this.cart);
    localStorage.setItem('Cart', cartJson);
    this.cartSubject.next(this.cart);
  }

  private getLocalStorageCart():Cart {
    const cartJson = localStorage.getItem('Cart');
    return cartJson? JSON.parse(cartJson): new Cart(); //if there is no cart in storage, create a cart
  }

}
