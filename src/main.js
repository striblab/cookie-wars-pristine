import App from './App.svelte';
import './scss/style.scss';

const app = new App({
	target: document.body,
	props: {
		name: 'worldasdfds'
	}
});

window.app = app;

export default app;
