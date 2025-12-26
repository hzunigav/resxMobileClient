import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuItem } from './menu-item.model';
import { MenuItemService } from './menu-item.service';
import { MenuCategory, MenuCategoryService } from '../menu-category';

@Component({
  selector: 'page-menu-item-update',
  templateUrl: 'menu-item-update.html',
})
export class MenuItemUpdatePage implements OnInit {
  menuItem: MenuItem;
  menuCategories: MenuCategory[];
  createdDate: string;
  lastModifiedDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = inject(FormBuilder).group({
    id: [null, []],
    name: [null, [Validators.required]],
    description: [null, []],
    basePrice: [null, [Validators.required]],
    imageUrl: [null, []],
    active: ['false', [Validators.required]],
    featured: ['false', []],
    availableForBreakfast: ['false', [Validators.required]],
    availableForLunch: ['false', [Validators.required]],
    availableForDinner: ['false', [Validators.required]],
    displayOrder: [null, [Validators.required]],
    createdDate: [null, []],
    lastModifiedDate: [null, []],
    categoryId: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private menuCategoryService: MenuCategoryService,
    private menuItemService: MenuItemService,
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.menuCategoryService.query().subscribe(
      data => {
        this.menuCategories = data.body;
      },
      error => this.onError(error),
    );
    this.activatedRoute.data.subscribe(response => {
      this.menuItem = response.data;
      this.isNew = this.menuItem.id === null || this.menuItem.id === undefined;
      this.updateForm(this.menuItem);
    });
  }

  updateForm(menuItem: MenuItem) {
    this.form.patchValue({
      id: menuItem.id,
      name: menuItem.name,
      description: menuItem.description,
      basePrice: menuItem.basePrice,
      imageUrl: menuItem.imageUrl,
      active: menuItem.active,
      featured: menuItem.featured,
      availableForBreakfast: menuItem.availableForBreakfast,
      availableForLunch: menuItem.availableForLunch,
      availableForDinner: menuItem.availableForDinner,
      displayOrder: menuItem.displayOrder,
      createdDate: this.isNew ? new Date().toISOString() : menuItem.createdDate,
      lastModifiedDate: this.isNew ? new Date().toISOString() : menuItem.lastModifiedDate,
      categoryId: menuItem.categoryId,
    });
  }

  save() {
    this.isSaving = true;
    const menuItem = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.menuItemService.update(menuItem));
    } else {
      this.subscribeToSaveResponse(this.menuItemService.create(menuItem));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `MenuItem ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/menu-item');
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

  compareMenuCategory(first: MenuCategory, second: MenuCategory): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackMenuCategoryById(index: number, item: MenuCategory) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<MenuItem>>) {
    result.subscribe(
      (res: HttpResponse<MenuItem>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error),
    );
  }

  private createFromForm(): MenuItem {
    return {
      ...new MenuItem(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      description: this.form.get(['description']).value,
      basePrice: this.form.get(['basePrice']).value,
      imageUrl: this.form.get(['imageUrl']).value,
      active: this.form.get(['active']).value,
      featured: this.form.get(['featured']).value,
      availableForBreakfast: this.form.get(['availableForBreakfast']).value,
      availableForLunch: this.form.get(['availableForLunch']).value,
      availableForDinner: this.form.get(['availableForDinner']).value,
      displayOrder: this.form.get(['displayOrder']).value,
      createdDate: new Date(this.form.get(['createdDate']).value),
      lastModifiedDate: new Date(this.form.get(['lastModifiedDate']).value),
      categoryId: this.form.get(['categoryId']).value,
    };
  }
}
