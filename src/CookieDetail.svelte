<script>
  export let recipe;
</script>

{#if recipe}
<div class="recipe-detail">
  <div class="headline">
    <h1>{recipe.name}</h1>
  </div>
  <h3 class="blurb">{recipe.summary}</h3>
  <div class="image" style="background: url({recipe.thumbnail}) 50% 80% / cover no-repeat;"></div>
  <!-- <img alt="{recipe.name}" class="cookie-thumbnail" src="{recipe.thumbnail}"/> -->
  <div class="text">
    <p class="byline">{recipe.year} recipe from <b>{recipe.baker[0].name}</b> of {recipe.baker[0].hometown}.</p>

    <div class="printer share" onclick="window.print();return false;">
      <p>Print recipe</p>
    </div>
    <div class="email share">
      <a href="mailto:?subject={recipe.name}&body={recipe.name}%0D%0A
      %0D%0A{recipe.summary}%0D%0A%0D%0A{recipe.recipe_yield}%0D%0A%0D%0AGet the recipe at http://startribune.com/x/star-tribune-cookie-contest/564807802?recipe={recipe.id}">
        <p>Email recipe</p>
      </a>
    </div>

    {#if recipe.notes}
      <h2>Note</h2>
      <p class="note">{recipe.notes}</p>
    {/if}

    <p class="yield">{recipe.recipe_yield}</p>

    <h2>Ingredients</h2>

    {@html recipe.ingredients_clean}


    <h2>Directions</h2>

    {@html recipe.procedure_clean}

    {#if recipe.baker_bio_notes_clean}
      <h2 class="baker">From the baker</h2>

      <p class="baker">{@html recipe.baker_bio_notes_clean}</p>
    {/if}
  </div>
</div>
{/if}
