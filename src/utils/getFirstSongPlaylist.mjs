import YTMusic from "ytmusic-api-extended";

const getFirstSongPlaylist = async (playlistId) => {
	const api = new YTMusic.default();
	await api.initialize();

	const response = await api.getPlaylistVideos(playlistId);

	return response[0];
};

export default getFirstSongPlaylist;
