import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ThreadService} from "./ThreadService";

@NgModule({
	imports:      [
		CommonModule,
	],
	providers:    [
		ThreadService
	],
	declarations: [],
	exports:      [
		//ThreadService
	]
})
export class ThreadModule
{

}
