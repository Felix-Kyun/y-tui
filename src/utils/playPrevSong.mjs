import getNext from "./ytm/getNext.mjs";
import appState from "../appState.mjs";
import moveTo from "./moveTo.mjs";

const playPrevSong = async () => {
	if (!appState.prevSongData) return;

	const percent = await appState.mpvState.getPercentPosition();
	if (percent <= 10) {
		appState.loading = true;
		moveTo("loading");
		await appState.mpvState.load(
			"https://music.youtube.com/?v=" + appState.currentSongData.videoId
		);
		appState.loading = false;
		moveTo("nowPlaying");
		return;
	}

	appState.loading = true;
	const prevSong = await getNext(appState.prevSongData);
	moveTo("loading");
	await appState.mpvState.load(
		"https://music.youtube.com/?v=" + prevSong.videoId
	);

	appState.loading = false;
	appState.nowPlaying = prevSong.name;
	appState.currentSongData = prevSong;
	appState.prevSong = null;
	moveTo("nowPlaying");
};

export default playPrevSong;
