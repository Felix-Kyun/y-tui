import blessed from "blessed";
import contrib from "blessed-contrib";
import makeScreen from "../utils/makeScreen.mjs";
import keyDefine from "../utils/keyDefine.mjs";
import moveTo from "../utils/moveTo.mjs";
import appState from "../appState.mjs";
import mpv from "../mpv.mjs";
import fetch from "node-fetch";
import getThumbnail from "../utils/getThumbnail.mjs";
import secondToMinute from "../utils/secondToMinute.mjs";
import getNext from "../utils/ytm/getNext.mjs";
import playNextSong from "../utils/playNextSong.mjs";
import playPrevSong from "../utils/playPrevSong.mjs";
import togglePlayerState from "../utils/togglePlayerState.mjs";

const screen = makeScreen();
let updateTimer = null; // for destroying timer later

const skell = (parentGrid, row, col, rowSize, colSize, element, opts) => {
	const tempBox = parentGrid.set(row, col, rowSize, colSize, blessed.box, {});
	const actualElement = element({
		top: "center",
		left: "center",
		height: "shrink",
		width: "shrink",
		parent: tempBox,
		...opts,
	});
	return actualElement;
};

const makeButton = (
	parentGrid,
	row,
	col,
	rowSize,
	colSize,
	content,
	onClick
) => {
	const button = skell(
		parentGrid,
		row,
		col,
		rowSize,
		colSize,
		blessed.button,
		{
			content: content,
			style: {
				fg: "white",
				bg: "blue",
				bold: true,
			},
			hoverBg: "green",
			padding: {
				// top: 1,
				right: 2,
				// bottom: 1,
				left: 2,
			},
		}
	);

	button.on("click", onClick);
	return button;
};

const onEnter = async () => {
	const grid = new contrib.grid({
		rows: 12,
		cols: 3,
		screen: screen,
		hideBorder: true,
	});

	screen.on("keypress", async (ch, key) => {
		if (key.name)
			switch (key.name) {
				case "h":
					appState.mpvState.seek(-5);
					break;
				case "j":
					await playNextSong();
					break;
				case "k":
					await playPrevSong();
					break;
				case "l":
					appState.mpvState.seek(+5);
					break;
				case "space":
					togglePlayerState(nowPlaying);
					break;
			}
		else
			switch (key.ch) {
				case "-":
					appState.mpvState.adjustVolume(-10);
					break;
				case "+":
					appState.mpvState.adjustVolume(+10);
					break;
			}
	});

	//hz <br>

	// const hr1Box = grid.set(1, 0, 1, 3, blessed.box, {});
	// const hr1 = blessed.box({
	// 	parent: hr1Box,
	// 	content: "Y-Tui",
	// 	top: "center",
	// 	left: "center",
	// 	height: "shrink",
	// 	width: "shrink",
	// 	style: {
	// 		fg: "red",
	// 	},
	// });

	const top = grid.set(0, 0, 1, 3, blessed.box, {});
	const banner = blessed.box({
		parent: top,
		content: "Y-Tui",
		top: "center",
		left: "center",
		height: "shrink",
		width: "shrink",
		style: {
			fg: "red",
		},
	});

	const bottom = grid.set(10, 0, 2, 3, blessed.box, {});
	const bottomGrid = new contrib.grid({
		screen: bottom,
		hideBorder: true,
		rows: 2,
		cols: 12,
	});

	const controlBar = bottomGrid.set(0, 0, 1, 12, blessed.box, {});
	const controlGrid = new contrib.grid({
		screen: controlBar,
		hideBorder: true,
		rows: 1,
		cols: 24,
	});

	const progressBarArea = bottomGrid.set(1, 0, 1, 10, blessed.box, {});
	const progressBar = blessed.progressbar({
		parent: progressBarArea,
		width: "100%",
		height: "100%",
		top: "center",
		border: "line",
		fill: "green",
		ch: "░",
		// label: "Progress",
	});

	progressBar.setProgress(0);

	// const progressText = bottomGrid.set(1, 11, 1, 1, blessed.box, {});
	const progressText = skell(bottomGrid, 1, 10, 1, 2, blessed.box, {});
	const totalDuration = await appState.mpvState.getDuration();
	const currentPosition = await appState.mpvState.getTimePosition();

	const nowPlaying = skell(controlGrid, 0, 4, 1, 16, blessed.box, {
		content: appState.nowPlaying,
		style: {
			fg: "red",
		},
	});

	// playPause
	nowPlaying.on("click", () => togglePlayerState(nowPlaying));

	const increaseVolumeButton = makeButton(
		controlGrid,
		0,
		23,
		1,
		1,
		"+",
		async () => appState.mpvState.adjustVolume(+10)
	);

	const decreaseVolumeButton = makeButton(
		controlGrid,
		0,
		0,
		1,
		1,
		"-",
		async () => appState.mpvState.adjustVolume(-10)
	);

	const seekForwardButton = makeButton(
		controlGrid,
		0,
		22,
		1,
		1,
		">>",
		async () => appState.mpvState.seek(+5)
	);

	const seekBackwardButton = makeButton(
		controlGrid,
		0,
		1,
		1,
		1,
		"<<",
		async () => appState.mpvState.seek(-5)
	);

	const nextButton = makeButton(controlGrid, 0, 21, 1, 1, ">", async () => {
		clearInterval(updateTimer);
		await playNextSong();
	});
	const prevButton = makeButton(controlGrid, 0, 2, 1, 1, "<", async () => {
		clearInterval(updateTimer);
		await playPrevSong();
	});

	// thumbnail
	const imageBox = grid.set(1, 1, 9, 1, blessed.box, {});
	// const currentPlayingSongData = appState.searchResult.find(
	// 	(s) => s.name === appState.nowPlaying
	// );
	// const thumbnailUrl = currentPlayingSongData.thumbnails[1]
	// 	? currentPlayingSongData.thumbnails[1].url
	// 	: currentPlayingSongData.thumbnails[0].url;

	const thumbnailPath = await getThumbnail(
		appState.currentSongData.thumbnails[0].url
	);

	const thumbnail = contrib.picture({
		parent: imageBox,
		file: thumbnailPath,
		cols: Math.floor(imageBox.width * 0.95),
	});

	const refresh = async () => {
		screen.focus();
		try {
			// now playing content
			nowPlaying.content = appState.nowPlaying;
			const pauseState = await appState.mpvState.isPaused();
			if (pauseState) nowPlaying.style.fg = "red";
			else nowPlaying.style.fg = "blue";

			// progress bar
			const currentPosition = await appState.mpvState.getTimePosition();
			const currentPositionPercent =
				await appState.mpvState.getPercentPosition();
			progressBar.setProgress(currentPositionPercent);
			progressText.content = `${secondToMinute(
				currentPosition
			)} / ${secondToMinute(totalDuration)}`;

			//update screen
			appState.screen.render();
		} catch (e) {
			// means song ended
			if (e.errcode === 3) {
				try {
					clearInterval(updateTimer);
					await playNextSong();
				} catch (e) {
					console.log(e);
				}
				return;
			} else {
				console.log(e);
			}
		}
	};

	updateTimer = setInterval(refresh, 1000);
	appState.timers.push(updateTimer);
};

const nowPlaying = {
	name: "nowPlaying",
	screen,
	onEnter,
	keyHandler: keyDefine("b", () => moveTo("initialWelcome")),
	onExit: () => {
		clearInterval(updateTimer);
	},
};

export default nowPlaying;
