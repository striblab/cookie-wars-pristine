<script>
  export let recipe;
</script>

<style type="text/css" media="print">
    body {visibility:hidden;}
    .print {visibility:visible; position: static}
</style>

<div class="print">
  <h1>{recipe.name}</h1>
  <p class="byline">{recipe.year} recipe from <b>{recipe.baker[0].name}</b> of {recipe.baker[0].hometown}.</p>
  {#if recipe.notes}
    <h2>Note</h2>
    <p class="note">{recipe.notes}</p>
    {#if recipe.notes}
      <h2>Note</h2>
      <p class="note">{recipe.notes}</p>
    {/if}

    <p class="yield">{recipe.recipe_yield}</p>

    <h2>Ingredients</h2>

    {@html recipe.ingredients_clean}


    <h2>Directions</h2>

    {@html recipe.procedure_clean}
  {/if}
</div>

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

    <div class="print share" onclick="window.print();return false;">
      <p>Print recipe</p>
    </div>
    <div class="email share">
       <p>Email recipe</p>
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
      <h2>From the baker</h2>

      <p>{@html recipe.baker_bio_notes_clean}</p>
    {/if}
  </div>
</div>
{/if}
