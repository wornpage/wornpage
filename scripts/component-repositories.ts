export interface StandaloneSource {
	name: string;
	revision: string;
}

// Full reviewed Git commits are the only mirror inputs. Update a revision only
// after reviewing the corresponding standalone repository change.
export const COMPONENT_SOURCES = [
	{ name: "alert", revision: "0f9198d46105ab87dd8b36739ed293f18aa88a73" },
	{ name: "async-states", revision: "81a0c6e865b2d59fedc4a24191e6e94120b72614" },
	{ name: "binary-controls", revision: "63d48b5a4cbeccdeedf3edb72dae504f340603cd" },
	{ name: "button", revision: "6da25ba40af71d3329abc2a4631d46047abd180b" },
	{ name: "cmdk", revision: "2b81e02c079213c2da6f42385b87be418ef489d4" },
	{ name: "command-surfaces", revision: "bd4b83fb8f2cd00b4ab55f1cbc5a219760037e26" },
	{ name: "data-display", revision: "a9edfc6ede6bf914c4d76af4b70fe0bea2692876" },
	{ name: "date-input", revision: "293bda9267da02902f521ad29828fdfb3b453943" },
	{ name: "dialog", revision: "a92ec9a235f3bce6a166b32be3d2a81b3d0d3efb" },
	{ name: "disclosure", revision: "f21de53500ed90bb09b2c1b303bf2a8960348763" },
	{ name: "drawer", revision: "e0e3b357e184c2e0ecc44f05df121a3e252769b7" },
	{ name: "form-fields", revision: "e8622cc0d20812dd38eb355c119a9aacf0443179" },
	{ name: "layout-surfaces", revision: "66cfc85a8bad620d29bcbe86f05d8d818ff21ca5" },
	{ name: "multi-select", revision: "f7756d31fd5358e3e46c06d38be2a9912e6c0cdc" },
	{ name: "navigation-surfaces", revision: "76033271503f1042543352d82c140152b2192634" },
	{ name: "receipt", revision: "27d698b9c75ba897809e6b6a7d936dafe949097a" },
	{ name: "scenarios", revision: "cbe404b93fc1a4e1783b0bebd542e3ae022fbb26" },
	{ name: "segmented-control", revision: "f55f9da550c8670efee86e97b6f9d444eb86b76f" },
	{ name: "select-card", revision: "e8a2c974c51ac4910afa7357d5c79e1228cc83fe" },
	{ name: "sidebar", revision: "919dadb0f62b8fa6c7f35470279b5782ba2bc84d" },
	{ name: "sync", revision: "79fd644a819f1a25e7e20dd2011fbb3c97f67e65" },
	{ name: "tabs", revision: "816df623aff0a12aea47fd63b3e0cecafbbbc488" },
	{ name: "theme", revision: "f9ef5f1b5cccc90ac43695bd23ed735776b593d5" },
	{ name: "toast", revision: "2049e21d86a8e394ca2093528e639c025c1a8842" },
	{ name: "undo", revision: "b7f7e42bb362f6886f11001f55a68c3fef1abc23" },
	{ name: "workflow", revision: "7e705da0d1349487458b4b3feb28d8ebc52aeec0" },
] as const satisfies readonly StandaloneSource[];

export const TOOLING_SOURCES = [
	{ name: "cli", revision: "d65813ff4f5668e8ab96fef8f744e47dbfeb7e3c" },
] as const satisfies readonly StandaloneSource[];

export const STANDALONE_SOURCES = [
	...COMPONENT_SOURCES,
	...TOOLING_SOURCES,
] as const satisfies readonly StandaloneSource[];

export const COMPONENT_REPOSITORIES = COMPONENT_SOURCES.map(({ name }) => name);
export const TOOLING_REPOSITORIES = TOOLING_SOURCES.map(({ name }) => name);
export const STANDALONE_REPOSITORIES = STANDALONE_SOURCES.map(({ name }) => name);
