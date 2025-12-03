import { useParentSize } from '@visx/responsive';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import clsx from 'clsx';
import { useMemo, forwardRef, useCallback, useContext } from 'react';
import {
	GlobalChartsProvider,
	GlobalChartsContext,
	useGlobalChartsTheme,
	useChartId,
} from '../../providers';
import styles from './category-bar.module.scss';
import type { CategoryBarProps, CategoryBarSegment } from './types';
import type { MouseEvent, FC } from 'react';

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 8;
const DEFAULT_GAP = 0;
const DEFAULT_BORDER_RADIUS = 4;
const DEFAULT_LABEL_FORMATTER = ( value: number ) => value.toString();

/**
 * Normalizes input values to CategoryBarSegment array.
 * @param values      - Input values array (numbers or segment objects).
 * @param colors      - Optional custom colors array.
 * @param themeColors - Theme colors to use as fallback.
 * @return Normalized array of CategoryBarSegment objects.
 */
const normalizeSegments = (
	values: number[] | CategoryBarSegment[],
	colors: string[] | undefined,
	themeColors: string[]
): CategoryBarSegment[] => {
	return ( values || [] ).map( ( value, index ) => {
		const segment: CategoryBarSegment = typeof value === 'number' ? { value } : { ...value };

		// Apply color priority: segment.color > colors prop > theme colors
		if ( ! segment.color ) {
			segment.color = colors?.[ index ] || themeColors[ index % themeColors.length ] || '#000000';
		}

		return segment;
	} );
};

const CategoryBarComponent = forwardRef< HTMLDivElement, CategoryBarProps >(
	(
		{
			values,
			mode = 'proportional',
			colors,
			marker,
			showLabels = true,
			width = DEFAULT_WIDTH,
			height = DEFAULT_HEIGHT,
			gap = DEFAULT_GAP,
			borderRadius = DEFAULT_BORDER_RADIUS,
			className,
			chartId: providedChartId,
			labelFormatter = DEFAULT_LABEL_FORMATTER,
			withTooltips = false,
		},
		ref
	) => {
		const theme = useGlobalChartsTheme();
		const generatedChartId = useChartId();
		const chartId = providedChartId || generatedChartId;

		const themeColors = useMemo( () => {
			return theme?.colors || [ '#000000' ];
		}, [ theme ] );

		// Normalize values to segments
		const segments = useMemo( () => {
			return normalizeSegments( values, colors, themeColors );
		}, [ values, colors, themeColors ] );

		// Calculate total for proportional mode
		const total = useMemo( () => {
			return segments.reduce( ( sum, s ) => sum + s.value, 0 );
		}, [ segments ] );

		// Calculate segment widths as percentages
		const segmentWidths = useMemo( () => {
			if ( segments.length === 0 ) {
				return [];
			}
			if ( mode === 'equal' ) {
				return segments.map( () => 100 / segments.length );
			}
			if ( total === 0 ) {
				return segments.map( () => 100 / segments.length );
			}
			return segments.map( s => ( s.value / total ) * 100 );
		}, [ segments, mode, total ] );

		// Calculate cumulative positions for labels
		const labelPositions = useMemo( () => {
			const positions: Array< { value: number; percent: number } > = [ { value: 0, percent: 0 } ];
			let cumulative = 0;
			let cumulativePercent = 0;

			segments.forEach( ( s, index ) => {
				cumulative += s.value;
				cumulativePercent += segmentWidths[ index ];
				positions.push( { value: cumulative, percent: cumulativePercent } );
			} );

			return positions;
		}, [ segments, segmentWidths ] );

		// Calculate marker position as percentage
		const markerPosition = useMemo( () => {
			if ( ! marker || total === 0 ) {
				return null;
			}
			const percent = ( marker.value / total ) * 100;
			return Math.min( 100, Math.max( 0, percent ) );
		}, [ marker, total ] );

		// Tooltip handling
		const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } =
			useTooltip< { label?: string; value: number; color: string } >();

		const { containerRef, TooltipInPortal } = useTooltipInPortal( {
			detectBounds: true,
			scroll: true,
		} );

		const createSegmentMouseMoveHandler = useCallback(
			( segment: CategoryBarSegment ) => ( event: MouseEvent< HTMLDivElement > ) => {
				if ( ! withTooltips ) {
					return;
				}
				const rect = ( event.currentTarget as HTMLElement ).getBoundingClientRect();
				showTooltip( {
					tooltipData: {
						label: segment.label,
						value: segment.value,
						color: segment.color || '#000',
					},
					tooltipLeft: event.clientX - rect.left + rect.width / 2,
					tooltipTop: -8,
				} );
			},
			[ withTooltips, showTooltip ]
		);

		// Memoize handlers for each segment to avoid creating new functions on each render
		const segmentMouseMoveHandlers = useMemo( () => {
			return segments.map( segment => createSegmentMouseMoveHandler( segment ) );
		}, [ segments, createSegmentMouseMoveHandler ] );

		const handleMouseLeave = useCallback( () => {
			if ( withTooltips ) {
				hideTooltip();
			}
		}, [ withTooltips, hideTooltip ] );

		// Handle empty data
		if ( ! values || values.length === 0 ) {
			return (
				<div
					ref={ ref }
					className={ clsx( styles.categoryBar, styles[ 'categoryBar--empty' ], className ) }
					style={ { width, height } }
					data-testid="category-bar-empty"
				/>
			);
		}

		// Calculate total gap width
		const totalGapWidth = gap * ( segments.length - 1 );
		const availableWidth = width - totalGapWidth;

		return (
			<div
				ref={ containerRef }
				className={ clsx( styles.categoryBar, className ) }
				style={ { width } }
				data-testid="category-bar"
				data-chart-id={ `category-bar-${ chartId }` }
			>
				<div
					className={ styles.categoryBar__bar }
					style={ {
						height,
						borderRadius,
						gap,
					} }
				>
					{ segments.map( ( segment, index ) => {
						const widthPercent = segmentWidths[ index ];
						const isFirst = index === 0;
						const isLast = index === segments.length - 1;

						return (
							<div
								key={ index }
								className={ clsx( styles.categoryBar__segment, {
									[ styles[ 'categoryBar__segment--first' ] ]: isFirst,
									[ styles[ 'categoryBar__segment--last' ] ]: isLast,
								} ) }
								style={ {
									width: `${ ( widthPercent / 100 ) * availableWidth }px`,
									backgroundColor: segment.color,
									borderTopLeftRadius: isFirst ? borderRadius : 0,
									borderBottomLeftRadius: isFirst ? borderRadius : 0,
									borderTopRightRadius: isLast ? borderRadius : 0,
									borderBottomRightRadius: isLast ? borderRadius : 0,
								} }
								onMouseMove={ segmentMouseMoveHandlers[ index ] }
								onMouseLeave={ handleMouseLeave }
								data-testid={ `category-bar-segment-${ index }` }
							/>
						);
					} ) }

					{ marker && markerPosition !== null && (
						<div
							className={ clsx( styles.categoryBar__marker, {
								[ styles[ 'categoryBar__marker--animated' ] ]: marker.showAnimation,
							} ) }
							style={ {
								left: `${ markerPosition }%`,
								height: height + 8,
								top: -4,
								backgroundColor: marker.color || theme?.gridColor || '#374151',
							} }
							data-testid="category-bar-marker"
							title={ marker.tooltip }
						/>
					) }
				</div>

				{ showLabels && (
					<div className={ styles.categoryBar__labels }>
						{ labelPositions.map( ( pos, index ) => (
							<span
								key={ index }
								className={ styles.categoryBar__label }
								style={ {
									left: `${ pos.percent }%`,
								} }
								data-testid={ `category-bar-label-${ index }` }
							>
								{ labelFormatter( pos.value ) }
							</span>
						) ) }
					</div>
				) }

				{ withTooltips && tooltipOpen && tooltipData && (
					<TooltipInPortal top={ tooltipTop || 0 } left={ tooltipLeft || 0 }>
						<div className={ styles.categoryBar__tooltip } role="tooltip">
							{ tooltipData.label && (
								<span className={ styles.categoryBar__tooltipLabel }>{ tooltipData.label }: </span>
							) }
							<span className={ styles.categoryBar__tooltipValue }>{ tooltipData.value }</span>
						</div>
					</TooltipInPortal>
				) }
			</div>
		);
	}
);

CategoryBarComponent.displayName = 'CategoryBarComponent';

/**
 * CategoryBar chart component with GlobalChartsProvider wrapper.
 * @param props - CategoryBar component props.
 * @return CategoryBar component wrapped in provider if needed.
 */
const CategoryBarWithProvider: FC< CategoryBarProps > = props => {
	const existingContext = useContext( GlobalChartsContext );

	// If we're already in a GlobalChartsProvider context, don't create a new one
	if ( existingContext ) {
		return <CategoryBarComponent { ...props } />;
	}

	// Otherwise, create our own GlobalChartsProvider
	return (
		<GlobalChartsProvider>
			<CategoryBarComponent { ...props } />
		</GlobalChartsProvider>
	);
};

CategoryBarWithProvider.displayName = 'CategoryBarUnresponsive';

// Export the provider-wrapped component as the unresponsive variant
const CategoryBarUnresponsive = CategoryBarWithProvider;

/**
 * Responsive configuration for CategoryBar
 */
export type CategoryBarResponsiveConfig = {
	/**
	 * The maximum width of the chart. Defaults to 1200.
	 */
	maxWidth?: number;
	/**
	 * Child render updates upon resize are delayed until debounceTime milliseconds after the last resize event.
	 */
	resizeDebounceTime?: number;
};

/**
 * Responsive CategoryBar chart component.
 * @param props                    - Component props including responsive configuration.
 * @param props.resizeDebounceTime - Debounce time for resize events.
 * @param props.maxWidth           - Maximum width constraint.
 * @return Responsive CategoryBar component.
 */
const CategoryBar = ( {
	resizeDebounceTime = 300,
	maxWidth = 1200,
	...chartProps
}: Omit< CategoryBarProps, 'width' > & CategoryBarResponsiveConfig & { width?: number } ) => {
	const { parentRef, width: parentWidth } = useParentSize( {
		debounceTime: resizeDebounceTime,
		enableDebounceLeadingCall: true,
	} );

	const containerWidth = parentWidth > 0 ? Math.min( parentWidth, maxWidth ) : 0;

	return (
		<div
			ref={ parentRef }
			style={ {
				width: chartProps.width ?? '100%',
			} }
		>
			<CategoryBarUnresponsive
				{ ...chartProps }
				width={ containerWidth || chartProps.width || DEFAULT_WIDTH }
			/>
		</div>
	);
};

CategoryBar.displayName = 'CategoryBar';

export { CategoryBar as default, CategoryBarUnresponsive };
