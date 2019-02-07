export interface ThreadMessageContract
{
	type: ThreadMessageType;
	data: any;
}

export type ThreadMessageType = 'run' | 'progress' | 'success' | 'error';