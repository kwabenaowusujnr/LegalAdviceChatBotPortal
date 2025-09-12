import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Loader2, LucideAngularModule } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-loading-overlay',
  imports: [CommonModule,LucideAngularModule],
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.css'
})
export class LoadingOverlayComponent {
  @Input() isVisible = false
  @Input() message = "Loading..."
  @Input() showMessage = true

  // Lucide icon
  loaderIcon = Loader2

  private subscription : Subscription =  new Subscription();

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.loadingService.isloading$.subscribe((isLoading) => {
        this.isVisible = isLoading
      }),
    )

    this.subscription.add(
      this.loadingService.loadingMessage$.subscribe((message) => {
        this.message = message
      }),
    )

  }
    //this.isVisible = this.loadingService.isLoading;

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
