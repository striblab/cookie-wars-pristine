<script>
  export let recipe;
</script>

<style>
.recipe-detail {
  display: inline-block;
  width: 100%;
  border: 1px solid #000;
}

.cookie-thumbnail {
  width: 200px;
}
</style>

{#if recipe}
<div class="recipe-detail">
  <h1>{recipe.name}</h1>
  <div class="blurb">{recipe.year}: {recipe.summary}</div>
  <img alt="{recipe.name}" class="cookie-thumbnail" src="{recipe.thumbnail}"/>

  <div>{recipe.baker[0].name}</div>

  <div>{recipe.recipe_yield}</div>

  <p>{recipe.notes}</p>

  {@html recipe.ingredients_clean}

  <h2>Directions</h2>

  {@html recipe.procedure_clean}

  <h2>From the baker</h2>

  <p>{recipe.baker_bio_notes}</p>
</div>
{/if}
