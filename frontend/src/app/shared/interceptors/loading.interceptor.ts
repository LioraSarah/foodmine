import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';

let pendingRequests = 0;
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loadingService.loadingStart();
    pendingRequests++;
    return next.handle(request).pipe(
      tap({
        next: (event) => {
          //checks if http request has finished
          if (event.type === HttpEventType.Response) {
            this.handleLoadingEnd();
          }
        },
        error: () => {
          this.handleLoadingEnd();
        }
      })
    );
  }

  handleLoadingEnd () {
    pendingRequests--;
    if (pendingRequests === 0) {
      this.loadingService.loadingEnd();
    }
  }
}
