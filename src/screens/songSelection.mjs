import blessed from "blessed";
import makeScreen from "../utils/makeScreen.mjs";
import keyDefine from "../utils/keyDefine.mjs";
import moveTo from "../utils/moveTo.mjs";
import appState from "../appState.mjs";

const screen = makeScreen();

let selector;

const selectVisual = (index) => {
	// clear all the visual effect
	selector.items.forEach((value) => {
		if (value.content.startsWith("> ")) {
			value.content = value.content.replace("> ", "");
			value.style.bold = false;
		}
		// appState.screen.render();
		// console.log(value.content);
	});

	// apply effect on currently selected one
	selector.items[index].content = `> ${selector.items[index].content}`;
	selector.items[index].style.bold = true;

	// re redner
	appState.screen.render();
};

const onEnter = () => {
	selector = blessed.list({
		parent: screen,
		content: "Search Result",
		top: "center",
		left: "center",
		keys: true,
		currentSelected: 0,
	});
	selector.on("select", async (item, index) => {
		appState.loading = true;
		moveTo("loading");
		appState.appMode = "song";
		await appState.mpvState.load(
			"https://music.youtube.com/?v=" +
				appState.searchResult[index].videoId
		);

		appState.mpvState.adjustVolume(appState.volume);
		appState.loading = false;
		appState.nowPlaying = appState.searchResult[index].name;
		appState.currentSongData = appState.searchResult[index];
		appState.currentSongData.index = 0;
		moveTo("nowPlaying");
	});

	selector.key(["down", "j"], () => {
		if (selector.currentSelected + 1 >= selector.items.length) return;
		selector.currentSelected++;
		selectVisual(selector.currentSelected);
		appState.screen.render();
	});
	selector.key(["up", "k"], () => {
		if (selector.currentSelected - 1 < 0) return;
		selector.currentSelected--;
		selectVisual(selector.currentSelected);
		appState.screen.render();
	});

	selector.currentSelected = 0;
	let songList = [];
	for (let song of appState.searchResult) {
		songList.push(song.name);
	}
	selector.setItems(songList);

	selector.focus();
	selector.select(selector.currentSelected);
	selectVisual(selector.currentSelected);
	appState.screen.render();
};

const onExit = () => {
	selector.destroy();
};

const songSelection = {
	name: "songSelection",
	screen,
	onEnter,
	onExit,
	keyHandler: keyDefine("s", () => moveTo("search")),
};

export default songSelection;
