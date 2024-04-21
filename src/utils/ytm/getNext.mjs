import appState from "../../appState.mjs";
import YTMusic from "ytmusic-api-extended";

let lastRequestedSongData;

const getNext = async (songData) => {
	try {
		const api = new YTMusic.default();
		await api.initialize();
		if (appState.appMode === "playlist") {
			const NextSong = await api.getNext(
				appState.currentSongData.videoId,
				appState.selectedPlaylist.playlistId
			);

			return NextSong[songData.index + 1];
		} else {
			const response = await api.getNext(
				songData.videoId,
				songData.playlistId
			);

			if (songData.index == 49) {
				return response[0];
			}
			return response[songData.index + 1];
		}
	} catch (e) {
		console.log(e);
	}
};

export default getNext;
