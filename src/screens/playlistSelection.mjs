import blessed from "blessed";
import makeScreen from "../utils/makeScreen.mjs";
import keyDefine from "../utils/keyDefine.mjs";
import moveTo from "../utils/moveTo.mjs";
import appState from "../appState.mjs";
import getFirstSongPlaylist from "../utils/getFirstSongPlaylist.mjs";

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
		appState.appMode = "playlist";
		appState.selectedPlaylist = appState.searchResult[index];
		const song = await getFirstSongPlaylist(
			appState.selectedPlaylist.playlistId
		);
		await appState.mpvState.load(
			"https://music.youtube.com/?v=" + song.videoId
		);

		appState.mpvState.adjustVolume(appState.volume);
		appState.loading = false;
		appState.nowPlaying = song.name;
		appState.currentSongData = song;
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
	let playlistList = [];
	for (let playlist of appState.searchResult) {
		playlistList.push(`${playlist.artist.name} - ${playlist.name}`);
	}
	selector.setItems(playlistList);

	selector.focus();
	selector.select(selector.currentSelected);
	selectVisual(selector.currentSelected);
	appState.screen.render();
};

const onExit = () => {
	selector.destroy();
};

const playlistSelection = {
	name: "playlistSelection",
	screen,
	onEnter,
	onExit,
	keyHandler: keyDefine("s", () => moveTo("search")),
};

export default playlistSelection;
