import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuCategory } from './menu-category.model';
import { MenuCategoryService } from './menu-category.service';
import { Menu, MenuService } from '../menu';

@Component({
  selector: 'page-menu-category-update',
  templateUrl: 'menu-category-update.html',
})
export class MenuCategoryUpdatePage implements OnInit {
  menuCategory: MenuCategory;
  menus: Menu[];
  createdDate: string;
  lastModifiedDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = inject(FormBuilder).group({
    id: [null, []],
    name: [null, [Validators.required]],
    description: [null, []],
    displayOrder: [null, [Validators.required]],
    active: ['false', [Validators.required]],
    createdDate: [null, []],
    lastModifiedDate: [null, []],
    menuId: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private menuService: MenuService,
    private menuCategoryService: MenuCategoryService,
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.menuService.query().subscribe(
      data => {
        this.menus = data.body;
      },
      error => this.onError(error),
    );
    this.activatedRoute.data.subscribe(response => {
      this.menuCategory = response.data;
      this.isNew = this.menuCategory.id === null || this.menuCategory.id === undefined;
      this.updateForm(this.menuCategory);
    });
  }

  updateForm(menuCategory: MenuCategory) {
    this.form.patchValue({
      id: menuCategory.id,
      name: menuCategory.name,
      description: menuCategory.description,
      displayOrder: menuCategory.displayOrder,
      active: menuCategory.active,
      createdDate: this.isNew ? new Date().toISOString() : menuCategory.createdDate,
      lastModifiedDate: this.isNew ? new Date().toISOString() : menuCategory.lastModifiedDate,
      menuId: menuCategory.menuId,
    });
  }

  save() {
    this.isSaving = true;
    const menuCategory = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.menuCategoryService.update(menuCategory));
    } else {
      this.subscribeToSaveResponse(this.menuCategoryService.create(menuCategory));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `MenuCategory ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/menu-category');
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

  compareMenu(first: Menu, second: Menu): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackMenuById(index: number, item: Menu) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<MenuCategory>>) {
    result.subscribe(
      (res: HttpResponse<MenuCategory>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error),
    );
  }

  private createFromForm(): MenuCategory {
    return {
      ...new MenuCategory(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      description: this.form.get(['description']).value,
      displayOrder: this.form.get(['displayOrder']).value,
      active: this.form.get(['active']).value,
      createdDate: new Date(this.form.get(['createdDate']).value),
      lastModifiedDate: new Date(this.form.get(['lastModifiedDate']).value),
      menuId: this.form.get(['menuId']).value,
    };
  }
}
