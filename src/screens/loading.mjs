import blessed from "blessed";
import makeScreen from "../utils/makeScreen.mjs";
import keyDefine from "../utils/keyDefine.mjs";
import moveTo from "../utils/moveTo.mjs";
import appState from "../appState.mjs";

const screen = makeScreen();

const loadingPhases = [
	"[...       ]",
	"[ ...      ]",
	"[  ...     ]",
	"[   ...    ]",
	"[    ...   ]",
	"[     ...  ]",
	"[      ... ]",
	"[       ...]",
	"[.       ..]",
	"[..       .]",
];

const loader = blessed.box({
	parent: screen,
	top: "center",
	left: "center",
	height: "fit",
	width: "shrink",
	content: loadingPhases[0],
	style: {
		fg: "blue",
	},
});

const onEnter = () => {
	let count = 1;
	const timer = setInterval(async () => {
		loader.content = loadingPhases[count++ % loadingPhases.length];
		appState.screen.render();
		if (!appState.loading) clearInterval(timer);
	}, 500);
};

const loading = {
	name: "loading",
	screen,
	onEnter,
	keyHandler: () => {},
};

export default loading;
