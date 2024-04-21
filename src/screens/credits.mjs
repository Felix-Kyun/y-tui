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
	content: "Made By Felix <3",
	style: {
		fg: "blue",
	},
});

const credits = {
	name: "credits",
	screen,
	keyHandler: keyDefine("b", () => moveTo("initialWelcome")),
};

export default credits;
