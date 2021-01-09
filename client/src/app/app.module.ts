import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from './app-routing/app-routing.module';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { KafkaStreamConsumerComponent } from './components/kafka-stream-consumer/kafka-stream-consumer.component';
import {NgxsWebsocketPluginModule} from "@ngxs/websocket-plugin";
import {KafkaState} from "./state/kafka.state";
import {NgxsModule} from "@ngxs/store";
import { SpeedComponent } from './components/charts/speed/speed.component';
import {FormsModule} from "@angular/forms";
import { DonutComponent } from './components/charts/donut/donut.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    KafkaStreamConsumerComponent,
    SpeedComponent,
    DonutComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgxsModule.forRoot([
            KafkaState
        ]),
        NgxsWebsocketPluginModule.forRoot({
            url: 'ws://localhost:8080/websocket'
        }),
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
