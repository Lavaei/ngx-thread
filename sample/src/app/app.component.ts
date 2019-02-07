import {Component} from '@angular/core';
import {WebWorkerService} from 'ngx-web-worker';
import {ThreadService} from "ngx-thread";

declare function postMessage(message: any): void;

@Component({
	selector:    'app-root',
	templateUrl: './app.component.html',
	styleUrls:   ['./app.component.scss'],
	providers:   [ThreadService]
})
export class AppComponent
{
	constructor(protected _threadService: ThreadService)
	{

	}

	/**
	 * Calculate sum in another thread
	 * @param input
	 */
	calcSumInAnotherThread(input)
	{
		this._threadService.createByFunction(this.sumInAnotherThread, input).run().subscribe(
			result => {

				if (result.type === 'success')
				{
					console.log("The final result is", result.data)
				}
				else
				{
					console.log(`${result.data}% is done`)
				}
			},
			() => {
				console.log("Error");
			},
			() => {
				console.log("Complete");
			}
		);
	}

	/**
	 * Calculate sum in main thread
	 * @param input
	 */
	calcSumInMainThread(input)
	{
		console.log("The final result is " + this.sumInMainThread(input))
	}

	/**
	 * Calculate sum (suitable to run in another thread)
	 * @param input
	 */
	sumInAnotherThread(input: number)
	{

		console.log(`The input is ${input}`)

		let result = 0;

		for (let i = 1; i <= input; i++)
		{
			result += i;

			if (i % (input / 100) === 0)
			{
				postMessage(
					{
						type: 'progress',
						data: Math.round((i / input) * 100)
					}
				);
			}

		}


		return result;
	}

	/**
	 * Calculate sum (suitable to run in main thread)
	 * @param input
	 */
	sumInMainThread(input:number)
	{
		console.log(`The input is ${input}`)

		let result = 0;

		for (let i = 1; i <= input; i++)
		{
			result += i;

			if (i % (input / 100) === 0)
			{
				postMessage(
					{
						type: 'progress',
						data: Math.round((i / input) * 100)
					}
				);
			}

		}


		return result;
	}
}
