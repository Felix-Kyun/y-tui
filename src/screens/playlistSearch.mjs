import blessed from "blessed";
import makeScreen from "../utils/makeScreen.mjs";
import moveTo from "../utils/moveTo.mjs";
import searchSong from "../utils/ytm/searchSong.mjs";
import mpv from "../mpv.mjs";
import appState from "../appState.mjs";
import keyDefine from "../utils/keyDefine.mjs";
import searchPlaylist from "../utils/ytm/searchPlaylist.mjs";

const screen = makeScreen();

const searchBox = blessed.textarea({
	parent: screen,
	top: "center",
	left: "center",
	width: "50%",
	height: 3,
	label: "Enter playlist name:",
	border: "line",
	inputOnFocus: true,
	mouse: true,
	style: {
		fg: "blue",
	},
});

searchBox.key("enter", async () => {
	searchBox.submit();

	const playlistName = searchBox.value;
	appState.loading = true;
	moveTo("loading");
	const result = await searchPlaylist(playlistName);
	appState.searchResult = result;
	appState.loading = false;
	moveTo("playlistSelection");
});

const playlistSearch = {
	name: "playlistSearch",
	screen,
	afterEnter: () => searchBox.focus(),
	keyHandler: keyDefine("enter", () => searchBox.focus()),
};

export default playlistSearch;
