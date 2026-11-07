import { defaultLang, type Lang } from './paths';

// The hero headline is split into lines; `mark` paints that line as a highlighted block.
type HeroLine = { text: string; mark?: 'ink' | 'white' };

// Every key must exist in both languages: `en` is typed against `es`, so the compiler flags gaps.
const es = {
	'site.name': 'David Vargas',
	'site.role': 'Ingeniero de software',
	'site.description':
		'David Vargas, Software Engineer en Guatemala: backend, QA Automation e infraestructura, con experiencia en entornos fintech y bancarios.',

	'a11y.skip': 'Saltar al contenido',
	'lang.label': 'Idioma',

	'nav.main': 'Navegación principal',
	'nav.menu': 'Menú',
	'nav.work': 'Proyectos',
	'nav.videos': 'Redes',
	'nav.how': 'Cómo trabajo',
	'nav.experience': 'Experiencia',
	'nav.contact': 'Contacto',

	'hero.eyebrow': 'Backend · Automatización · Infraestructura',
	'hero.title': [
		{ text: 'Construyo' },
		{ text: 'software', mark: 'ink' },
		{ text: 'confiable' },
		{ text: 'y me encargo' },
		{ text: 'de él todos los días', mark: 'white' },
	] as HeroLine[],
	'hero.sticker': 'Hola',
	'hero.lead':
		'Soy David. Me gusta acompañar cada solución de principio a fin: desarrollo servicios backend, automatizo pruebas y cuido la infraestructura, del diagnóstico de una incidencia al despliegue y su monitoreo.',
	'hero.cta.work': 'Ver proyectos',
	'hero.cta.contact': 'Hablemos',

	// Decorative tape under the hero. Hidden from assistive tech: it only repeats terms used elsewhere.
	'tape.items': ['Backend', 'Python', 'FastAPI', 'Go', 'AWS', 'Docker', 'Kubernetes', 'Selenium', 'CI/CD', 'Prometheus', 'PostgreSQL', 'PyTorch'],

	'work.title': 'Proyectos',
	'work.lead': 'Sistemas de IA que construí para correr en mi propia infraestructura. Dos están en vivo, así que puedes entrar y probarlos.',
	'work.read': 'Ver proyecto',
	'work.live': 'Probar en vivo',
	'work.noDemo': 'Sin demo pública',
	'work.empty': 'Pronto compartiré los primeros proyectos.',
	'work.back': 'Volver a proyectos',

	'case.seen': 'Lo que ves',
	'case.flow': 'Cómo fluye',
	'case.architecture': 'Arquitectura',
	'case.challenge': 'El reto',
	'case.approach': 'Lo que hay detrás',
	'case.tradeoffs': 'Decisiones y trade-offs',

	'videos.title': 'En redes',
	'videos.lead': 'También explico tecnología en video, para quien nunca ha programado. Dale play: esa es mi voz.',
	'creator.photoAlt': 'Foto de David Vargas',
	'creator.bio': 'Publico videos cortos sobre conceptos técnicos en YouTube, TikTok e Instagram. Si quieres conocerme antes de escribirme, es un buen lugar para empezar.',
	'creator.genTitle': '¿Buscas los videos con IA?',
	'creator.genText': 'Los clips generados con IA están todos juntos en GenRuntime.',
	'creator.genCta': 'Ver los clips',
	'case.clips': 'Clips generados con IA',
	'case.clipsLead': 'Dale play: todos traen sonido.',
	'videos.play': 'Reproducir',
	'videos.pause': 'Pausar',
	'videos.seek': 'Avanzar o retroceder',
	'videos.volume': 'Volumen',
	'videos.volumeDown': 'Bajar el volumen',
	'videos.volumeUp': 'Subir el volumen',
	'videos.fullscreen': 'Pantalla completa',
	'videos.project': 'Ver el proyecto',

	'how.title': 'Cómo trabajo',
	'how.items': [
		'Antes de cambiar algo, observo cómo se trabaja de verdad y busco la causa raíz: entender qué pasó ayuda a arreglarlo una sola vez.',
		'Automatizo pruebas y pipelines para que cada versión salga con tranquilidad.',
		'Acompaño lo que construyo hasta producción: el despliegue, el monitoreo, las incidencias y lo que venga después.',
		'Documento lo que construyo y comparto lo que aprendo, para que el equipo tenga todo a la mano y el trabajo siga avanzando.',
	],

	'exp.title': 'Experiencia',
	'exp.facts': [
		{ value: '6 años', label: 'En tecnología, desde 2020' },
		{ value: '3+ años', label: 'Construyendo software' },
		{ value: 'Hoy', label: 'QA Automation Engineer, en remoto' },
	],
	'exp.items': [
		{
			area: 'Backend y APIs',
			detail:
				'Desarrollo servicios y APIs RESTful, e integro SDKs de terceros. He implementado flujos de autenticación seguros en apps fintech con usuarios reales y he mejorado el rendimiento y la latencia de sus servicios.',
			stack: ['Python', 'FastAPI', 'Node.js', 'Go', 'PostgreSQL', 'MySQL', 'Redis'],
		},
		{
			area: 'QA Automation y CI/CD',
			detail:
				'Diseño y ejecuto pruebas automatizadas para sistemas bancarios que operan 24/7, y construyo pipelines junto a desarrolladores y PMs para liberar versiones sin fricción.',
			stack: ['Selenium', 'Java', 'API Testing', 'GitLab CI', 'Azure DevOps'],
		},
		{
			area: 'Infraestructura y cloud',
			detail:
				'He gestionado servidores, bases de datos y almacenamiento en AWS, trabajado con servicios serverless, y resuelto incidencias en Linux con análisis de causa raíz y monitoreo.',
			stack: ['EC2', 'RDS', 'S3', 'Lambda', 'CloudFront', 'Docker', 'Kubernetes', 'Linux', 'Nagios'],
		},
		{
			area: 'IA y MLOps',
			detail:
				'Llevo modelos a producción en infraestructura propia, cuidando la memoria de la GPU, la concurrencia y el monitoreo. Mis proyectos muestran este trabajo con más detalle.',
			stack: ['PyTorch', 'CUDA', 'TensorRT', 'Faster-Whisper', 'MLflow', 'SpaCy'],
		},
	],
	'edu.label': 'Formación universitaria',
	'edu.degree': 'Técnico Universitario en Desarrollo de Software',
	'edu.school': 'Universidad Galileo',
	'edu.years': '2023 – 2025',
	'edu.languages': 'Idiomas',
	'edu.languageItems': [
		{ name: 'Español', level: 'Nativo' },
		{ name: 'Inglés', level: 'Intermedio (B1)' },
	],

	'contact.title': 'Contacto',
	'contact.lead': 'Si tienes un proyecto o una vacante y te gustaría conversar, escríbeme. Te leo con gusto.',
	'contact.location': 'Guatemala · Híbrido o remoto',

	'footer.text': 'Sitio estático construido con Astro.',

	'notfound.title': 'Página no encontrada',
	'notfound.text': 'No encontramos esta página. Puede que se haya movido.',
	'notfound.back': 'Volver al inicio',
};

const en: typeof es = {
	'site.name': 'David Vargas',
	'site.role': 'Software Engineer',
	'site.description':
		'David Vargas, Software Engineer in Guatemala: backend, QA automation and infrastructure, with experience in fintech and banking environments.',

	'a11y.skip': 'Skip to content',
	'lang.label': 'Language',

	'nav.main': 'Main navigation',
	'nav.menu': 'Menu',
	'nav.work': 'Projects',
	'nav.videos': 'Social',
	'nav.how': 'How I work',
	'nav.experience': 'Experience',
	'nav.contact': 'Contact',

	'hero.eyebrow': 'Backend · Automation · Infrastructure',
	'hero.title': [
		{ text: 'I build' },
		{ text: 'software', mark: 'ink' },
		{ text: 'you can rely on,' },
		{ text: 'and I' },
		{ text: 'care for it every day', mark: 'white' },
	],
	'hero.sticker': 'Hi',
	'hero.lead':
		"I'm David. I enjoy seeing solutions through from start to finish: I develop backend services, automate tests and look after infrastructure, from diagnosing an incident to deploying and monitoring the fix.",
	'hero.cta.work': 'View projects',
	'hero.cta.contact': "Let's talk",

	'tape.items': ['Backend', 'Python', 'FastAPI', 'Go', 'AWS', 'Docker', 'Kubernetes', 'Selenium', 'CI/CD', 'Prometheus', 'PostgreSQL', 'PyTorch'],

	'work.title': 'Projects',
	'work.lead': 'AI systems I built to run on my own infrastructure. Two are live, so you can step in and try them.',
	'work.read': 'View project',
	'work.live': 'Try it live',
	'work.noDemo': 'No public demo',
	'work.empty': 'I will share the first projects soon.',
	'work.back': 'Back to projects',

	'case.seen': 'What you see',
	'case.flow': 'How it flows',
	'case.architecture': 'Architecture',
	'case.challenge': 'The challenge',
	'case.approach': "What's behind it",
	'case.tradeoffs': 'Decisions and trade-offs',

	'videos.title': 'On social',
	'videos.lead': 'I also explain technology on video, for people who have never programmed. Press play: that is my voice.',
	'creator.photoAlt': 'Photo of David Vargas',
	'creator.bio': 'I publish short videos about technical concepts on YouTube, TikTok and Instagram. If you want to get to know me before writing, it is a good place to start.',
	'creator.genTitle': 'Looking for the AI videos?',
	'creator.genText': 'The AI-generated clips are all together in GenRuntime.',
	'creator.genCta': 'See the clips',
	'case.clips': 'AI-generated clips',
	'case.clipsLead': 'Press play: they all have sound.',
	'videos.play': 'Play',
	'videos.pause': 'Pause',
	'videos.seek': 'Seek',
	'videos.volume': 'Volume',
	'videos.volumeDown': 'Turn the volume down',
	'videos.volumeUp': 'Turn the volume up',
	'videos.fullscreen': 'Fullscreen',
	'videos.project': 'View the project',

	'how.title': 'How I work',
	'how.items': [
		'Before changing anything, I watch how the work really happens and look for the root cause: understanding what happened helps fix it once.',
		'I automate tests and pipelines so every release can go out calmly.',
		'I stay with what I build through production: the deployment, the monitoring, the incidents and whatever comes next.',
		'I document what I build and share what I learn, so the team has everything at hand and the work keeps moving.',
	],

	'exp.title': 'Experience',
	'exp.facts': [
		{ value: '6 years', label: 'In technology, since 2020' },
		{ value: '3+ years', label: 'Building software' },
		{ value: 'Today', label: 'QA Automation Engineer, remote' },
	],
	'exp.items': [
		{
			area: 'Backend and APIs',
			detail:
				'I develop RESTful services and APIs and integrate third-party SDKs. I have implemented secure authentication flows in fintech apps with real users, and improved the performance and latency of their services.',
			stack: ['Python', 'FastAPI', 'Node.js', 'Go', 'PostgreSQL', 'MySQL', 'Redis'],
		},
		{
			area: 'QA automation and CI/CD',
			detail:
				'I design and run automated tests for banking systems that operate 24/7, and build pipelines alongside developers and PMs so versions ship smoothly.',
			stack: ['Selenium', 'Java', 'API Testing', 'GitLab CI', 'Azure DevOps'],
		},
		{
			area: 'Infrastructure and cloud',
			detail:
				'I have managed servers, databases and storage on AWS, worked with serverless services, and resolved Linux incidents with root cause analysis and monitoring.',
			stack: ['EC2', 'RDS', 'S3', 'Lambda', 'CloudFront', 'Docker', 'Kubernetes', 'Linux', 'Nagios'],
		},
		{
			area: 'AI and MLOps',
			detail:
				'I take models to production on my own infrastructure, looking after GPU memory, concurrency and monitoring. My projects show this work in more detail.',
			stack: ['PyTorch', 'CUDA', 'TensorRT', 'Faster-Whisper', 'MLflow', 'SpaCy'],
		},
	],
	'edu.label': 'University education',
	'edu.degree': 'Technical degree in Software Development',
	'edu.school': 'Universidad Galileo',
	'edu.years': '2023 – 2025',
	'edu.languages': 'Languages',
	'edu.languageItems': [
		{ name: 'Spanish', level: 'Native' },
		{ name: 'English', level: 'Intermediate (B1)' },
	],

	'contact.title': 'Contact',
	'contact.lead': 'If you have a project or an open role and would like to chat, write to me. I would be glad to hear from you.',
	'contact.location': 'Guatemala · Hybrid or remote',

	'footer.text': 'Static site built with Astro.',

	'notfound.title': 'Page not found',
	'notfound.text': 'We could not find this page. It may have moved.',
	'notfound.back': 'Back to home',
};

export const ui = { es, en } as const;
export type UIKey = keyof typeof es;

/** Returns the string or list for `key` in `lang`, falling back to the default language. */
export function t<K extends UIKey>(lang: Lang, key: K): (typeof es)[K] {
	return (ui[lang][key] ?? ui[defaultLang][key]) as (typeof es)[K];
}
