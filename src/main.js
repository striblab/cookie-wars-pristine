import App from './App.svelte';
import './scss/style.scss';

const app = new App({
	target: document.body,
	props: {
		'title': 'Holiday cookie finder: Over 80 winning recipes'
	}
});

window.app = app;

export default app;
