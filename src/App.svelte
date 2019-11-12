<script>
	import { onMount } from 'svelte';
	import { tns } from "../node_modules/tiny-slider/src/tiny-slider"
	export let slider;

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

	onMount(() => {
		slider = tns({
	    container: '#detail-slider',
	    items: 1,
	    slideBy: 'page',
	    autoplay: false
	  });
	});
</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.2/tiny-slider.css">
<!--[if (lt IE 9)]><script src="https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.2/min/tiny-slider.helper.ie8.js"></script><![endif]-->

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
