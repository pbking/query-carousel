import { addFilter } from "@wordpress/hooks";
import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody, CheckboxControl  } from "@wordpress/components";
import { registerBlockVariation } from "@wordpress/blocks";

registerBlockVariation("core/query", {
	name: "carousel-query-loop",
	title: "Carousel Query Loop",
	description: "A Query Loop variation that uses a carousel layout.",
	isActive: ["namespace"],
	icon: "images-alt2",
	attributes: {
		namespace: "carousel-query-loop",
		className: "is-carousel-query",
	},
	innerBlocks: [["core/post-template", {}, [["core/post-title", {}]]]],
	scope: ["inserter"],
	keywords: ["carousel", "slider", "query"],
});

const withQueryCarouselControls = (BlockEdit) => (props) => {

	if ( ! props?.attributes?.namespace === 'carousel-query-loop' ) {
		return <BlockEdit {...props} />
	}

	const query = props?.attributes?.query || {};
	const setAttributes = props.setAttributes;

	return <>
		<BlockEdit {...props} />
		<InspectorControls>
			<PanelBody title="Carousel Options">
			<CheckboxControl
				label="Show Two"
				__nextHasNoMarginBottom
				checked={query.isTwoUp || false}
				onChange={(value) => {
					setAttributes({ query:{ ...query, isTwoUp: value }});
				}}
			/>
			<CheckboxControl
				label="Peek"
				__nextHasNoMarginBottom
				checked={query.isPeek || false}
				onChange={(value) => {
					setAttributes({ query:{ ...query, isPeek: value }});
				}}
			/>
			<CheckboxControl
				label="Auto Play"
				__nextHasNoMarginBottom
				checked={query.isAutoPlay || false}
				onChange={(value) => {
					setAttributes({ query:{ ...query, isAutoPlay: value }});
				}}
			/>
		</PanelBody>
		</InspectorControls>
	</>
};

addFilter("editor.BlockEdit", "core/query", withQueryCarouselControls);
