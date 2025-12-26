import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { ServiceChatPage } from './service-chat.page';

describe('ServiceChatPage', () => {
  let component: ServiceChatPage;
  let fixture: ComponentFixture<ServiceChatPage>;

  beforeEach(async () => {
    const activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: () => '123',
        },
      },
    };

    const navControllerStub = {
      back: jasmine.createSpy('back'),
    };

    await TestBed.configureTestingModule({
      declarations: [ServiceChatPage],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: NavController, useValue: navControllerStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extract service ID from route', () => {
    expect(component.serviceId).toBe(123);
  });
});
