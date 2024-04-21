import screen from "./screens.mjs";
import initialWelcome from "./screens/initialWelcome.mjs";
import credits from "./screens/credits.mjs";
import search from "./screens/search.mjs";
import nowPlaying from "./screens/nowPlaying.mjs";
import loading from "./screens/loading.mjs";
import mpv, { initMpv } from "./mpv.mjs";
import songSelection from "./screens/songSelection.mjs";
import playlistSearch from "./screens/playlistSearch.mjs";
import playlistSelection from "./screens/playlistSelection.mjs";

/* making a custom screen aka window (pre doc)
 *
 * screen: {}
 * { name, keyhandler, screen, onEnter, onExit }
 */

// TODO: multiple keyhandlers wen

const enabledScreen = [
	initialWelcome,
	credits,
	search,
	nowPlaying,
	loading,
	songSelection,
	playlistSearch,
	playlistSelection,
];

const appState = {
	currentScreen: "",
	currentKeyHandler: null,
	lastScreen: "",
	nextScreen: "",
	nowPlaying: "",
	currentSongData: null,
	loading: false,
	mpvState: mpv,
	screen: screen,
	searchResult: [],
	avaliableScreen: {},
	avaliableKeyHandler: {},
	avaliableScreenNames: [],
	timers: [],
	destroyHandler: null,
	volume: 50,
	appMode: "",
};

enabledScreen.forEach((v) => {
	appState.avaliableScreen[v.name] = v;
	appState.avaliableScreenNames.push(v.name);
	// appState.avaliableKeyHandler[v.name] = v.keyHandler;
	v.screen.hidden = true;

	// append the widget
	screen.append(v.screen);
});

//init mpv
initMpv();

export default appState;
