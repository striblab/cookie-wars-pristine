<script>
	import { onMount } from 'svelte';
	import { tns } from "../node_modules/tiny-slider/src/tiny-slider"
	export let slider;

	const queryString = require('query-string');

	import CookieData from './data/cookies.json'
	import CookieThumb from './CookieThumb.svelte';
	import CookieDetail from './CookieDetail.svelte';

	export let cookie_list = CookieData;
	export let search_term = '';

	export let features = ['Winner', 'Easy', 'Chocolate', 'Fruit', 'Nut', 'International', 'Fun with kids']
	export let checked_features = features;

	export let cookie_types = ['Any', 'Rolled', 'Bar', 'Drop', 'Refrigerator'];
	export let current_cookie_type = 'Any';

	export let current_recipe;

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
		triggerDetailView(event.state.id);
	};

	onMount(() => {
		slider = tns({
	    container: '#detail-slider',
	    items: 1,
	    slideBy: 'page',
	    autoplay: false
	  });

		const parsed_querystring = queryString.parse(location.search);
		if (parsed_querystring['recipe']) {
			triggerDetailView(parsed_querystring['recipe']);
		}
	});
</script>

<svelte:head>
  <title>{$$props.title}</title>
  <meta name="description" content="Looking for a new cookie recipe this holiday season? Browse 16 years of winning recipes on our cookie finder." />
  <meta property="og:site_name" content="Star Tribune" />
	<meta property="og:type" content="article" />
  <meta property="og:title" content="Holiday cookie finder: Over 80 winning recipes" /><!-- fb, linkedin, pinterest -->
  <meta property="og:description" content="Looking for a new cookie recipe this holiday season? Browse 16 years of winning recipes on our cookie finder." /><!-- fb, linkedin, pinterest -->
  <meta property="og:url" content="http://www.startribune.com/holiday-cookie-finder-over-80-winning-recipes/353038401/" />
  <meta property="og:image" content="http://stmedia.stimg.co/cooky2015.jpg?h=630&amp;w=1200&amp;fit=crop&amp;bg=999&amp;crop=faces" /><!-- fb, linkedin, pinterest -->
  <meta property="og:image:url" content="http://stmedia.stimg.co/cooky2015.jpg?h=630&amp;w=1200&amp;fit=crop&amp;bg=999&amp;crop=faces" /><!-- fb, linkedin, pinterest -->
  <meta property="og:image:width" content="1200" /><!-- fb, linkedin, pinterest -->
  <meta property="og:image:height" content="630" /><!-- fb, linkedin, pinterest -->

  <meta name="twitter:site" content="@StarTribune" />
  <meta name="twitter:card" content="summary_large_image">

  <meta name="twitter:title" content="Holiday cookie finder: Over 80 winning recipes" /><!-- twitter -->
  <meta name="twitter:description" content="Looking for a new cookie recipe this holiday season? Browse 16 years of winning recipes on our cookie finder." /><!-- twitter -->
  <meta name="twitter:url" content="http://www.startribune.com/holiday-cookie-finder-over-80-winning-recipes/353038401/" /><!-- twitter -->
  <meta name="twitter:image" content="http://stmedia.stimg.co/cooky2015.jpg?h=630&amp;w=1200&amp;fit=crop&amp;bg=999&amp;crop=faces"><!-- twitter -->
  <meta name="twitter:image:src" content="http://stmedia.stimg.co/cooky2015.jpg?h=630&amp;w=1200&amp;fit=crop&amp;bg=999&amp;crop=faces"><!-- twitter -->

	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.2/tiny-slider.css">
	<!--[if (lt IE 9)]><script src="https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.2/min/tiny-slider.helper.ie8.js"></script><![endif]-->
</svelte:head>

<style>

</style>

<h1>Star Tribune holiday cookie contest</h1>

<div>Over 100 recipes sure to serve up winter cheer all season long. Search by ingredient below, use our filters or just explore the whole, sweet world.</div>

<div>
  <input bind:value={search_term}/>
  <p>{search_term}</p>
</div>

<div>
  <h5>Features</h5>
  {#each features as feature}
    <label>
  		<input type=checkbox bind:group={checked_features} value={feature}>
  		{feature}
  	</label>
  {/each}
</div>

<div>
  <h5>Cookie type</h5>
	{#each cookie_types as type}
		<label>{type}
			<input type=radio bind:group={current_cookie_type} value={type}>
		</label>
	{/each}
</div>

<div id="detail-slider">
{#each filteredRecipes as recipe}
	<CookieDetail {recipe}/>
{/each}
</div>

{#each filteredRecipes as recipe, list_index}
	<CookieThumb on:recipe_selected={showDetail} {recipe} {list_index}/>
{/each}
