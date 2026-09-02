export interface StandaloneSource {
	name: string;
	revision: string;
}

// Full reviewed Git commits are the only mirror inputs. Update a revision only
// after reviewing the corresponding standalone repository change.
export const COMPONENT_SOURCES = [
	{ name: "alert", revision: "0af44b34296432968b227236d51c10dd639db7c1" },
	{ name: "async-states", revision: "ef66c0f83d33b8cd129a3fecd0f4cce664356714" },
	{ name: "binary-controls", revision: "2524dd8509c23359d430c89e237720f0b5140f5c" },
	{ name: "button", revision: "867ea5449916d1dfd9e59d231282ff54cc060085" },
	{ name: "cmdk", revision: "689ccc890774d3e0274da0e8c91bec5f4bb64312" },
	{ name: "command-surfaces", revision: "e5f68a5ea09c153654215bf2d0b8f381e7d283f9" },
	{ name: "data-display", revision: "0d5b6346cd956a16992aa0fd40659010c17dd5d8" },
	{ name: "date-input", revision: "994c650f7e92eaf6f14b6fee8f760d7802616764" },
	{ name: "dialog", revision: "382def2b9ca3fa1579ceacf1d942de145d28bc79" },
	{ name: "disclosure", revision: "29c3df1b3cee6ff23ba3a4f10d7a1f021f02a31e" },
	{ name: "drawer", revision: "291dafef3d8be7f569ff7f773a4ab32ddf2cdf0b" },
	{ name: "form-fields", revision: "b4e3c899fb6442d560dbf9adf020b69cfd80d6bb" },
	{ name: "layout-surfaces", revision: "d55d3ef622eff4dc3580349b4ede3fdcc925a062" },
	{ name: "multi-select", revision: "c613afcacf01b758f0b68a741517ccb6d506e1aa" },
	{ name: "navigation-surfaces", revision: "426bc10728d377ad3dd1c51101c32ea2f7c86083" },
	{ name: "receipt", revision: "daddcd074ca5c26fcdeb573cf8c925526cc54cd2" },
	{ name: "scenarios", revision: "d54ca6bb40dfe073898f38d51e5183f0e9dbd49f" },
	{ name: "segmented-control", revision: "af11fa4242505e2068c1a1d6f1c192476e61ab6c" },
	{ name: "select-card", revision: "9bb4e5b77b08e95bb228f34691a8d6de74012b76" },
	{ name: "sidebar", revision: "a887c968b3bfc608edc6c1eab380a5b798169218" },
	{ name: "sync", revision: "4b1d6099c04775ad974391bfbfcad17c97cd009e" },
	{ name: "tabs", revision: "0cfd78685a2696eaf2de96a68e43962d823a7588" },
	{ name: "theme", revision: "b16b9dc50449a96a956206b6bae8c8e0e72974c8" },
	{ name: "toast", revision: "bdc6f6d6f7d4124cda84dbb8efa6fd3644a1356b" },
	{ name: "undo", revision: "6ac97fd201796fc5a8f798ac2d5c02ebb7cb0d39" },
	{ name: "workflow", revision: "3773733ab5a71dd37aa5951ef84f82370aa1b94d" },
] as const satisfies readonly StandaloneSource[];

export const TOOLING_SOURCES = [
	{ name: "cli", revision: "d53a7e43f813975e37e43cc3bdeb10645cdea8f2" },
] as const satisfies readonly StandaloneSource[];

export const STANDALONE_SOURCES = [
	...COMPONENT_SOURCES,
	...TOOLING_SOURCES,
] as const satisfies readonly StandaloneSource[];

export const COMPONENT_REPOSITORIES = COMPONENT_SOURCES.map(({ name }) => name);
export const TOOLING_REPOSITORIES = TOOLING_SOURCES.map(({ name }) => name);
export const STANDALONE_REPOSITORIES = STANDALONE_SOURCES.map(({ name }) => name);
