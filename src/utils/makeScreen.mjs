import blessed from "blessed";
import mainScreen from "../screens.mjs";

const makeScreen = () => {
	return blessed.box({
		parent: mainScreen,
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
	});
};

export default makeScreen;
