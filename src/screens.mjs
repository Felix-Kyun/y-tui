import blessed from "blessed";

const screen = blessed.screen({
	// fastCSR: true,
	smartCSR: true,
});

export default screen;
