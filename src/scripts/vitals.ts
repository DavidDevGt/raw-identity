import { onCLS, onINP, onLCP, type Metric } from 'web-vitals';
import { PUBLIC_VITALS_ENDPOINT } from 'astro:env/client';

// Field metrics from real users (p75 is what Google uses for ranking). Lab tools like Lighthouse
// cannot show these numbers. Without PUBLIC_VITALS_ENDPOINT this script does nothing.
//
// ClientRouter keeps bundled scripts alive across navigations, so this module runs once per document.
// Each metric is reported with the route and the language so you can segment by page.

if (PUBLIC_VITALS_ENDPOINT) {
	const endpoint = PUBLIC_VITALS_ENDPOINT;

	const send = (metric: Metric) => {
		const body = JSON.stringify({
			name: metric.name,
			value: metric.value,
			rating: metric.rating,
			id: metric.id,
			path: location.pathname,
			lang: document.documentElement.lang,
		});

		// text/plain keeps the beacon a "simple" request, so no CORS preflight is needed.
		const blob = new Blob([body], { type: 'text/plain' });
		if (!navigator.sendBeacon(endpoint, blob)) {
			fetch(endpoint, { method: 'POST', body: blob, keepalive: true }).catch(() => {});
		}
	};

	onLCP(send);
	onINP(send);
	onCLS(send);
}
