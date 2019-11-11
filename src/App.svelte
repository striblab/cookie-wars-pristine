<script>
	import { cookies } from './data/cookies.js';
	import CookieThumb from './CookieThumb.svelte';

	export let cookie_list;
	export let search_term = '';

	export let features = ['Winner', 'Easy', 'Chocolate', 'Fruit', 'Nut', 'International', 'Fun with kids']
	export let checked_features = features;

	export let cookie_types = ['Any', 'Rolled', 'Bar', 'Drop', 'Refrigerator'];
	export let current_cookie_type = 'Any';

	export const unsubscribe = cookies.subscribe(value => {
		cookie_list = value;
	});

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
</script>

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

{#each filteredRecipes as recipe}
	<CookieThumb {recipe}/>
{/each}
