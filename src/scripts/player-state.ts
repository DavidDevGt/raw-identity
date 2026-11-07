// The video player's state machine. Pure on purpose: DOM events go in, a state comes out, and the
// interface only draws the result, so the controls cannot drift out of sync with the video.

export type Status = 'idle' | 'playing' | 'paused' | 'seeking' | 'buffering' | 'error';

export type PlayerEvent =
	// The visitor asked to play.
	| 'play'
	// The browser reports playback started, or that it has enough data to continue.
	| 'playing'
	| 'ready'
	| 'pause'
	| 'waiting'
	| 'seekstart'
	| 'seekend'
	| 'ended'
	// The browser refused to start, or the file failed to load.
	| 'blocked'
	| 'error';

export interface Machine {
	status: Status;
	// Whether the visitor wants it playing. Tells a seek or a stall where to return to.
	wantsPlay: boolean;
}

export const initialMachine: Machine = { status: 'idle', wantsPlay: false };

export function transition(machine: Machine, event: PlayerEvent): Machine {
	const { status, wantsPlay } = machine;

	switch (event) {
		case 'play':
			return { status: 'buffering', wantsPlay: true };
		case 'playing':
			return status === 'seeking' ? { status, wantsPlay: true } : { status: 'playing', wantsPlay: true };
		case 'ready':
			if (status !== 'buffering') return machine;
			return { status: wantsPlay ? 'playing' : 'paused', wantsPlay };
		case 'pause':
			// Dragging the scrubber does not change what the visitor wants afterwards.
			return status === 'seeking' ? machine : { status: 'paused', wantsPlay: false };
		case 'waiting':
			return status === 'playing' ? { status: 'buffering', wantsPlay } : machine;
		case 'seekstart':
			return { status: 'seeking', wantsPlay };
		case 'seekend':
			if (status !== 'seeking') return machine;
			return { status: wantsPlay ? 'buffering' : 'paused', wantsPlay };
		case 'ended':
		case 'blocked':
			return { status: 'paused', wantsPlay: false };
		case 'error':
			return { status: 'error', wantsPlay: false };
	}
}

// The volume moves in fixed steps, with no fine adjustment to fiddle with.
export const volumeSteps = [0, 25, 50, 75, 100] as const;

export function stepVolume(volume: number, direction: 1 | -1): number {
	const index = volumeSteps.findIndex((step) => step === volume);
	const next = Math.min(volumeSteps.length - 1, Math.max(0, index + direction));
	return volumeSteps[next] ?? volume;
}

export function formatTime(seconds: number): string {
	const total = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
	const pad = (value: number) => String(value).padStart(2, '0');
	return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}
