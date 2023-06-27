type TSingleton = {
	[name: string]: any
};

type TResolves = {
	// eslint-disable-next-line @typescript-eslint/ban-types
	[name: string]: Function[]
}

export const singletons: TSingleton = {};
const resolves: TResolves = {};

export function Register(instance: any) {
	const {
		mounted
	} = instance;

	let name: string = null;
	// eslint-disable-next-line @typescript-eslint/ban-types
	let wait_for_resolves: Function[] = [];

	function Getter() {
		return Get(name);
	}

	return {
		...instance,

		This: Getter,
		Self: Getter,

		/**
		 * Local `WaitFor` function.
		 */
		async WaitFor() {
			if (name == null)
				await new Promise(resolve => {
					wait_for_resolves.push(resolve);
				});

			return await WaitFor(name);
		},

		mounted() {
			// Call `mounted` hook first.

			if (mounted != null)
				mounted.apply(this);


			// Record name as identifier.

			name = this.$.type.name;
			

			// Call local `WaitFor` resolves.

			for (const resolve of wait_for_resolves)
				resolve();

			wait_for_resolves = null;


			// Check for duplicates.

			if (name in singletons)
				throw new Error(`[Singleton] Component '${name}' already exists!`);


			// Register.

			singletons[name] = this.$.exposed;


			// Call global `WaitFor` resolves.

			if (name in resolves) {
				for (const resolve of resolves[name])
					resolve();
		
				delete resolves[name];
			}


			console.log(`[Singleton] '${name}' has been registered.`);
		}
	};
}

export function Singleton(name_or_instance: string|object): any {
	if (typeof(name_or_instance) === 'string')
		return Get(name_or_instance as string);

	return Register(name_or_instance);
}

export function Get(name: string) {
	return singletons[name];
}

export function Has(...names: string[]) {
	for (const name of names)
		if (!(name in singletons))
			return false;

	return true;
}

/**
 * Returns the singleton based on the given identifier.
 * 
 * If multiple, returns an array in the same order.
 */
export async function WaitFor(...names: string[]): Promise<any|any[]> {
	if (!names.length)
		return [];

	if (names.length == 1) {
		const name = names[0];

		if (name in singletons)
			// It already exists.
			return singletons[name];

		await new Promise(resolve => {
			if (!(name in resolves))
				resolves[name] = [];

			resolves[name].push(resolve);
		});

		return singletons[name];
	}

	const result: any = [];

	for (const name of names)
		result.push(await WaitFor(name));

	return result;
}
