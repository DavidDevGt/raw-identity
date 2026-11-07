import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatTime, initialMachine, stepVolume, transition, type Machine, type PlayerEvent } from '../src/scripts/player-state.ts';

const run = (events: PlayerEvent[], from: Machine = initialMachine) => events.reduce(transition, from);

test('starts idle and buffers until the browser reports playback', () => {
	assert.equal(initialMachine.status, 'idle');
	assert.equal(run(['play']).status, 'buffering');
	assert.equal(run(['play', 'playing']).status, 'playing');
});

test('a stall returns to playing, but never interrupts a pause', () => {
	assert.equal(run(['play', 'playing', 'waiting']).status, 'buffering');
	assert.equal(run(['play', 'playing', 'waiting', 'ready']).status, 'playing');
	assert.equal(run(['play', 'playing', 'pause', 'waiting']).status, 'paused');
});

test('seeking returns to whatever the visitor had before', () => {
	const whilePlaying = run(['play', 'playing', 'seekstart']);
	assert.equal(whilePlaying.status, 'seeking');
	assert.equal(run(['seekend', 'ready'], whilePlaying).status, 'playing');

	const whilePaused = run(['play', 'playing', 'pause', 'seekstart']);
	assert.equal(run(['seekend'], whilePaused).status, 'paused');
});

test('the browser pausing mid-seek does not lose the intent to play', () => {
	const machine = run(['play', 'playing', 'seekstart', 'pause', 'waiting']);
	assert.equal(machine.status, 'seeking');
	assert.equal(machine.wantsPlay, true);
});

test('stale seek endings change nothing', () => {
	const playing = run(['play', 'playing']);
	assert.deepEqual(transition(playing, 'seekend'), playing);
});

test('ending or being refused leaves it paused and ready to play again', () => {
	assert.deepEqual(run(['play', 'playing', 'ended']), { status: 'paused', wantsPlay: false });
	assert.deepEqual(run(['play', 'blocked']), { status: 'paused', wantsPlay: false });
	assert.equal(run(['play', 'playing', 'ended', 'play']).status, 'buffering');
});

test('a failed load is reported, and can be retried', () => {
	assert.equal(run(['play', 'error']).status, 'error');
	assert.equal(run(['play', 'error', 'play']).status, 'buffering');
});

test('volume moves in fixed steps and stops at both ends', () => {
	assert.equal(stepVolume(100, -1), 75);
	assert.equal(stepVolume(0, 1), 25);
	assert.equal(stepVolume(100, 1), 100);
	assert.equal(stepVolume(0, -1), 0);
});

test('time always reads as mm:ss', () => {
	assert.equal(formatTime(0), '00:00');
	assert.equal(formatTime(36.3), '00:36');
	assert.equal(formatTime(75), '01:15');
	assert.equal(formatTime(Number.NaN), '00:00');
	assert.equal(formatTime(Number.POSITIVE_INFINITY), '00:00');
});
