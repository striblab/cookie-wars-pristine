<script>
  import { createEventDispatcher } from 'svelte';

  export let recipe;
  export let list_index;  // Where is this in the slider

	const dispatch = createEventDispatcher();

	function selectRecipe(event) {
		dispatch('recipe_selected', {
			id: event.target.id,
      slider_id: event.target.getAttribute('slider_id')
		});
	}
</script>

<style>
  .cookie-thumbnail {
    width: 100px;
  }
</style>

<div>
  <h3><a href="Javascript:;" on:click="{selectRecipe}" id="{recipe.id}" slider_id="{list_index}">{recipe.name}</a></h3>
  <div class="blurb">{recipe.year}: {recipe.summary}</div>
  <div>{recipe.baker[0].name}</div>
  <img alt="{recipe.name}" class="cookie-thumbnail" src="{recipe.thumbnail}"/>
</div>
