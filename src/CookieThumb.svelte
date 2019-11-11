<script>
  export let recipe;
</script>

<style>
  .cookie-thumbnail {
    width: 100px;
  }
</style>

<div>
  <h3>{recipe.name}</h3>
  <div class="blurb">{recipe.year}: {recipe.summary}</div>
  <div>{recipe.baker[0].name}</div>
  <img alt="{recipe.name}" class="cookie-thumbnail" src="{recipe.thumbnail}"/>
</div>
