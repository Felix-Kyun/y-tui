import YTMusic from "ytmusic-api-extended";

const searchSong = async (songName) => {
	const api = new YTMusic.default();
	await api.initialize();
	const searchResult = await api.searchSongs(songName);
	return searchResult;
};

export default searchSong;
