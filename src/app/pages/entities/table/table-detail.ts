import { Component, OnInit } from '@angular/core';
import { Table } from './table.model';
import { TableService } from './table.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-table-detail',
  templateUrl: 'table-detail.html',
})
export class TableDetailPage implements OnInit {
  table: Table = {};

  constructor(
    private navController: NavController,
    private tableService: TableService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.table = response.data;
    });
  }

  open(item: Table) {
    this.navController.navigateForward('/tabs/entities/table/' + item.id + '/edit');
  }

  async deleteModal(item: Table) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.tableService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/table');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
