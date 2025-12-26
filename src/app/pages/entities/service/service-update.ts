import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Service } from './service.model';
import { ServiceService } from './service.service';
import { Restaurant, RestaurantService } from '../restaurant';
import { Table, TableService } from '../table';
import { User } from '#app/services/user/user.model';
import { UserService } from '#app/services/user/user.service';

@Component({
  selector: 'page-service-update',
  templateUrl: 'service-update.html',
})
export class ServiceUpdatePage implements OnInit {
  service: Service;
  restaurants: Restaurant[];
  tables: Table[];
  users: User[];
  initiatedAt: string;
  acknowledgedAt: string;
  completedAt: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = inject(FormBuilder).group({
    id: [null, []],
    status: [null, [Validators.required]],
    initiatedAt: [null, [Validators.required]],
    acknowledgedAt: [null, []],
    completedAt: [null, []],
    restaurantId: [null, [Validators.required]],
    tableId: [null, [Validators.required]],
    customerId: [null, [Validators.required]],
    serverId: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private restaurantService: RestaurantService,
    private tableService: TableService,
    private userService: UserService,
    private serviceService: ServiceService,
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.restaurantService.query().subscribe(
      data => {
        this.restaurants = data.body;
      },
      error => this.onError(error),
    );
    this.tableService.query().subscribe(
      data => {
        this.tables = data.body;
      },
      error => this.onError(error),
    );
    this.userService.findAll().subscribe(
      data => (this.users = data),
      error => this.onError(error),
    );
    this.activatedRoute.data.subscribe(response => {
      this.service = response.data;
      this.isNew = this.service.id === null || this.service.id === undefined;
      this.updateForm(this.service);
    });
  }

  updateForm(service: Service) {
    this.form.patchValue({
      id: service.id,
      status: service.status,
      initiatedAt: this.isNew ? new Date().toISOString() : service.initiatedAt,
      acknowledgedAt: this.isNew ? new Date().toISOString() : service.acknowledgedAt,
      completedAt: this.isNew ? new Date().toISOString() : service.completedAt,
      restaurantId: service.restaurantId,
      tableId: service.tableId,
      customerId: service.customerId,
      serverId: service.serverId,
    });
  }

  save() {
    this.isSaving = true;
    const service = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.serviceService.update(service));
    } else {
      this.subscribeToSaveResponse(this.serviceService.create(service));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Service ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/service');
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

  compareRestaurant(first: Restaurant, second: Restaurant): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackRestaurantById(index: number, item: Restaurant) {
    return item.id;
  }
  compareTable(first: Table, second: Table): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackTableById(index: number, item: Table) {
    return item.id;
  }
  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Service>>) {
    result.subscribe(
      (res: HttpResponse<Service>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error),
    );
  }

  private createFromForm(): Service {
    return {
      ...new Service(),
      id: this.form.get(['id']).value,
      status: this.form.get(['status']).value,
      initiatedAt: new Date(this.form.get(['initiatedAt']).value),
      acknowledgedAt: new Date(this.form.get(['acknowledgedAt']).value),
      completedAt: new Date(this.form.get(['completedAt']).value),
      restaurantId: this.form.get(['restaurantId']).value,
      tableId: this.form.get(['tableId']).value,
      customerId: this.form.get(['customerId']).value,
      serverId: this.form.get(['serverId']).value,
    };
  }
}
