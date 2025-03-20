<?php
/**
 * Plugin Name:       Query Carousel
 * Description:       A Carousel for a collection of Posts
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Text Domain:       query-carousel
 *
 * @package QueryCarousel
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_action('enqueue_block_editor_assets', function () {
	wp_enqueue_script(
		'query-carousel',
		plugins_url('build/queryCarouselEdit.js', __FILE__),
		['wp-blocks', 'wp-dom-ready', 'wp-edit-post'],
		filemtime(__DIR__ . '/build/queryCarouselEdit.js')
	);
});

// optionally include the view script but only if the block is present
add_action('wp_enqueue_scripts', function () {

	// TODO: Only enqueue if the block variation is present
	if ( ! has_block('query') ) {
		return;
	}

	wp_register_script(
		'glide',
		plugins_url('libraries/glide/glide.min.js', __FILE__),
		[],
		filemtime(__DIR__ . '/libraries/glide/glide.min.js')
	);

	wp_enqueue_style(
		'glide-style',
		plugins_url('/libraries/glide/css/glide.core.min.css', __FILE__),
		[],
		filemtime(__DIR__ . '/libraries/glide/css/glide.core.min.css')
	);

	wp_enqueue_script(
		'query-carousel-view',
		plugins_url('build/queryCarouselView.js', __FILE__),
		['wp-blocks', 'wp-dom-ready', 'glide'],
		filemtime(__DIR__ . '/build/queryCarouselView.js')
	);

});

// when the query block renders, check to see if it is a carousel variation
// and if so, add the necessary classes to the wrapper to customize functionality
add_filter('render_block', function ($block_content, $block) {

	if ( 'core/query' !== $block['blockName'] || empty($block['attrs']['namespace']) || $block['attrs']['namespace'] !== 'carousel-query-loop' ) {
		return $block_content;
	}

	$classes = array_filter([
		$block['attrs']['query']['isAutoPlay'] ?? false ? 'carousel-auto' : null,
		$block['attrs']['query']['isTwoUp'] ?? false ? 'carousel-two-up' : null,
		$block['attrs']['query']['isPeek'] ?? false ? 'carousel-peek' : null,
	]);

	if ( ! empty($classes) ) {
		$processor = new WP_HTML_Tag_Processor( $block_content );
		$processor->next_tag();
		$processor->add_class( implode( ' ', $classes ) );
		return $processor->get_updated_html();
	}

	return $block_content;

}, 10, 2);
