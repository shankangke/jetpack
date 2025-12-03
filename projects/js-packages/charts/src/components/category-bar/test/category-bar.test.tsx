/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import { CategoryBar, CategoryBarUnresponsive } from '../';
import { GlobalChartsProvider, jetpackTheme, wooTheme } from '../../../providers';

describe( 'CategoryBar', () => {
	const defaultData = [ 25, 50, 25 ];

	const renderWithTheme = ( props = {}, themeName = 'jetpack' ) => {
		const theme = themeName === 'jetpack' ? jetpackTheme : wooTheme;
		return render(
			<GlobalChartsProvider theme={ theme }>
				<CategoryBarUnresponsive values={ defaultData } { ...props } />
			</GlobalChartsProvider>
		);
	};

	describe( 'Basic Rendering', () => {
		test( 'renders with array of numbers', () => {
			renderWithTheme();
			expect( screen.getByTestId( 'category-bar' ) ).toBeInTheDocument();
		} );

		test( 'renders correct number of segments', () => {
			renderWithTheme();
			expect( screen.getByTestId( 'category-bar-segment-0' ) ).toBeInTheDocument();
			expect( screen.getByTestId( 'category-bar-segment-1' ) ).toBeInTheDocument();
			expect( screen.getByTestId( 'category-bar-segment-2' ) ).toBeInTheDocument();
		} );

		test( 'renders with segment objects', () => {
			renderWithTheme( {
				values: [
					{ value: 30, label: 'First' },
					{ value: 70, label: 'Second' },
				],
			} );
			expect( screen.getByTestId( 'category-bar-segment-0' ) ).toBeInTheDocument();
			expect( screen.getByTestId( 'category-bar-segment-1' ) ).toBeInTheDocument();
		} );

		test( 'applies custom className', () => {
			renderWithTheme( { className: 'custom-class' } );
			expect( screen.getByTestId( 'category-bar' ) ).toHaveClass( 'custom-class' );
		} );

		test( 'renders responsive variant', () => {
			render(
				<GlobalChartsProvider theme={ jetpackTheme }>
					<CategoryBar values={ defaultData } width={ 200 } height={ 10 } />
				</GlobalChartsProvider>
			);
			expect( screen.getByTestId( 'category-bar' ) ).toBeInTheDocument();
		} );
	} );

	describe( 'Display Modes', () => {
		test( 'proportional mode: segment widths reflect values', () => {
			renderWithTheme( { values: [ 25, 75 ], width: 200, gap: 0 } );
			const segment0 = screen.getByTestId( 'category-bar-segment-0' );
			const segment1 = screen.getByTestId( 'category-bar-segment-1' );

			// First segment should be 25% width, second 75%
			expect( segment0 ).toHaveStyle( { width: '50px' } ); // 25% of 200
			expect( segment1 ).toHaveStyle( { width: '150px' } ); // 75% of 200
		} );

		test( 'equal mode: all segments same width', () => {
			renderWithTheme( { values: [ 25, 75 ], mode: 'equal', width: 200, gap: 0 } );
			const segment0 = screen.getByTestId( 'category-bar-segment-0' );
			const segment1 = screen.getByTestId( 'category-bar-segment-1' );

			// Both segments should be 50% width
			expect( segment0 ).toHaveStyle( { width: '100px' } );
			expect( segment1 ).toHaveStyle( { width: '100px' } );
		} );
	} );

	describe( 'Edge Cases', () => {
		test( 'handles empty values array', () => {
			renderWithTheme( { values: [] } );
			expect( screen.getByTestId( 'category-bar-empty' ) ).toBeInTheDocument();
		} );

		test( 'handles single segment', () => {
			renderWithTheme( { values: [ 100 ] } );
			expect( screen.getByTestId( 'category-bar-segment-0' ) ).toBeInTheDocument();
			expect( screen.queryByTestId( 'category-bar-segment-1' ) ).not.toBeInTheDocument();
		} );

		test( 'handles all zero values', () => {
			renderWithTheme( { values: [ 0, 0, 0 ], mode: 'equal', width: 300, gap: 0 } );
			// Should render equal segments when all values are zero
			const segment0 = screen.getByTestId( 'category-bar-segment-0' );
			// Allow for floating point precision issues
			const computedWidth = parseFloat( segment0.style.width );
			expect( computedWidth ).toBeCloseTo( 100, 0 );
		} );
	} );

	describe( 'Styling', () => {
		test( 'custom colors applied correctly', () => {
			renderWithTheme( {
				values: [ 50, 50 ],
				colors: [ '#ff0000', '#00ff00' ],
			} );
			const segment0 = screen.getByTestId( 'category-bar-segment-0' );
			const segment1 = screen.getByTestId( 'category-bar-segment-1' );

			expect( segment0 ).toHaveStyle( { backgroundColor: '#ff0000' } );
			expect( segment1 ).toHaveStyle( { backgroundColor: '#00ff00' } );
		} );

		test( 'segment object colors override colors prop', () => {
			renderWithTheme( {
				values: [ { value: 50, color: '#0000ff' }, { value: 50 } ],
				colors: [ '#ff0000', '#00ff00' ],
			} );
			const segment0 = screen.getByTestId( 'category-bar-segment-0' );
			const segment1 = screen.getByTestId( 'category-bar-segment-1' );

			expect( segment0 ).toHaveStyle( { backgroundColor: '#0000ff' } );
			expect( segment1 ).toHaveStyle( { backgroundColor: '#00ff00' } );
		} );

		test( 'border radius applied to first and last segments', () => {
			renderWithTheme( { values: [ 33, 34, 33 ], borderRadius: 8 } );
			const segment0 = screen.getByTestId( 'category-bar-segment-0' );
			const segment2 = screen.getByTestId( 'category-bar-segment-2' );

			expect( segment0 ).toHaveStyle( { borderTopLeftRadius: '8px' } );
			expect( segment0 ).toHaveStyle( { borderBottomLeftRadius: '8px' } );
			expect( segment2 ).toHaveStyle( { borderTopRightRadius: '8px' } );
			expect( segment2 ).toHaveStyle( { borderBottomRightRadius: '8px' } );
		} );
	} );

	describe( 'Dimensions', () => {
		test( 'applies default dimensions', () => {
			renderWithTheme();
			const bar = screen.getByTestId( 'category-bar' );
			expect( bar ).toHaveStyle( { width: '300px' } );
		} );

		test( 'applies custom dimensions', () => {
			renderWithTheme( { width: 400, height: 12 } );
			const bar = screen.getByTestId( 'category-bar' );
			expect( bar ).toHaveStyle( { width: '400px' } );
		} );
	} );

	describe( 'Labels', () => {
		test( 'shows labels when showLabels=true', () => {
			renderWithTheme( { showLabels: true } );
			// Should show cumulative labels: 0, 25, 75, 100
			expect( screen.getByTestId( 'category-bar-label-0' ) ).toHaveTextContent( '0' );
			expect( screen.getByTestId( 'category-bar-label-3' ) ).toHaveTextContent( '100' );
		} );

		test( 'hides labels when showLabels=false', () => {
			renderWithTheme( { showLabels: false } );
			expect( screen.queryByTestId( 'category-bar-label-0' ) ).not.toBeInTheDocument();
		} );

		test( 'custom labelFormatter works', () => {
			renderWithTheme( {
				showLabels: true,
				labelFormatter: value => `${ value }%`,
			} );
			expect( screen.getByTestId( 'category-bar-label-0' ) ).toHaveTextContent( '0%' );
			expect( screen.getByTestId( 'category-bar-label-3' ) ).toHaveTextContent( '100%' );
		} );
	} );

	describe( 'Marker', () => {
		test( 'renders marker at correct position', () => {
			renderWithTheme( {
				values: [ 50, 50 ],
				marker: { value: 25 },
			} );
			const marker = screen.getByTestId( 'category-bar-marker' );
			expect( marker ).toBeInTheDocument();
			expect( marker ).toHaveStyle( { left: '25%' } );
		} );

		test( 'marker tooltip displays', () => {
			renderWithTheme( {
				values: [ 50, 50 ],
				marker: { value: 50, tooltip: 'Halfway point' },
			} );
			const marker = screen.getByTestId( 'category-bar-marker' );
			expect( marker ).toHaveAttribute( 'title', 'Halfway point' );
		} );

		test( 'marker renders with showAnimation=true', () => {
			renderWithTheme( {
				values: [ 50, 50 ],
				marker: { value: 50, showAnimation: true },
			} );
			const marker = screen.getByTestId( 'category-bar-marker' );
			// Marker should be present - animation is a CSS-only visual effect
			expect( marker ).toBeInTheDocument();
			expect( marker ).toHaveStyle( { left: '50%' } );
		} );
	} );

	describe( 'Theme Integration', () => {
		test( 'uses jetpack theme colors', () => {
			renderWithTheme( { values: [ 50, 50 ] }, 'jetpack' );
			const segment0 = screen.getByTestId( 'category-bar-segment-0' );
			// Jetpack theme first color
			expect( segment0 ).toHaveStyle( { backgroundColor: jetpackTheme.colors[ 0 ] } );
		} );

		test( 'uses woo theme colors', () => {
			renderWithTheme( { values: [ 50, 50 ] }, 'woo' );
			const segment0 = screen.getByTestId( 'category-bar-segment-0' );
			// Woo theme first color
			expect( segment0 ).toHaveStyle( { backgroundColor: wooTheme.colors[ 0 ] } );
		} );

		test( 'color prop overrides theme color', () => {
			renderWithTheme( {
				values: [ 50, 50 ],
				colors: [ '#custom1', '#custom2' ],
			} );
			const segment0 = screen.getByTestId( 'category-bar-segment-0' );
			expect( segment0 ).toHaveStyle( { backgroundColor: '#custom1' } );
		} );
	} );

	describe( 'Gap Between Segments', () => {
		test( 'applies gap between segments', () => {
			renderWithTheme( { values: [ 50, 50 ], gap: 4, width: 204 } );
			// With 4px gap and 204px width, available width is 200px
			// Each segment should be 100px (50% of 200)
			const segment0 = screen.getByTestId( 'category-bar-segment-0' );
			expect( segment0 ).toHaveStyle( { width: '100px' } );
		} );
	} );
} );
