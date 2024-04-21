import screen from "../screens.mjs";
import appState from "../appState.mjs";

const currentScreen = () => appState.avaliableScreen[appState.currentScreen];

const moveTo = (screenName) => {
	// avoid un nessesary re render
	if (screenName === appState.currentScreen) return;
	// check if it valid?
	if (!appState.avaliableScreenNames.includes(screenName))
		return console.log("invalid screen name");

	if (appState.currentScreen) {
		currentScreen().screen.hidden = true;

		// [EVENT] run onExit if it exsists
		if (currentScreen().onExit) currentScreen().onExit();
	}

	appState.currentScreen = screenName;

	// [EVENT] before enter
	if (currentScreen().beforeEnter) currentScreen().beforeEnter();

	currentScreen().screen.hidden = false;

	// [EVENT] run onEnter if it exsists
	if (currentScreen().onEnter) currentScreen().onEnter();

	// handle keyHandler
	appState.currentKeyHandler = currentScreen().keyHandler;

	// finally rednerr the new screen
	screen.render();

	// [EVENT] run afterEnter if it exsists
	if (currentScreen().afterEnter) currentScreen().afterEnter();
};

export default moveTo;
export { currentScreen };
