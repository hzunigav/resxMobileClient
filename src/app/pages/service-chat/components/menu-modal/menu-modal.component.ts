import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { MenuService } from '#app/pages/entities/menu/menu.service';
import { MenuCategoryService } from '#app/pages/entities/menu-category/menu-category.service';
import { MenuItemService } from '#app/pages/entities/menu-item/menu-item.service';
import { MenuItemSizeService } from '#app/pages/entities/menu-item-size/menu-item-size.service';
import { CartService } from '#app/services/cart/cart.service';
import { Menu } from '#app/pages/entities/menu/menu.model';
import { MenuCategory } from '#app/pages/entities/menu-category/menu-category.model';
import { MenuItem } from '#app/pages/entities/menu-item/menu-item.model';
import { MenuItemSize } from '#app/pages/entities/menu-item-size/menu-item-size.model';

@Component({
  selector: 'app-menu-modal',
  templateUrl: './menu-modal.component.html',
  styleUrls: ['./menu-modal.component.scss'],
})
export class MenuModalComponent implements OnInit {
  restaurantId: number | null = null;
  menu: Menu | null = null;
  categories: MenuCategory[] = [];
  menuItems: MenuItem[] = [];
  menuItemSizes: MenuItemSize[] = [];
  selectedCategory: MenuCategory | null = null;
  filteredItems: MenuItem[] = [];
  isLoading = true;

  constructor(
    private modalController: ModalController,
    private menuService: MenuService,
    private menuCategoryService: MenuCategoryService,
    private menuItemService: MenuItemService,
    private menuItemSizeService: MenuItemSizeService,
    private cartService: CartService,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    if (this.restaurantId) {
      this.loadMenu();
    }
  }

  private loadMenu() {
    this.isLoading = true;

    // Load menu for restaurant
    this.menuService.query({ 'restaurantId.equals': this.restaurantId }).subscribe(
      response => {
        const menus = response.body || [];
        if (menus.length > 0) {
          this.menu = menus[0];
          this.loadCategories();
        } else {
          this.isLoading = false;
          this.showError('No menu found for this restaurant');
        }
      },
      error => {
        console.error('Error loading menu:', error);
        this.isLoading = false;
        this.showError('Failed to load menu');
      },
    );
  }

  private loadCategories() {
    if (!this.menu?.id) {
      return;
    }

    this.menuCategoryService.query({ 'menuId.equals': this.menu.id }).subscribe(
      response => {
        this.categories = response.body || [];
        if (this.categories.length > 0) {
          this.selectedCategory = this.categories[0];
          this.loadMenuItems();
        } else {
          this.isLoading = false;
        }
      },
      error => {
        console.error('Error loading categories:', error);
        this.isLoading = false;
        this.showError('Failed to load menu categories');
      },
    );
  }

  private loadMenuItems() {
    if (!this.menu?.id) {
      return;
    }

    this.menuItemService.query({ 'menuId.equals': this.menu.id }).subscribe(
      response => {
        this.menuItems = response.body || [];
        this.loadMenuItemSizes();
      },
      error => {
        console.error('Error loading menu items:', error);
        this.isLoading = false;
        this.showError('Failed to load menu items');
      },
    );
  }

  private loadMenuItemSizes() {
    this.menuItemSizeService.query().subscribe(
      response => {
        this.menuItemSizes = response.body || [];
        this.filterItemsByCategory();
        this.isLoading = false;
      },
      error => {
        console.error('Error loading menu item sizes:', error);
        this.isLoading = false;
      },
    );
  }

  selectCategory(category: MenuCategory) {
    this.selectedCategory = category;
    this.filterItemsByCategory();
  }

  private filterItemsByCategory() {
    if (!this.selectedCategory) {
      this.filteredItems = this.menuItems;
    } else {
      this.filteredItems = this.menuItems.filter(item => item.categoryId === this.selectedCategory?.id);
    }
  }

  getItemSizes(menuItem: MenuItem): MenuItemSize[] {
    return this.menuItemSizes.filter(size => size.menuItemId === menuItem.id);
  }

  addToCart(menuItem: MenuItem, size?: MenuItemSize) {
    const sizeId = size?.id || null;
    this.cartService.addToCart(menuItem, sizeId);

    this.showSuccess(`${menuItem.name} added to cart`);
  }

  async viewCart() {
    await this.modalController.dismiss({ action: 'view-cart' });
  }

  async close() {
    await this.modalController.dismiss();
  }

  private async showSuccess(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    toast.present();
  }

  private async showError(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color: 'danger',
    });
    toast.present();
  }
}
