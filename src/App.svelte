
<script>
	import { onMount } from 'svelte';
	import { tns } from "../node_modules/tiny-slider/src/tiny-slider"
	export let slider;

	const queryString = require('query-string');

	import CookieData from './data/cookies.json'
	import CookieThumb from './CookieThumb.svelte';
	import CookieDetail from './CookieDetail.svelte';
	import Sharing from './Sharing.svelte';

	export let cookie_list = CookieData;
	export let search_term = '';

	export let features = ['Winner', 'Easy', 'Chocolate', 'Fruit', 'Nut', 'International', 'Fun with kids'];
	export let checked_features = [];

	export let cookie_types = ['Any', 'Rolled', 'Bar', 'Drop', 'Refrigerator'];
	export let current_cookie_type = 'Any';

	export let current_recipe;

	export let detail_view_active = false;
	export let filters_hidden = true;

	export let scrollY;
	export let y_from_top;

	export let search_timeout;
	export let previous_search_term = '';

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
		if (checked_features.length < 1) {
			checked_features_str = 'None';
		} else if (checked_features.length > 3) {
			checked_features_str = checked_features.slice(0, 3).join(', ') + ' ...';
		} else {
			checked_features_str = checked_features.join(', ')
		}
	}

	// Detail view
	export const showDetail = function (event) {
		current_recipe = cookie_list.filter(recipe => recipe.id == event.detail.id)[0];
		detail_view_active = true;
		slider.goTo(event.detail.slider_id);
		// console.log('show detail');
		history.pushState(event.detail, event.detail.id, '?recipe=' + event.detail.id);
		window.gtag("event", "Recipe click", {'event_category': 'Cookie contest', 'event_label': current_recipe.name});
	}

	export const clearFilters = function (event) {
		checked_features = [];
		current_cookie_type = 'Any';
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
				detail_view_active = true;
				slider.goTo(i);
				break;
			}
		}
	}

	window.onpopstate = function(event) {
		// console.log('pop!', event);
		if (event.state.id) {
			triggerDetailView(event.state.id);
		} else {
			detail_view_active = false;
		}
	};

	onMount(() => {
		slider = tns({
	    container: '#detail-slider',
	    autoHeight: true,
	    controlsContainer: "#customize-controls",
	    items: 1,
	    slideBy: 'page',
	    autoplay: false
	  });

		slider.events.on('indexChanged', function (event) {
			// console.log('state change');
			// Push state change
			let detail_state = {
				id: cookie_list[event.index].id,
	      slider_id: event.index
			}
			history.pushState(detail_state, detail_state.id, '?recipe=' + detail_state.id);
		});

		const parsed_querystring = queryString.parse(location.search);
		if (parsed_querystring['recipe']) {
			triggerDetailView(parsed_querystring['recipe']);
		}

		window.dataLayer = window.dataLayer || [];
	  function gtag(){dataLayer.push(arguments);}
		window.gtag = gtag;
	  gtag('js', new Date());
	  gtag('config', 'UA-114906116-1');
	});

	const handleArrowClick = function(event) {
		if (filters_hidden) {
			filters_hidden = false;
		} else {
			filters_hidden = true;
		}
	}

	const handleBackClick = function(event) {
		detail_view_active = false;
		history.pushState({}, 'main view', '?');
		// if (detail_view_active) {
		// 	detail_view_active = false;
		// } else {
		// 	detail_view_active = true;
		// }
	}

	// Google Analytics section
	const logFeatureClick = function (event) {
		let event_action = event.target.checked ? 'Feature selected' : 'Feature de-selected';
		window.gtag("event", event_action, {'event_category': 'Cookie contest', 'event_label': event.target.value});
	}

	const logTypeClick = function (event) {
		window.gtag("event", "Type selected", {'event_category': 'Cookie contest', 'event_label': event.target.value});
	}

	const logSearch = function (event) {
		clearTimeout(search_timeout);
		search_timeout = setTimeout(function () {
			if (event.target.value != previous_search_term) {
				previous_search_term = event.target.value;
				window.gtag("event", "Cookie search", {'event_category': 'Cookie contest', 'event_label': event.target.value});
			}
		}, 1000);
	}

</script>

<svelte:window bind:scrollY/>

<div class="hero-wrapper"  class:recipe-show="{detail_view_active == true}">
	<div class="hero">
		<div class="main-photo">
			<div class="headline">
				<img alt="Star Tribune logo" src="http://static.startribune.com/images/logos/icn-nav-masthead-logo-400-60.png" class="logo">
				<h1><span>Best Holiday Cookies</span></h1>
			</div>
		</div>
		<p class="caption">Star Tribune 2020 Holiday Cookie Contest winner: Spumoni Squares by Joanne Holtmeier. Photo by Dennis Becker.</p>
	</div>

	<h2 class="subhead">Nearly 100 recipes to use this holiday season — and all year long.</h2>

	<div class="sponsor">
		<p>With Support From</p>
			<div id="div-gpt-ad-7442209-1"></div>
	</div>

	<div class="search">
		<h5>Search</h5>
		<i class="strib-icon strib-search"></i>
		<input placeholder="ex: cinnamon" bind:value={search_term} on:keyup={logSearch}/>
	</div>

	<div class="navigation inline" id="nav" class:fixed="{y_from_top <= 0}" class:inline="{y_from_top > 0}">
		<div class="top-nav">
			<a href="http://startribune.com/">
				<img alt="Star Tribune logo" class="logo white" src="http://static.startribune.com/images/logos/icn-nav-masthead-logo-400-60.png">
				<!-- <img class="logo black" src=""> -->
			</a>
			<div class="sharing">
				<Sharing/>
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
					<p><i class="strib-icon strib-nav-back"></i> Back</p>
				</div>
			</div>

			<div class="filters">
			  	<h5>Features</h5>
				{#each features as feature}
				<div class="feature">
					<input type=checkbox bind:group={checked_features} value={feature} class:all-selected="{features == checked_features}" on:click={logFeatureClick}>
					<label class="features">{feature}</label>
				</div>
				{/each}

			  	<h5>Cookie type</h5>
				{#each cookie_types as type}
					<div class="feature">
						<input type=radio bind:group={current_cookie_type} value={type} on:click={logTypeClick}>
						<label class="type">{type}</label>
					</div>
				{/each}

				<h4><a href="Javascript:;" on:click={clearFilters}>Clear all filters</a></h4>
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

	<div class="credits">
		<h3>credits</h3>
		<p><b>Recipe selection</b> Lee Svitak Dean, Rick Nelson</p>
		<p><b>Editing</b> Lee Svitak Dean, Rick Nelson</p>
		<p><b>Development</b> Michael Corey, Jamie Hutt, Anna Boone</p>
		<p><b>Design</b> Anna Boone, Josh Penrod, Jamie Hutt</p>
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
				<Sharing/>
			</div>
		</div>
		<div class="second-nav hide">
			<div class="condensed-view">
				<div class="selected-filters">
					<p>{checked_features_str}</p>
				</div>
				<div class="back" on:click={handleBackClick}>
					<p><i class="strib-icon strib-nav-back"></i> Back</p>
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
