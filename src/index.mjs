import screen from "./screens.mjs";
import moveTo from "./utils/moveTo.mjs";
import appState from "./appState.mjs";
import mpv from "./mpv.mjs";

moveTo("initialWelcome");
screen.on("keypress", (ch, key) => appState.currentKeyHandler(ch, key));
screen.render();

screen.key(["q", "escape", "C-c"], async (ch, key) => {
	screen.destroy();
	appState.timers.forEach((timer) => {
		if (timer) clearInterval(timer);
	});
	await mpv.quit();
});
