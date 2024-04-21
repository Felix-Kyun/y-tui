import getNext from "./ytm/getNext.mjs";
import appState from "../appState.mjs";
import moveTo from "./moveTo.mjs";

const playNextSong = async () => {
	appState.loading = true;
	moveTo("loading");
	appState.prevSongData = appState.currentSongData;
	const nextSong = await getNext(appState.currentSongData);
	await appState.mpvState.load(
		"https://music.youtube.com/?v=" + nextSong.videoId
	);

	// await appState.mpvState.append(
	// 	"https://music.youtube.com/?v=" + nextSong.videoId
	// );

	// await appState.mpvState.next();

	appState.loading = false;
	appState.nowPlaying = nextSong.name;
	appState.currentSongData = nextSong;
	moveTo("nowPlaying");
};

export default playNextSong;
