
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

	export let features = ['Winner', 'Easy', 'Chocolate', 'Fruit', 'Nut', 'International', 'Fun with kids'];
	export let checked_features = features;

	export let cookie_types = ['Any', 'Rolled', 'Bar', 'Drop', 'Refrigerator'];
	export let current_cookie_type = 'Any';

	export let current_recipe;

	export let detail_view_active = false;

	export let filters_hidden = true;

	export let scrollY;
	export let y_from_top;

	$: {
		let happy = scrollY;
		if (document.querySelector('.filtered-results')) {
			y_from_top = document.querySelector('.filtered-results').getBoundingClientRect().top;
		} else {
			y_from_top = 8675309;
		}
	}

	export let checked_features_str = '';
	$: {
		if (checked_features.length > 3) {
			checked_features_str = checked_features.slice(0, 3).join(', ') + ' ...';
		} else {
			checked_features_str = checked_features.join(', ')
		}
	}

	// Detail view
	export const showDetail = function (event) {
		current_recipe = cookie_list.filter(recipe => recipe.id == event.detail.id)[0];
		detail_view_active = true;
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
		if (checked_features.length == 0) {
			match = true;
		} else if (!feature_matches) {
			match = false;
		}

		if (current_cookie_type != 'Any' && recipe.cookie_type != current_cookie_type) {
			match = false;
		}

		let search_blob = recipe.name + ' ' + recipe.baker[0].name + ' ' + recipe.ingredients_clean + ' ' + recipe.year ;
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
	    controlsContainer: "#customize-controls",
	    items: 1,
	    slideBy: 'page',
	    autoplay: false
	  });

		const parsed_querystring = queryString.parse(location.search);
		if (parsed_querystring['recipe']) {
			triggerDetailView(parsed_querystring['recipe']);
		}

		// scrolltest = document.querySelector('.filtered-results').scrollTop;
	});

	const handleArrowClick = function(event) {
		if (filters_hidden) {
			filters_hidden = false;
		} else {
			filters_hidden = true;
		}
	}

	const handleBackClick = function(event) {
		if (detail_view_active) {
			detail_view_active = false;
		} else {
			detail_view_active = true;
		}
	}

</script>

<svelte:window bind:scrollY/>

<!-- <svelte:head>
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
	<!--[if (lt IE 9)]><script src="https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.2/min/tiny-slider.helper.ie8.js"></script><![endif]-/->
</svelte:head> -->


<div class="hero-wrapper"  class:recipe-show="{detail_view_active == true}">
	<div class="hero">
		<!-- <img src="http://static.startribune.com/images/cookiehero/cookiegif.gif" class="cookieimg one"> -->
		<div class="headline">
			<img alt="Star Tribune logo" src="http://static.startribune.com/images/logos/icn-nav-masthead-logo-400-60.png" class="logo">
			<h1><span>holiday cookie contest</span></h1>
		</div>
	</div>
	
	<h2 class="subhead">Over 100 recipes sure to serve up winter cheer all season long. Search by ingredient below, use our filters or just explore the whole, sweet world.</h2>
	
	<div class="sponsor">
		<p>With Support From</p>
			<div id="div-gpt-ad-7442209-1"></div>
	</div>

	<div class="search">
		<h5>Search</h5>
		<i class="strib-icon strib-search"></i>
		<input placeholder="ex: cinnamon" bind:value={search_term}/>
	</div>

	<div class="navigation inline" id="nav" class:fixed="{y_from_top <= 0}" class:inline="{y_from_top > 0}">
		<div class="top-nav">
			<a href="http://startribune.com/">
				<img alt="Star Tribune logo" class="logo white" src="http://static.startribune.com/images/logos/icn-nav-masthead-logo-400-60.png">
				<!-- <img class="logo black" src=""> -->
			</a>
			<div class="sharing">
				<!-- sharing -->
			</div>
		</div>
		<div class="second-nav" class:hide="{filters_hidden === true && y_from_top <= 0}" class:recipe-detail="{detail_view_active == true}">
			<div class="condensed-view">
				<div class="selected-filters">
					<p>{checked_features_str}</p>
				</div>
				<div class="arrow show-more" on:click={handleArrowClick}>
					<i class="strib-icon strib-nav-forward"></i>
				</div>
				<div class="back" on:click={handleBackClick}>
					<p>Back</p>
				</div>
			</div>

			<div class="filters">
			  	<h5>Features</h5>
				{#each features as feature}
				<div class="feature">
					<input type=checkbox bind:group={checked_features} value={feature} class:all-selected="{features == checked_features}">
					<label class="features">{feature}</label>
				</div>
				{/each}

			  	<h5>Cookie type</h5>
				{#each cookie_types as type}
					<div class="feature">
						<input type=radio bind:group={current_cookie_type} value={type}>
						<label class="type">{type}</label>
					</div>
				{/each}

				<h4>Clear all filters</h4>
			</div>
		</div>
	</div>


	<div class="filtered-results">
		<div class="row-grid">
			{#each filteredRecipes as recipe, list_index}
				<CookieThumb on:recipe_selected={showDetail} {recipe} {list_index}/>
			{/each}
		</div>
	</div>
</div>

<div class="recipe-wrapper" class:hidden="{detail_view_active == false}">
	<div class="navigation recipe fixed">
		<div class="top-nav">
			<a href="http://startribune.com/">
				<img alt="Star Tribune logo" class="logo white" src="http://static.startribune.com/images/logos/icn-nav-masthead-logo-400-60.png">
				<!-- <img class="logo black" src="http://static.startribune.com/images/icons/startribune-logo-black.svg"> -->
			</a>
			<div class="sharing">
				<!-- sharing -->
			</div>
		</div>
		<div class="second-nav hide">
			<div class="condensed-view">
				<div class="selected-filters">
					<p>{checked_features_str}</p>
				</div>
				<div class="back" on:click={handleBackClick}>
					<p>Back</p>
				</div>
			</div>
		</div>
	</div>
	<div id="customize-controls">
	      <div class="previous"><i class=" strib-icon strib-nav-back"></i></div>
	      <div class="next"><i class="strib-icon strib-nav-forward"></i></div>
	    </div>
	<div id="detail-slider">
		{#each filteredRecipes as recipe}
			<CookieDetail {recipe}/>
		{/each}
	</div>
</div>
