import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ThreadModule} from 'ngx-thread';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

@NgModule({
	declarations: [
		AppComponent
	],
	imports:      [
		BrowserModule,
		AppRoutingModule,
		ThreadModule
	],
	providers:    [],
	bootstrap:    [AppComponent]
})
export class AppModule
{
}
