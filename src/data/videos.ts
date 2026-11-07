import type { Lang } from '../i18n/paths';

export interface Video {
	// Files live in public/videos as <slug>.mp4, <slug>.webp and, when `av1` is set, <slug>.av1.mp4.
	slug: string;
	width: number;
	height: number;
	duration: string;
	// AV1 is left out when it came out larger than the H.264 file.
	av1: boolean;
	// Sets the size in the grid.
	layout: 'feature' | 'wide' | 'tall';
	// A project page this clip belongs to, by case study slug.
	project?: string;
	copy: Record<Lang, { title: string; description: string }>;
}

// Clips shown on a project's own page, by case study slug.
export const projectVideos: Record<string, Video[]> = {
	kuraitech: [
		{
			slug: 'kurai-launch',
			width: 1280,
			height: 720,
			duration: '1:05',
			av1: true,
			layout: 'feature',
			copy: {
				es: {
					title: 'Un sprint en un minuto',
					description: 'Del primer comando al Pull Request: así trabajan los agentes de KurAI.tech. El video está en inglés.',
				},
				en: {
					title: 'A sprint in a minute',
					description: 'From the first command to the Pull Request: how the KurAI.tech agents work together.',
				},
			},
		},
	],
	trazo: [
		{
			slug: 'trazo-monty-hall',
			width: 720,
			height: 1280,
			duration: '1:24',
			av1: false,
			layout: 'tall',
			copy: {
				es: {
					title: 'El problema de Monty Hall',
					description: 'Tres puertas, un premio y una pregunta: ¿cambiar de puerta cambia tus probabilidades?',
				},
				en: {
					title: 'The Monty Hall problem',
					description: 'Three doors, one prize and one question: does switching doors change your odds?',
				},
			},
		},
		{
			slug: 'trazo-transistor',
			width: 720,
			height: 1280,
			duration: '2:40',
			av1: false,
			layout: 'tall',
			copy: {
				es: {
					title: '¿Cómo funciona un transistor?',
					description: 'Un voltaje pequeño decide si la corriente pasa o no, y con eso se construyen las computadoras.',
				},
				en: {
					title: 'How does a transistor work?',
					description: 'A small voltage decides whether current flows or not, and that is how computers are built.',
				},
			},
		},
	],
	// All the AI-generated clips, together.
	genruntime: [
		{
			slug: 'el-silencio-de-los-automatas',
			width: 1280,
			height: 732,
			duration: '0:36',
			av1: true,
			layout: 'feature',
			copy: {
				es: {
					title: 'El silencio de los autómatas',
					description: 'Un corto en un campo de trigo, donde cada vez aparecen más máquinas.',
				},
				en: {
					title: 'The silence of the automatons',
					description: 'A short film in a wheat field, where more and more machines keep appearing.',
				},
			},
		},
		{
			slug: 'anden-en-la-niebla',
			width: 960,
			height: 548,
			duration: '0:14',
			av1: true,
			layout: 'wide',
			copy: {
				es: {
					title: 'Andén en la niebla',
					description: 'Un tren rojo llega entre la bruma y pasa junto a alguien que lo espera de espaldas.',
				},
				en: {
					title: 'Platform in the fog',
					description: 'A red train arrives through the mist and passes someone waiting with their back to us.',
				},
			},
		},
		{
			slug: 'espadachina-de-bambu',
			width: 960,
			height: 548,
			duration: '0:05',
			av1: false,
			layout: 'wide',
			copy: {
				es: {
					title: 'Espadachina de bambú',
					description: 'La toma que ves en las capturas de abajo: camina hacia la cámara y dice su línea.',
				},
				en: {
					title: 'Bamboo swordswoman',
					description: 'The shot in the screenshots below: she walks toward the camera and says her line.',
				},
			},
		},
		{
			slug: 'gato-lofi',
			width: 720,
			height: 1080,
			duration: '0:06',
			av1: true,
			layout: 'tall',
			copy: {
				es: {
					title: 'Gato lofi',
					description: 'Lluvia en la ventana, una taza humeante y un gato que mira pasar la noche.',
				},
				en: {
					title: 'Lofi cat',
					description: 'Rain on the window, a steaming mug and a cat watching the night go by.',
				},
			},
		},
		{
			slug: 'fantasma-de-plastilina',
			width: 720,
			height: 1280,
			duration: '0:05',
			av1: true,
			layout: 'tall',
			copy: {
				es: {
					title: 'Fantasma de plastilina',
					description: 'Un fantasma se asoma detrás de la lápida, con textura de plastilina.',
				},
				en: {
					title: 'Clay ghost',
					description: 'A ghost peeks out from behind the gravestone, with a clay texture.',
				},
			},
		},
		{
			slug: 'bajo-la-lluvia',
			width: 720,
			height: 1080,
			duration: '0:07',
			av1: true,
			layout: 'tall',
			copy: {
				es: {
					title: 'Bajo la lluvia',
					description: 'Un impermeable amarillo, una calle mojada y una mirada al reloj.',
				},
				en: {
					title: 'In the rain',
					description: 'A yellow raincoat, a wet street and a glance at the watch.',
				},
			},
		},
	],
};

// The home's Social section: David's own explainers, made with TRAZO and narrated in his voice.
export const creatorVideos: Video[] = projectVideos.trazo ?? [];
