const keyDefine = (keys, exec) => {
	if (typeof keys === "string") {
		return function (ch, key) {
			if (key.name === keys) exec();
		};
	} else {
		return function (ch, key) {
			if (keys.includes(key.name)) exec();
		};
	}
};

export default keyDefine;
