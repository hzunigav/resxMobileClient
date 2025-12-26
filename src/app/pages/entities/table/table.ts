import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Table } from './table.model';
import { TableService } from './table.service';

@Component({
  selector: 'page-table',
  templateUrl: 'table.html',
})
export class TablePage {
  tables: Table[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private tableService: TableService,
    private toastCtrl: ToastController,
    public plt: Platform,
  ) {
    this.tables = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.tableService
      .query()
      .pipe(
        filter((res: HttpResponse<Table[]>) => res.ok),
        map((res: HttpResponse<Table[]>) => res.body),
      )
      .subscribe(
        (response: Table[]) => {
          this.tables = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async error => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          await toast.present();
        },
      );
  }

  trackId(index: number, item: Table) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/table/new');
  }

  async edit(item: IonItemSliding, table: Table) {
    await this.navController.navigateForward('/tabs/entities/table/' + table.id + '/edit');
    await item.close();
  }

  async delete(table) {
    this.tableService.delete(table.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Table deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error),
    );
  }

  async view(table: Table) {
    await this.navController.navigateForward('/tabs/entities/table/' + table.id + '/view');
  }
}
