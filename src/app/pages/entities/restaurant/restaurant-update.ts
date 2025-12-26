import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Restaurant } from './restaurant.model';
import { RestaurantService } from './restaurant.service';
import { Tenant, TenantService } from '../tenant';

@Component({
  selector: 'page-restaurant-update',
  templateUrl: 'restaurant-update.html',
})
export class RestaurantUpdatePage implements OnInit {
  restaurant: Restaurant;
  tenants: Tenant[];
  createdDate: string;
  lastModifiedDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = inject(FormBuilder).group({
    id: [null, []],
    name: [null, [Validators.required]],
    slug: [null, [Validators.required]],
    description: [null, []],
    address: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    email: [null, []],
    active: ['false', [Validators.required]],
    logoUrl: [null, []],
    createdDate: [null, []],
    lastModifiedDate: [null, []],
    tenantId: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private tenantService: TenantService,
    private restaurantService: RestaurantService,
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.tenantService.query().subscribe(
      data => {
        this.tenants = data.body;
      },
      error => this.onError(error),
    );
    this.activatedRoute.data.subscribe(response => {
      this.restaurant = response.data;
      this.isNew = this.restaurant.id === null || this.restaurant.id === undefined;
      this.updateForm(this.restaurant);
    });
  }

  updateForm(restaurant: Restaurant) {
    this.form.patchValue({
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      description: restaurant.description,
      address: restaurant.address,
      phone: restaurant.phone,
      email: restaurant.email,
      active: restaurant.active,
      logoUrl: restaurant.logoUrl,
      createdDate: this.isNew ? new Date().toISOString() : restaurant.createdDate,
      lastModifiedDate: this.isNew ? new Date().toISOString() : restaurant.lastModifiedDate,
      tenantId: restaurant.tenantId,
    });
  }

  save() {
    this.isSaving = true;
    const restaurant = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.restaurantService.update(restaurant));
    } else {
      this.subscribeToSaveResponse(this.restaurantService.create(restaurant));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Restaurant ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/restaurant');
  }

  previousState() {
    window.history.back();
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
    await toast.present();
  }

  compareTenant(first: Tenant, second: Tenant): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackTenantById(index: number, item: Tenant) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Restaurant>>) {
    result.subscribe(
      (res: HttpResponse<Restaurant>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error),
    );
  }

  private createFromForm(): Restaurant {
    return {
      ...new Restaurant(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      slug: this.form.get(['slug']).value,
      description: this.form.get(['description']).value,
      address: this.form.get(['address']).value,
      phone: this.form.get(['phone']).value,
      email: this.form.get(['email']).value,
      active: this.form.get(['active']).value,
      logoUrl: this.form.get(['logoUrl']).value,
      createdDate: new Date(this.form.get(['createdDate']).value),
      lastModifiedDate: new Date(this.form.get(['lastModifiedDate']).value),
      tenantId: this.form.get(['tenantId']).value,
    };
  }
}
