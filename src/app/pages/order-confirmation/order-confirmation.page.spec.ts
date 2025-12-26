import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { OrderConfirmationPage } from './order-confirmation.page';
import { CartService } from '#app/services/cart/cart.service';
import { OrderService } from '#app/pages/entities/order/order.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OrderConfirmationPage', () => {
  let component: OrderConfirmationPage;
  let fixture: ComponentFixture<OrderConfirmationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderConfirmationPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [CartService, OrderService],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderConfirmationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
