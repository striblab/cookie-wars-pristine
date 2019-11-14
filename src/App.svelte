
<script>
	import { onMount } from 'svelte';
	import { tns } from "../node_modules/tiny-slider/src/tiny-slider"
	export let slider;

	import Scroller from '@sveltejs/svelte-scroller';
	let count;
	let index;
	let offset;
	let progress;
	let top = 0;
	let threshold = 0;
	let bottom = 0.9;

	const queryString = require('query-string');

	import { cookies } from './data/cookies.js';
	import CookieThumb from './CookieThumb.svelte';
	import CookieDetail from './CookieDetail.svelte';

	export let cookie_list;
	export let search_term = '';

	export let features = ['Winner', 'Easy', 'Chocolate', 'Fruit', 'Nut', 'International', 'Fun with kids']
	export let checked_features = features;

	export let cookie_types = ['Any', 'Rolled', 'Bar', 'Drop', 'Refrigerator'];
	export let current_cookie_type = 'Any';

	export let current_recipe;

	export const unsubscribe = cookies.subscribe(value => {
		cookie_list = value;
	});

	// Detail view
	export const showDetail = function (event) {
		current_recipe = cookie_list.filter(recipe => recipe.id == event.detail.id)[0];
		console.log(current_recipe);
		console.log(event.detail);
		slider.goTo(event.detail.slider_id);
	}

	// Search/filter functions
	$: filteredRecipes = cookie_list.filter(recipe => {
		let match = true;

		let feature_matches = false;
		recipe.features.forEach(function(value) {
			if (checked_features.indexOf(value) !== -1) {
				feature_matches = true;
			}
		});
		if (!feature_matches) {
			match = false;
		}

		if (current_cookie_type != 'Any' && recipe.cookie_type != current_cookie_type) {
			match = false;
		}

		let search_blob = recipe.name + ' ' + recipe.baker[0].name + ' ' + recipe.ingredients;
		if (search_term != '' && search_blob.toLowerCase().indexOf(search_term.toLowerCase()) === -1) {
			match = false;
		}

		return match;
	});

	let current = 'foo';

	const triggerDetailView = function (recipe_id) {
		for (let i=0; i < cookie_list.length; i++) {
			if (cookie_list[i].id == recipe_id) {
				// Using old-school loop so we can get the index and break once we find the match.
				current_recipe = cookie_list[i];
				slider.goTo(i-1);
				break;
			}
		}
	}

	window.onpopstate = function(event) {
		// alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
		triggerDetailView(event.state.id);
	};

	onMount(() => {
		slider = tns({
	    container: '#detail-slider',
	    controlsContainer: "#customize-controls",
	    items: 1,
	    slideBy: 'page',
	    autoplay: false
	  });

		const parsed_querystring = queryString.parse(location.search);
		if (parsed_querystring['recipe']) {
			triggerDetailView(parsed_querystring['recipe']);
			// for (let i=0; i < cookie_list.length; i++) {
			// 	if (cookie_list[i].id == parsed_querystring['recipe']) {
			// 		// Using old-school loop so we can get the index and break once we find the match.
			// 		current_recipe = cookie_list[i];
			// 		slider.goTo(i-1);
			// 		break;
			// 	}
			// }
		}
	});

</script>


<!--[if (lt IE 9)]><script src="https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.2/min/tiny-slider.helper.ie8.js"></script><![endif]-->


<div class="hero">
	<img src="http://static.startribune.com/images/icons/startribune-logo-black.svg" class="logo">
	<h1>holiday cookie contest</h1>
</div>

<h2 class="subhead">Over 100 recipes sure to serve up winter cheer all season long. Search by ingredient below, use our filters or just explore the whole, sweet world.</h2>

<div class="search">
	<i class="strib-icon strib-search"></i>
	<input placeholder="ex: cinnamon" bind:value={search_term}/>
	<p>{search_term}</p>
</div>


<Scroller
	{top}
	{threshold}
	{bottom}
	bind:count
	bind:index
	bind:offset
	bind:progress>

	<!-- <div slot="background">
		<p>current section: <strong>{index + 1}/{count}</strong></p>
		<progress value="{count ? (index + 1) / count : 0}"></progress>

		<p>offset in current section</p>
		<progress value={offset || 0}></progress>

		<p>total progress</p>
		<progress value={progress || 0}></progress>
	</div>

	<div slot="foreground" style="padding: 0 0 0 50%;">
		<section>section 1</section>
		<section>section 2</section>
		<section>section 3</section>
		<section>section 4</section>
		<section>section 5</section>
	</div> -->
	
	<div class="navigation inline" slot="background">
		<div class="top-nav">
			<a href="http://startribune.com/">
				<img class="logo white" src="http://static.startribune.com/images/logos/icn-nav-masthead-logo-400-60.png">
				<!-- <img class="logo black" src="http://static.startribune.com/images/icons/startribune-logo-black.svg"> -->
			</a>
			<div class="sharing">
				<!-- sharing -->
			</div>
		</div>
		<div class="second-nav">
			<div class="condensed-view">
				<div class="selected-filters">
					<p>{checked_features} {current_cookie_type}</p>
				</div>
				<div class="arrow show-more">
					<i class="strib-icon strib-nav-forward"></i>
				</div>
				<div class="back">
					<p>Back</p>
				</div>
			</div>

			<div class="filters">
			  	<h5>Features</h5>
				{#each features as feature}
				    <label class="features">
				  		<input type=checkbox bind:group={checked_features} value={feature}>
				  		{feature}
				  	</label>
				{/each}

			  	<h5>Cookie type</h5>
				{#each cookie_types as type}
					<label class="type" class:active="{current === 'bar'}" on:click="{() => current = 'bar'}">{type}
						<input type=radio bind:group={current_cookie_type} value={type}>
					</label>
				{/each}

				<h4>Clear all filters</h4>
			</div>
		</div>
	</div>

	<div slot="foreground">
		<div class="recipe-wrapper hidden">
			<div id="customize-controls">
			      <div class="previous"><i class=" strib-icon strib-nav-back"></i></div>
			      <div class="next"><i class="strib-icon strib-nav-forward"></i></div>
			    </div>
			<div id="detail-slider">
				{#each filteredRecipes as recipe}
					<CookieDetail {recipe}/>
				{/each}
			</div>
		</div>

		<div class="filtered-results">
		{#each filteredRecipes as recipe, list_index}
			<CookieThumb on:recipe_selected={showDetail} {recipe} {list_index}/>
		{/each}
		</div>
	</div>
</Scroller>