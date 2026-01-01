import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-check',
  templateUrl: './check.page.html',
  styleUrls: ['./check.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CheckPage implements OnInit {
  serviceId: number | null = null;
  check: any = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.serviceId = parseInt(id, 10);
      this.loadCheck();
    } else {
      this.error = 'No service ID provided';
      this.loading = false;
    }
  }

  loadCheck() {
    if (!this.serviceId) return;

    this.loading = true;
    this.error = null;

    this.serviceService.getCheck(this.serviceId).subscribe({
      next: (data) => {
        this.check = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading check:', err);
        this.error = err.error?.message || 'Failed to load check. Please try again.';
        this.loading = false;
      }
    });
  }

  handleRefresh(event: any) {
    this.loadCheck();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}
