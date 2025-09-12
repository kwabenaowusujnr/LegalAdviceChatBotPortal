import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface LoadingState {
  isLoading: boolean,
  message?: string
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<LoadingState>({ isLoading: false, message: 'Loading...' });
  public loadingState$ = this.loadingSubject.asObservable();

  showLoading(message: string = 'Loading...') {
    this.loadingSubject.next({ isLoading: true, message });
  }

  hideLoading() {
    this.loadingSubject.next({ isLoading: false, message: '' });
  }

  // get isLoading(): boolean {
  //   return this.loadingSubject.value.isLoading;
  // }

  // get loadingMessage(): string {
  //   return this.loadingSubject.value.message || 'Loading...';
  // }

  get isloading$() {
    return this.loadingState$.pipe(map(state => state.isLoading));
  }

  get loadingMessage$() {
    return this.loadingState$.pipe(map(state => state.message || 'Loading...'));
  }

}
