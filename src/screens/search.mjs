import blessed from "blessed";
import makeScreen from "../utils/makeScreen.mjs";
import moveTo from "../utils/moveTo.mjs";
import searchSong from "../utils/ytm/searchSong.mjs";
import mpv from "../mpv.mjs";
import appState from "../appState.mjs";
import keyDefine from "../utils/keyDefine.mjs";

const screen = makeScreen();

const searchBox = blessed.textarea({
	parent: screen,
	top: "center",
	left: "center",
	width: "50%",
	height: 3,
	label: "Enter song name:",
	border: "line",
	inputOnFocus: true,
	mouse: true,
	style: {
		fg: "blue",
	},
});

searchBox.key("enter", async () => {
	searchBox.submit();

	const songName = searchBox.value;
	appState.loading = true;
	moveTo("loading");
	const result = await searchSong(songName);
	appState.searchResult = result;
	// await appState.mpvState.load(
	// 	"https://music.youtube.com/?v=" + result[0].videoId
	// );
	appState.loading = false;
	// appState.nowPlaying = result[0].name;
	moveTo("songSelection");
});

const search = {
	name: "search",
	screen,
	afterEnter: () => searchBox.focus(),
	keyHandler: keyDefine("enter", () => searchBox.focus()),
};

export default search;
