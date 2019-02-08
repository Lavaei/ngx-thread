# ngx-thread
The `ngx-thread` package implements multi-threading in Angular using [Web Worker]. 

You can find full example in the sample directory of the source, but we want to teach you how to use `ngx-thread` step
 by step.

#### Requirements

| package         | version |
|-----------------|---------|
| @angular/common | ^7.1.0  |
| @angular/core   | ^7.1.0  |


#### How to use

to use `ngx-thread` you should import `ThreadModule` in to the your module.

	import {BrowserModule} from '@angular/platform-browser';
    import {NgModule} from '@angular/core';
    
    import {AppRoutingModule} from './app-routing.module';
    import {AppComponent} from './app.component';
    import {ThreadModule} from "ngx-thread";
    
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

Now you can inject `ThreadService` in the component that you want to use package:

	constructor(protected _threadService: ThreadService)
    {

    }

After injecting `ThreadService`, you need a function to run it in the another thread. 
for example we write following heavy function:

	sumInMainThread(input:number)
    {
        console.log(`The input is ${input}`);
        
        let result = 0;

        for (let i = 1; i <= input; i++)
        {
            result += i;
        }

        return result;
    }

To run above function in another thread we should create a `Thread` object:

	let thread:Thread = this._threadService.createByFunction(this.sumInAnotherThread, 1000000000)

`createByFunction()` accepts two argument. 
The first argument is the function you want to run in another thread.
The second argument is the argument that you want to pass to the given function.
You can`t pass multiple argument, but you can pass an object as argument:

	let thread:Thread = this._threadService.createByFunction(this.sumInAnotherThread, {arg1: val1, arg2: val2})
	
Now you have a `Thread` object. You can run it by calling `run()`. 
`run()` returns an `Observable` so you should `subscribe()` to it.

	thread.run().subscribe(
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
    
If you want to send progress, you can use `postMessage()` function.
But before use it, you should declare it above of your component declaration:

	declare function postMessage(message: ThreadMessageContract): void;
	
Now you can use it:

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

[Web Worker]: https://www.w3schools.com/html/html5_webworkers.asp
