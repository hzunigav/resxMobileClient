import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Menu } from './menu.model';
import { MenuService } from './menu.service';
import { Restaurant, RestaurantService } from '../restaurant';

@Component({
  selector: 'page-menu-update',
  templateUrl: 'menu-update.html',
})
export class MenuUpdatePage implements OnInit {
  menu: Menu;
  restaurants: Restaurant[];
  createdDate: string;
  lastModifiedDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = inject(FormBuilder).group({
    id: [null, []],
    name: [null, [Validators.required]],
    description: [null, []],
    active: ['false', [Validators.required]],
    createdDate: [null, []],
    lastModifiedDate: [null, []],
    restaurantId: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private restaurantService: RestaurantService,
    private menuService: MenuService,
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
      this.menu = response.data;
      this.isNew = this.menu.id === null || this.menu.id === undefined;
      this.updateForm(this.menu);
    });
  }

  updateForm(menu: Menu) {
    this.form.patchValue({
      id: menu.id,
      name: menu.name,
      description: menu.description,
      active: menu.active,
      createdDate: this.isNew ? new Date().toISOString() : menu.createdDate,
      lastModifiedDate: this.isNew ? new Date().toISOString() : menu.lastModifiedDate,
      restaurantId: menu.restaurantId,
    });
  }

  save() {
    this.isSaving = true;
    const menu = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.menuService.update(menu));
    } else {
      this.subscribeToSaveResponse(this.menuService.create(menu));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Menu ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/menu');
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Menu>>) {
    result.subscribe(
      (res: HttpResponse<Menu>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error),
    );
  }

  private createFromForm(): Menu {
    return {
      ...new Menu(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      description: this.form.get(['description']).value,
      active: this.form.get(['active']).value,
      createdDate: new Date(this.form.get(['createdDate']).value),
      lastModifiedDate: new Date(this.form.get(['lastModifiedDate']).value),
      restaurantId: this.form.get(['restaurantId']).value,
    };
  }
}
