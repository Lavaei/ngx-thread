import {Thread} from "./Thread";
import {Injectable} from "@angular/core";

@Injectable()
export class ThreadService
{

	/**
	 * Define a Weak Map to map function to URL
	 */
	protected _workerFunctionToUrlMap = new WeakMap<Function, string>();


	/**
	 * Run given function in another thread
	 * @param threadFunction
	 * @param data
	 */
	createByFunction<T>(threadFunction: Function, data?: any): Thread
	{

		/**
		 * Create a virtual URL for given function
		 */
		const url = this._getOrCreateWorkerUrl(threadFunction);

		/**
		 * Run virtual URL in another thread
		 */
		return this.createByURL(url, data);
	}

	/**
	 * Run URL in another thread
	 * @param url Path to the js file that you want to run in another thread
	 * @param data
	 */
	createByURL(url: string, data?: any): Thread
	{
		return new Thread(new Worker(url), data);
	}


	/**
	 * Create a virtual URL for given function if the function is new, or return previously created virtual URL
	 * @param {Function} fn
	 */
	protected _getOrCreateWorkerUrl(fn: Function): string
	{
		/**
		 * Check whether a virtual URL already created for given function or not
		 */
		if (!this._workerFunctionToUrlMap.has(fn))
		{
			/**
			 * Create virtual URL for given function
			 */
			const url = this._createWorkerUrl(fn);

			/**
			 * Keep the virtual URL in a map
			 */
			this._workerFunctionToUrlMap.set(fn, url);

			/**
			 * Return the URL
			 */
			return url;
		}

		/**
		 * Return the previously created virtual URL
		 */
		return this._workerFunctionToUrlMap.get(fn);
	}

	/**
	 * Create a virtual URL for given function
	 * @param {Function} fn
	 */
	protected _createWorkerUrl(resolve: Function): string
	{
		/**
		 * Build the template
		 */
		const template = `		
		
		 self.addEventListener('message', function(event) {	
		 
			    if(!event || !event.data || event.data.type !== 'run')
			        return;
		 
                postMessage(
                    {
                        type: 'success',
                        data: ${resolve.toString()}(event.data.data)
                    }
                );
         });
        `;

		/**
		 * Create the blob
		 */
		const blob = new Blob([template], {type: 'text/javascript'});

		/**
		 * Create virtual URL for given blob
		 */
		return URL.createObjectURL(blob);
	}

}
