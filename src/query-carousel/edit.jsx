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
		isAutoPlay: true,
	},
	innerBlocks: [["core/post-template", {}, [["core/post-title", {}]]]],
	scope: ["inserter"],
	keywords: ["carousel", "slider", "query"],
});

const withQueryCarouselControls = (BlockEdit) => (props) => {

	const { attributes, setAttributes } = props;


	if ( attributes?.namespace !== 'carousel-query-loop' ) {
		return <BlockEdit {...props} />
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
		</PanelBody>
		</InspectorControls>
	</>
};

addFilter("editor.BlockEdit", "core/query", withQueryCarouselControls);
