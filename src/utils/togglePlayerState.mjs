import appState from "../appState.mjs";

const togglePlayerState = async (nowPlaying) => {
	await appState.mpvState.togglePause();
	const pauseState = await appState.mpvState.isPaused();

	if (pauseState) nowPlaying.style.fg = "red";
	else nowPlaying.style.fg = "blue";

	// if (nowPlaying.style.fg === "red") nowPlaying.style.fg = "blue";
	// else nowPlaying.style.fg = "red";
	appState.screen.render();
};

export default togglePlayerState;
