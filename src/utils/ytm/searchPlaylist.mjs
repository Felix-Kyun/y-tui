import YTMusic from "ytmusic-api-extended";

const searchPlaylist = async (songName) => {
	const api = new YTMusic.default();
	await api.initialize();
	const searchResult = await api.searchPlaylists(songName);
	return searchResult;
};

export default searchPlaylist;
