import {Observable, Observer, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {ThreadMessageContract} from "./ThreadMessageContract";


export class Thread
{
	/**
	 * The Web Worker instance
	 */
	protected _worker: Worker;

	/**
	 * The function`s input
	 */
	protected _input:any;

	/**
	 * The thread constructor
	 * @param {Worker} worker An instance of Web Worker
	 * @param {any} input The function`s input
	 */
	constructor(worker: Worker, input?:any)
	{
		/**
		 * Keep given Web Worker in a global variable
		 */
		this._worker = worker;

		/**
		 * Keep the input in a global variable
		 */
		this._input = input;
	}

	run(): Observable<ThreadMessageContract>
	{
		/**
		 * @todo Terminate on success same as on error
		 */
		return Observable.create(
			(observer: Observer<ThreadMessageContract>) => {

				/**
				 * Add event listener for messages
				 */
				this._worker.addEventListener('message', message => {

					/**
					 * Get thread message from Web Worker message event
					 */
					let threadMessage:ThreadMessageContract = message.data;

					/**
					 * If the message structure not valid, ignore the message
					 */
					if(!threadMessage || !threadMessage.type)
					{
						return;
					}

					/**
					 * Act depend on the message`s type
					 */
					switch (threadMessage.type)
					{
						case 'success':
							/**
							 * Send the message
							 */
							observer.next(
								{
									type: 'success',
									data: threadMessage.data
								}
							);

							/**
							 * Mark observable as completed
							 */
							observer.complete();

							/**
							 * Terminate the thread
							 */
							this.terminate();
							break;

						case 'progress':
							/**
							 * Just send the message
							 */
							observer.next(
								{
									type: 'progress',
									data: threadMessage.data
								}
							);
							break;

						case 'error':

							/**
							 * Throw the error
							 */
							observer.error(
								{
									type: 'error',
									data: threadMessage.data
								}
							);

							break;
					}
				});

				/**
				 * Add event listener for exceptions
				 */
				this._worker.addEventListener('error', error => observer.error(error));


				this._worker.postMessage(
					{
						type: 'run',
						data: this._input
					}
				);
			}
		).pipe(
			catchError((error) => {
				/**
				 * Terminate the thread
				 */
				this.terminate();

				/**
				 * Throw the error
				 */
				return throwError(error);
			})
		)
	}

	/**
	 * Terminate the thread
	 */
	terminate()
	{
		this._worker.terminate();
	}
}
