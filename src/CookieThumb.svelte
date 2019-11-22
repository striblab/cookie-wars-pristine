<script>
  import { createEventDispatcher } from 'svelte';

  export let recipe;
  export let list_index;  // Where is this in the slider

	const dispatch = createEventDispatcher();

	function selectRecipe(event) {
    console.log(event.target);
    let detail_state = {
			id: event.target.getAttribute('recipe_id'),
      slider_id: event.target.getAttribute('slider_id')
		}
    history.pushState(detail_state, event.target.getAttribute('recipe_id'), '?recipe=' + event.target.getAttribute('recipe_id'));
		dispatch('recipe_selected', detail_state);
	}
</script>


<div class="cookie" on:click|capture="{selectRecipe}" recipe_id="{recipe.id}" slider_id="{list_index}" style="background: url({recipe.thumbnail}) 50% 80% / cover no-repeat;">
  <div class="text">
    <h5>{recipe.year}</h5>
    <h3 on:click|capture="{selectRecipe}" recipe_id="{recipe.id}" slider_id="{list_index}" >{recipe.name}</h3>
    <p class="blurb">{recipe.summary}</p>
    <!-- <div class="author">{recipe.baker[0].name}</div> -->
  </div>
  <!-- <img alt="{recipe.name}" class="cookie-thumbnail" src="{recipe.thumbnail}"/> -->
  <!-- <img alt="{recipe.name}" class="cookie-thumbnail" src="{recipe.thumbnail}"/> -->
</div>
