import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuItemSize } from './menu-item-size.model';
import { MenuItemSizeService } from './menu-item-size.service';
import { MenuItem, MenuItemService } from '../menu-item';

@Component({
  selector: 'page-menu-item-size-update',
  templateUrl: 'menu-item-size-update.html',
})
export class MenuItemSizeUpdatePage implements OnInit {
  menuItemSize: MenuItemSize;
  menuItems: MenuItem[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = inject(FormBuilder).group({
    id: [null, []],
    sizeName: [null, [Validators.required]],
    price: [null, [Validators.required]],
    displayOrder: [null, [Validators.required]],
    active: ['false', [Validators.required]],
    menuItemId: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private menuItemService: MenuItemService,
    private menuItemSizeService: MenuItemSizeService,
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.menuItemService.query().subscribe(
      data => {
        this.menuItems = data.body;
      },
      error => this.onError(error),
    );
    this.activatedRoute.data.subscribe(response => {
      this.menuItemSize = response.data;
      this.isNew = this.menuItemSize.id === null || this.menuItemSize.id === undefined;
      this.updateForm(this.menuItemSize);
    });
  }

  updateForm(menuItemSize: MenuItemSize) {
    this.form.patchValue({
      id: menuItemSize.id,
      sizeName: menuItemSize.sizeName,
      price: menuItemSize.price,
      displayOrder: menuItemSize.displayOrder,
      active: menuItemSize.active,
      menuItemId: menuItemSize.menuItemId,
    });
  }

  save() {
    this.isSaving = true;
    const menuItemSize = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.menuItemSizeService.update(menuItemSize));
    } else {
      this.subscribeToSaveResponse(this.menuItemSizeService.create(menuItemSize));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `MenuItemSize ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/menu-item-size');
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

  compareMenuItem(first: MenuItem, second: MenuItem): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackMenuItemById(index: number, item: MenuItem) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<MenuItemSize>>) {
    result.subscribe(
      (res: HttpResponse<MenuItemSize>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error),
    );
  }

  private createFromForm(): MenuItemSize {
    return {
      ...new MenuItemSize(),
      id: this.form.get(['id']).value,
      sizeName: this.form.get(['sizeName']).value,
      price: this.form.get(['price']).value,
      displayOrder: this.form.get(['displayOrder']).value,
      active: this.form.get(['active']).value,
      menuItemId: this.form.get(['menuItemId']).value,
    };
  }
}
