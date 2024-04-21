import NodeMpv from "node-mpv-2";

const mpv = new NodeMpv({ audio_only: true }, ["--no-resume-playback"]);

const initMpv = async () => await mpv.start();

export { initMpv };

export default mpv;
