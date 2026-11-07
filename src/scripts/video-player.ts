import { formatTime, initialMachine, stepVolume, transition, type Machine, type PlayerEvent } from './player-state';

// Connects the DOM to the state machine. Media events only emit into dispatch(), and render() is the one
// place that touches the controls. A page with six clips creates no <video> until one is played.

interface Player {
	machine: Machine;
	time: number;
	duration: number;
	video: HTMLVideoElement | null;
}

const players = new WeakMap<HTMLElement, Player>();

// Shared, so the level set on one clip holds for the next one.
let volume = 100;

function getPlayer(root: HTMLElement): Player {
	let player = players.get(root);
	if (!player) {
		player = { machine: initialMachine, time: 0, duration: Number(root.dataset.duration) || 0, video: null };
		players.set(root, player);
	}
	return player;
}

function dispatch(root: HTMLElement, event: PlayerEvent) {
	const player = getPlayer(root);
	player.machine = transition(player.machine, event);
	render(root);
}

function render(root: HTMLElement) {
	const { machine, time, duration } = getPlayer(root);
	const part = <T extends Element>(selector: string) => root.querySelector<T>(selector);

	root.dataset.state = machine.status;
	root.dataset.wants = String(machine.wantsPlay);

	const toggle = part<HTMLButtonElement>('.toggle');
	if (toggle) toggle.setAttribute('aria-label', (machine.wantsPlay ? root.dataset.labelPause : root.dataset.labelPlay) ?? '');

	const status = part('.status');
	if (status) status.textContent = `_${machine.status.toUpperCase()}`;

	const clock = part('.clock');
	const reading = `${formatTime(time)} / ${formatTime(duration)}`;
	if (clock) clock.textContent = reading;

	const scrub = part<HTMLInputElement>('.scrub');
	if (scrub) {
		const percent = duration > 0 ? Math.min(100, (time / duration) * 100) : 0;
		scrub.disabled = machine.status === 'idle';
		scrub.setAttribute('aria-valuetext', reading);
		scrub.style.setProperty('--progress', `${percent}%`);
		// Writing the value mid-drag would fight the pointer.
		if (machine.status !== 'seeking') scrub.value = String(percent);
	}

	const fullscreen = part<HTMLButtonElement>('.fullscreen');
	if (fullscreen) fullscreen.disabled = machine.status === 'idle';

	const level = part('.level');
	if (level) level.textContent = String(volume).padStart(3, '0');
	const down = part<HTMLButtonElement>('.volume-down');
	const up = part<HTMLButtonElement>('.volume-up');
	if (down) down.disabled = volume === 0;
	if (up) up.disabled = volume === 100;
	root.querySelectorAll('.bars i').forEach((bar, index) => {
		bar.classList.toggle('on', volume >= (index + 1) * 25);
	});
}

function allRoots() {
	return document.querySelectorAll<HTMLElement>('.vplayer');
}

function createVideo(root: HTMLElement): HTMLVideoElement | null {
	const start = root.querySelector<HTMLAnchorElement>('.start');
	if (!start) return null;

	const poster = start.querySelector('img');
	const video = document.createElement('video');
	video.playsInline = true;
	video.volume = volume / 100;
	if (poster) {
		video.poster = poster.currentSrc;
		video.width = poster.width;
		video.height = poster.height;
	}

	const addSource = (src: string, type: string) => {
		const source = document.createElement('source');
		source.src = src;
		source.type = type;
		video.append(source);
		return source;
	};
	if ('av1' in root.dataset) addSource(`${root.dataset.video}.av1.mp4`, 'video/mp4; codecs="av01.0.08M.08, mp4a.40.2"');
	// With <source> children, a failed load is reported here and not on the video.
	addSource(start.href, 'video/mp4').addEventListener('error', () => dispatch(root, 'error'));

	const player = getPlayer(root);
	video.addEventListener('loadedmetadata', () => {
		player.duration = video.duration;
		render(root);
	});
	video.addEventListener('timeupdate', () => {
		player.time = video.currentTime;
		render(root);
	});
	video.addEventListener('playing', () => dispatch(root, 'playing'));
	video.addEventListener('pause', () => {
		// Browsers fire pause on the way to `ended`, which already covers it.
		if (!video.ended) dispatch(root, 'pause');
	});
	video.addEventListener('waiting', () => dispatch(root, 'waiting'));
	video.addEventListener('canplay', () => dispatch(root, 'ready'));
	video.addEventListener('seeked', () => dispatch(root, 'ready'));
	video.addEventListener('ended', () => dispatch(root, 'ended'));

	start.replaceWith(video);
	player.video = video;
	return video;
}

function togglePlayback(root: HTMLElement) {
	const player = getPlayer(root);
	const video = player.video ?? createVideo(root);
	if (!video) return;

	if (player.machine.wantsPlay) {
		video.pause();
		return;
	}

	// A failed file needs a fresh attempt to load it.
	if (player.machine.status === 'error') video.load();
	dispatch(root, 'play');
	video.play().catch(() => dispatch(root, 'blocked'));
}

function setVolume(next: number) {
	volume = next;
	allRoots().forEach((root) => {
		const { video } = getPlayer(root);
		if (video) video.volume = volume / 100;
		render(root);
	});
}

function toggleFullscreen(root: HTMLElement) {
	if (document.fullscreenElement) {
		document.exitFullscreen().catch(() => {});
		return;
	}
	if (root.requestFullscreen) {
		root.requestFullscreen().catch(() => {});
		return;
	}
	// iPhones can only put the video itself in fullscreen.
	const { video } = getPlayer(root);
	(video as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null)?.webkitEnterFullscreen?.();
}

document.addEventListener('click', (event) => {
	const mouse = event as MouseEvent;
	const target = event.target as Element;
	const root = target.closest<HTMLElement>('.vplayer');
	if (!root) return;

	const start = target.closest('.start');
	if (start) {
		// Ctrl-click and friends keep working as a normal link to the file.
		if (mouse.ctrlKey || mouse.metaKey || mouse.shiftKey) return;
		event.preventDefault();
		togglePlayback(root);
		// The poster link that had focus is gone, so keyboard users continue from the main button.
		root.querySelector<HTMLButtonElement>('.toggle')?.focus({ preventScroll: true });
		return;
	}

	if (target.closest('.toggle') || target.closest('video')) togglePlayback(root);
	else if (target.closest('.volume-down')) setVolume(stepVolume(volume, -1));
	else if (target.closest('.volume-up')) setVolume(stepVolume(volume, 1));
	else if (target.closest('.fullscreen')) toggleFullscreen(root);
});

document.addEventListener('input', (event) => {
	const scrub = event.target as HTMLInputElement;
	const root = scrub.closest?.<HTMLElement>('.vplayer');
	if (!root || !scrub.classList.contains('scrub')) return;

	const player = getPlayer(root);
	if (!player.video) return;
	if (player.machine.status !== 'seeking') dispatch(root, 'seekstart');

	player.time = (Number(scrub.value) / 100) * player.duration;
	player.video.currentTime = player.time;
	render(root);
});

document.addEventListener('change', (event) => {
	const scrub = event.target as HTMLInputElement;
	const root = scrub.closest?.<HTMLElement>('.vplayer');
	if (!root || !scrub.classList.contains('scrub')) return;

	const { video } = getPlayer(root);
	dispatch(root, 'seekend');
	// The seek may have landed before the release, so no further event would clear the buffering state.
	if (video && !video.seeking && video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) dispatch(root, 'ready');
});

// Two soundtracks at once help nobody. Media events do not bubble, so this listens on the way down.
document.addEventListener(
	'play',
	(event) => {
		document.querySelectorAll('video').forEach((video) => {
			if (video !== event.target) video.pause();
		});
	},
	true,
);

// The client router brings in fresh controls, which need to show the volume already chosen.
document.addEventListener('astro:after-swap', () => allRoots().forEach(render));
