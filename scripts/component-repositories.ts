export const COMPONENT_REPOSITORIES = [
	"alert",
	"async-states",
	"binary-controls",
	"button",
	"cmdk",
	"command-surfaces",
	"data-display",
	"date-input",
	"dialog",
	"disclosure",
	"drawer",
	"form-fields",
	"layout-surfaces",
	"multi-select",
	"navigation-surfaces",
	"receipt",
	"scenarios",
	"segmented-control",
	"select-card",
	"sidebar",
	"sync",
	"tabs",
	"theme",
	"toast",
	"undo",
	"workflow",
] as const;

export const TOOLING_REPOSITORIES = ["cli"] as const;

export const STANDALONE_REPOSITORIES = [
	...COMPONENT_REPOSITORIES,
	...TOOLING_REPOSITORIES,
] as const;
