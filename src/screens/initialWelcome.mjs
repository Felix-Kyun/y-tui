import blessed from "blessed";
import makeScreen from "../utils/makeScreen.mjs";
import keyDefine from "../utils/keyDefine.mjs";
import moveTo from "../utils/moveTo.mjs";

const screen = makeScreen();

const textBox = blessed.box({
	parent: screen,
	top: "center",
	left: "center",
	height: "fit",
	width: "shrink",
	content: "Welcome To Y-Tui",
	style: {
		fg: "blue",
	},
});

const onEnter = () => {
	console.log("welcome to Y-Tui");
};

const initialWelcome = {
	name: "initialWelcome",
	screen,
	// onEnter,
	keyHandler: (ch, key) => {
		if (key.name === "s") moveTo("search");
		else if (key.name === "p") moveTo("playlistSearch");
	},
};

export default initialWelcome;
