export interface StandaloneSource {
	name: string;
	revision: string;
}

// Full reviewed Git commits are the only mirror inputs. Update a revision only
// after reviewing the corresponding standalone repository change.
export const COMPONENT_SOURCES = [
	{ name: "alert", revision: "34880e30e7f5f992de3771feb078118ed4113e2c" },
	{ name: "async-states", revision: "3ef58c31408b2ec0863101eef064fb24aec0a9f9" },
	{ name: "binary-controls", revision: "a521ed511a12905d23133efc442a0f2d92f6bb48" },
	{ name: "button", revision: "0fdf229650e77759ba75530a76af201c12cce4a7" },
	{ name: "cmdk", revision: "55f974b0fd06412b6dc603c90dce27da062661b0" },
	{ name: "command-surfaces", revision: "8f46841efeefe4e4f5c13b75ecf10521b11ca8d1" },
	{ name: "data-display", revision: "9e4fd7bc85c7c2f09be9e536d41968dfd6cf82b7" },
	{ name: "date-input", revision: "545e272a3184213cb097e4162737a49ea87e19d1" },
	{ name: "dialog", revision: "3c4c8f666f849e72ca25a2c20bde686451379c63" },
	{ name: "disclosure", revision: "c4726038af8d924c0f8c16602d12ad9501c4eefe" },
	{ name: "drawer", revision: "2c46732e9ce925337752a12ce66cb9b83d80ed34" },
	{ name: "form-fields", revision: "213118bc00fe15e1b2d5e2ed4aa2aa736aeccf5a" },
	{ name: "layout-surfaces", revision: "ee029a286b268bfcf03a6a2ca2b37c17b9ff026b" },
	{ name: "multi-select", revision: "c79eadedc498fb4339d321469a964ae3bdeec38e" },
	{ name: "navigation-surfaces", revision: "aa8fb735d15a78b18935c7951e5e5736be573c9a" },
	{ name: "receipt", revision: "24f1b2615f63f900521a1ac1ab7bad532f91e55a" },
	{ name: "scenarios", revision: "a6f3b545e6202c61b93ddd36f7ab6d773aa4c6e4" },
	{ name: "segmented-control", revision: "001e50ee320c57b2b892c6e96bfe27303c75e2c4" },
	{ name: "select-card", revision: "b10a6d15ce2dd8c392ad71baa7888e527b8fa3cb" },
	{ name: "sidebar", revision: "4913ab63fc670bcc760d66424a7fc1d919007bac" },
	{ name: "sync", revision: "facd99faa99a94fcc6e3c040c5b56cf61181c67b" },
	{ name: "tabs", revision: "e929c9323ba4db75ab8201943a5e3758daed1745" },
	{ name: "theme", revision: "7ca4e982065b55fb9fb8830b0dc35045c4471ddc" },
	{ name: "toast", revision: "26c6924a046fcd2aecefdccbbe9a336286f26a4c" },
	{ name: "undo", revision: "50e33546ae5a4a833ff5fc90bc137b12c6b1c345" },
	{ name: "workflow", revision: "0b4fd2a46e9b4f0ee55e488254e2fc53b4c57c31" },
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
