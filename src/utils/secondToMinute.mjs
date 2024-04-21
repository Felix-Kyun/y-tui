const secondToMinute = (second) => {
	const minute = Math.floor(second / 60);
	const seconds = Math.floor(second % 60);

	return `${minute}:${seconds}`;
};

export default secondToMinute;
