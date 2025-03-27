import { addFilter } from "@wordpress/hooks";
import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody, CheckboxControl, FormTokenField  } from "@wordpress/components";
import { registerBlockVariation } from "@wordpress/blocks";
import { useSelect } from "@wordpress/data";
import { useEffect, useRef } from "@wordpress/element";

registerBlockVariation("core/query", {
	name: "carousel-query-loop",
	title: "Carousel Query Loop",
	description: "A Query Loop variation that uses a carousel layout.",
	isActive: ["namespace"],
	icon: "images-alt2",
	attributes: {
		namespace: "carousel-query-loop",
		className: "is-carousel-query",
		isAutoPlay: true,
	},
	innerBlocks: [["core/post-template", {}, [["core/post-title", {}]]]],
	scope: ["inserter"],
	keywords: ["carousel", "slider", "query"],
});

const withQueryCarouselControls = (BlockEdit) => (props) => {

	if ( props.attributes?.namespace !== 'carousel-query-loop' ) {
		return <BlockEdit {...props} />
	}

	const { attributes, setAttributes } = props;
	const queryPostType = attributes?.query?.postType || 'post';
	const selectedPosts = attributes?.query?.selectedPosts || [];
	const initialSelectedPostsRef = useRef(queryPostType);

	useEffect(() => {
		if (initialSelectedPostsRef.current !== queryPostType) {
			setAttributes({
				query: {
					...attributes.query,
					selectedPosts: [],
				}
			})
		}
	}, [attributes?.query?.postType]);

	// Fetch posts based on the query post type
	const posts = useSelect( (select) =>
		select("core").getEntityRecords("postType", queryPostType, { per_page: -1 }),
		[attributes?.query?.postType]
	);

	// Build an array of options to populate the FormTokenField
  	const postOptions = (posts ?? [])
		.map( ( post ) => ( post.title.rendered ) )
  		.sort( ( a, b ) => a.localeCompare( b ) );

	// Map selected post IDs to their titles for the FormTokenField
	const selectedPostsLabels = posts ? selectedPosts.map( ( postId ) => {
		const post = posts.find( ( post ) => post.id === postId );
		return post ? post.title.rendered : null;
	}) : [];

	const onSetPosts = ( values ) => {

		selectedPostsLabels.length = 0;
		attributes.query.selectedPosts = [];

		if ( ! values || values.length === 0 ) {
			setAttributes( { query: { ...attributes.query} } );
			return;
		}

		selectedPostsLabels.push( ...values );

		attributes.query.selectedPosts = values.map( ( value ) => {
			const post = posts.find( ( post ) => post.title.rendered === value );
			return post ? post.id : null;
		});

		setAttributes( { query: {
			...attributes.query,
		}});
	}

	return <>
		<BlockEdit {...props} />
		<InspectorControls>
			<PanelBody title="Carousel Options">
			<CheckboxControl
				label="Show Two"
				__nextHasNoMarginBottom
				checked={attributes?.isTwoUp || false}
				onChange={(value) => {
					setAttributes({ isTwoUp: value });
				}}
			/>
			<CheckboxControl
				label="Peek"
				__nextHasNoMarginBottom
				checked={attributes?.isPeek || false}
				onChange={(value) => {
					setAttributes({ isPeek: value });
				}}
			/>
			<CheckboxControl
				label="Auto Play"
				__nextHasNoMarginBottom
				checked={attributes?.isAutoPlay || false}
				onChange={(value) => {
					setAttributes({ isAutoPlay: value });
				}}
			/>
			<FormTokenField
  				__next40pxDefaultSize
   				__nextHasNoMarginBottom
				__experimentalExpandOnFocus
				__experimentalShowHowTo = {false}
   				label={ queryPostType.charAt(0).toUpperCase() + queryPostType.slice(1) + "s" }
   				onChange={onSetPosts}
   				suggestions={ postOptions }
  				value={selectedPostsLabels}
 			/>
		</PanelBody>
		</InspectorControls>
	</>
};

addFilter("editor.BlockEdit", "core/query", withQueryCarouselControls);
