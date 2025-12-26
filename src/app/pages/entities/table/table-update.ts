import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Table } from './table.model';
import { TableService } from './table.service';
import { Restaurant, RestaurantService } from '../restaurant';

@Component({
  selector: 'page-table-update',
  templateUrl: 'table-update.html',
})
export class TableUpdatePage implements OnInit {
  table: Table;
  restaurants: Restaurant[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = inject(FormBuilder).group({
    id: [null, []],
    tableNumber: [null, [Validators.required]],
    capacity: [null, []],
    qrCodeUrl: [null, []],
    qrToken: [null, []],
    active: ['false', [Validators.required]],
    restaurantId: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private restaurantService: RestaurantService,
    private tableService: TableService,
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
    this.activatedRoute.data.subscribe(response => {
      this.table = response.data;
      this.isNew = this.table.id === null || this.table.id === undefined;
      this.updateForm(this.table);
    });
  }

  updateForm(table: Table) {
    this.form.patchValue({
      id: table.id,
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      qrCodeUrl: table.qrCodeUrl,
      qrToken: table.qrToken,
      active: table.active,
      restaurantId: table.restaurantId,
    });
  }

  save() {
    this.isSaving = true;
    const table = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.tableService.update(table));
    } else {
      this.subscribeToSaveResponse(this.tableService.create(table));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Table ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/table');
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Table>>) {
    result.subscribe(
      (res: HttpResponse<Table>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error),
    );
  }

  private createFromForm(): Table {
    return {
      ...new Table(),
      id: this.form.get(['id']).value,
      tableNumber: this.form.get(['tableNumber']).value,
      capacity: this.form.get(['capacity']).value,
      qrCodeUrl: this.form.get(['qrCodeUrl']).value,
      qrToken: this.form.get(['qrToken']).value,
      active: this.form.get(['active']).value,
      restaurantId: this.form.get(['restaurantId']).value,
    };
  }
}
