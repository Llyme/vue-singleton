type TSingleton = {
	[name: string]: any
};

type TResolves = {
	[name: string]: Function[]
}

export let singletons: TSingleton = {};
let resolves: TResolves = {};

export function Register(instance: any) {
	let {
		mounted
	} = instance;

	let name: string = null;

	function Getter() {
		return Get(name);
	}

	return {
		...instance,

		This: Getter,
		Self: Getter,

		mounted() {
			if (mounted != null)
				mounted.apply(this);

			name = this.$.type.name;

			if (name in singletons)
				throw new Error(`[Singleton] Component '${name}' already exists!`);

			singletons[name] = this.$.exposed;

			if (name in resolves) {
				for (let resolve of resolves[name])
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
	for (let name of names)
		if (!(name in singletons))
			return false;

	return true;
}

export async function WaitFor(...names: string[]): Promise<any[]> {
	if (!names.length)
		return [];

	if (names.length == 1) {
		let name = names[0];

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

	let result: any = [];

	for (let name of names)
		result.push(await WaitFor(name));

	return result;
}
