<script>
  export let recipe;
</script>

{#if recipe}
<div class="recipe-detail">
  <div class="headline">
    <h1>{recipe.name}</h1>
  </div>  
  <h3 class="blurb">{recipe.summary}</h3>
  <div class="image" style="background: url({recipe.thumbnail}); background-size: cover; background-position: 50% 80%; background-repeat: no-repeat;"></div>
  <!-- <img alt="{recipe.name}" class="cookie-thumbnail" src="{recipe.thumbnail}"/> -->
  <div class="text">
    <p class="byline">{recipe.year} recipe from <b>{recipe.baker[0].name}</b> of {recipe.baker[0].hometown}.</p>

    <p class="yield">{recipe.recipe_yield}</p>

    {#if recipe.notes}
      <h2>Note</h2>
      <p class="note">{recipe.notes}</p>
    {/if}

    <h2>Ingredients</h2>

    <p>{recipe.ingredients}</p>

    <h2>Directions</h2>

    <p>{recipe.procedure}</p>

    <h2>From the baker</h2>

    <p>{recipe.baker_bio_notes}</p>
  </div>
</div>
{/if}
