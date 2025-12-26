import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { OrderStatusPage } from './order-status.page';
import { OrderService } from '#app/pages/entities/order/order.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OrderStatusPage', () => {
  let component: OrderStatusPage;
  let fixture: ComponentFixture<OrderStatusPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderStatusPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        OrderService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
