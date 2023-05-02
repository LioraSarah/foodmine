import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../shared/models/User';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { HttpClient } from '@angular/common/http';
import { LOGIN_URL, REGISTER_URL } from '../shared/constants/urls';
import { ToastrService } from 'ngx-toastr';
import { IUserRegister } from '../shared/interfaces/IUserRegister';

const USER_KEY ='User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  //convert to observable so it can not be changed whe accessed from the outside
  public userObservable: Observable<User>;

  constructor(private http: HttpClient, private toastrService:ToastrService) {
    this.userObservable = this.userSubject.asObservable();
  }

  public get currentUser(): User {
    return this.userSubject.value;
  }

  login(userLogin:IUserLogin):Observable<User> {
    return this.http.post<User>(LOGIN_URL, userLogin).pipe(tap({
        next: user => {
          console.log(user);
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Hi ${user.name}! Welcome to Food Mine!`,
            'Login was successful'
          )
        },
        error: errorRes => {
          this.toastrService.error(errorRes.error, 'Login Failed');
        }
      })
    );
  };

  register(userRegister: IUserRegister): Observable<User> {
    return this.http.post<User>(REGISTER_URL, userRegister).pipe(
      tap({
        next: (user) => {
          console.log(user);
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome ${user.name}!`,
            'Register Successful'
          )
        },
        error: (errorRes) => {
          this.toastrService.error(
            errorRes.error,
            'Register Failed')
        }
      })
    );
  };

  logout() {
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }

  private setUserToLocalStorage(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromLocalStorage():User {
      const userJson = localStorage.getItem(USER_KEY);
      if(userJson) return JSON.parse(userJson) as User;
      return new User();
  }

}
