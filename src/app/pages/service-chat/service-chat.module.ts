import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ServiceChatPageRoutingModule } from './service-chat-routing.module';
import { ServiceChatPage } from './service-chat.page';
import { MenuModalComponent } from './components/menu-modal/menu-modal.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule, ServiceChatPageRoutingModule],
  declarations: [ServiceChatPage, MenuModalComponent],
})
export class ServiceChatPageModule {}
