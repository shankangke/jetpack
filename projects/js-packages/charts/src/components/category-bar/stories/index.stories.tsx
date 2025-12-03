import { CategoryBar, CategoryBarUnresponsive } from '../';
import type { CategoryBarProps } from '../types';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta< CategoryBarProps > = {
	title: 'JS Packages/Charts/Types/Category Bar',
	component: CategoryBar,
	parameters: {
		layout: 'padded',
	},
	argTypes: {
		values: {
			control: 'object',
			description: 'Array of segment values (numbers or segment objects)',
			table: { category: 'Data' },
		},
		mode: {
			control: 'select',
			options: [ 'proportional', 'equal' ],
			description: 'How segment widths are calculated',
			table: { category: 'Display' },
		},
		colors: {
			control: 'object',
			description: 'Custom colors for segments',
			table: { category: 'Visual Style' },
		},
		showLabels: {
			control: 'boolean',
			description: 'Whether to show cumulative labels',
			table: { category: 'Display' },
		},
		width: {
			control: { type: 'number', min: 100, max: 600 },
			description: 'Width of the bar in pixels',
			table: { category: 'Dimensions' },
		},
		height: {
			control: { type: 'number', min: 4, max: 32 },
			description: 'Height of the bar in pixels',
			table: { category: 'Dimensions' },
		},
		gap: {
			control: { type: 'number', min: 0, max: 8 },
			description: 'Gap between segments in pixels',
			table: { category: 'Visual Style' },
		},
		borderRadius: {
			control: { type: 'number', min: 0, max: 16 },
			description: 'Corner radius for the bar',
			table: { category: 'Visual Style' },
		},
		withTooltips: {
			control: 'boolean',
			description: 'Whether to show tooltips on hover',
			table: { category: 'Interaction' },
		},
	},
};

export default meta;
type Story = StoryObj< typeof CategoryBar >;

export const Default: Story = {
	args: {
		values: [ 10, 25, 45, 20 ],
		width: 400,
		height: 8,
	},
};

export const ProportionalMode: Story = {
	args: {
		values: [ 25, 50, 25 ],
		mode: 'proportional',
		width: 400,
		height: 8,
	},
	parameters: {
		docs: {
			description: {
				story:
					'In proportional mode (default), segment widths are based on their values relative to the total.',
			},
		},
	},
};

export const EqualMode: Story = {
	args: {
		values: [ 10, 20, 30 ],
		mode: 'equal',
		width: 400,
		height: 8,
		colors: [ '#ef4444', '#f59e0b', '#22c55e' ],
	},
	parameters: {
		docs: {
			description: {
				story:
					'In equal mode, all segments have the same width regardless of their values. Useful for status indicators.',
			},
		},
	},
};

export const WithMarker: Story = {
	args: {
		values: [ 10, 25, 45, 20 ],
		width: 400,
		height: 8,
		marker: {
			value: 68,
			tooltip: 'Current: 68%',
			showAnimation: true,
		},
	},
	parameters: {
		docs: {
			description: {
				story: 'A marker can be added to indicate a specific position on the bar.',
			},
		},
	},
};

export const CustomColors: Story = {
	args: {
		values: [ 25, 25, 25, 25 ],
		width: 400,
		height: 8,
		colors: [ '#8b5cf6', '#ec4899', '#f97316', '#14b8a6' ],
	},
	parameters: {
		docs: {
			description: {
				story: 'Custom colors can be applied to segments using the colors prop.',
			},
		},
	},
};

export const HealthCheckStyle: Story = {
	args: {
		values: [
			{ value: 1, label: 'Critical' },
			{ value: 1, label: 'Warning' },
			{ value: 1, label: 'Good' },
		],
		mode: 'equal',
		width: 300,
		height: 6,
		colors: [ '#ef4444', '#f59e0b', '#22c55e' ],
		showLabels: false,
		gap: 2,
		borderRadius: 3,
	},
	parameters: {
		docs: {
			description: {
				story:
					'A health-check style indicator with equal segments and semantic colors (red/yellow/green).',
			},
		},
	},
};

export const ProgressIndicator: Story = {
	args: {
		values: [ 65, 35 ],
		width: 300,
		height: 10,
		colors: [ '#3b82f6', '#e5e7eb' ],
		showLabels: false,
		borderRadius: 5,
	},
	parameters: {
		docs: {
			description: {
				story: 'A simple two-segment progress indicator showing completion percentage.',
			},
		},
	},
};

export const NoLabels: Story = {
	args: {
		values: [ 30, 45, 25 ],
		width: 400,
		height: 8,
		showLabels: false,
	},
	parameters: {
		docs: {
			description: {
				story: 'The cumulative labels can be hidden for a cleaner appearance.',
			},
		},
	},
};

export const WithTooltips: Story = {
	args: {
		values: [
			{ value: 30, label: 'Product A' },
			{ value: 45, label: 'Product B' },
			{ value: 25, label: 'Product C' },
		],
		width: 400,
		height: 12,
		withTooltips: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Hover over segments to see tooltip details when withTooltips is enabled.',
			},
		},
	},
};

export const WithSegmentObjects: Story = {
	args: {
		values: [
			{ value: 40, label: 'Revenue', color: '#22c55e' },
			{ value: 35, label: 'Costs', color: '#ef4444' },
			{ value: 25, label: 'Profit', color: '#3b82f6' },
		],
		width: 400,
		height: 10,
		withTooltips: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Segment objects allow specifying individual labels and colors for each segment.',
			},
		},
	},
};

export const CustomLabelFormatter: Story = {
	args: {
		values: [ 25, 50, 25 ],
		width: 400,
		height: 8,
		labelFormatter: value => `${ value }%`,
	},
	parameters: {
		docs: {
			description: {
				story: 'A custom label formatter can be used to format the cumulative value labels.',
			},
		},
	},
};

export const WithGap: Story = {
	args: {
		values: [ 20, 30, 25, 25 ],
		width: 400,
		height: 10,
		gap: 4,
		borderRadius: 4,
	},
	parameters: {
		docs: {
			description: {
				story: 'Gaps can be added between segments for visual separation.',
			},
		},
	},
};

export const DashboardIntegration: Story = {
	render: () => (
		<div
			style={ {
				padding: '24px',
				backgroundColor: '#f9fafb',
				borderRadius: '12px',
				maxWidth: '400px',
			} }
		>
			<div style={ { marginBottom: '16px' } }>
				<div style={ { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } }>
					<span style={ { fontSize: '14px', color: '#374151' } }>Monthly OpEx</span>
					<span style={ { fontSize: '14px', color: '#6b7280' } }>$180k</span>
				</div>
				<CategoryBarUnresponsive
					values={ [ 45, 30, 15, 10 ] }
					width={ 352 }
					height={ 6 }
					showLabels={ false }
					borderRadius={ 3 }
				/>
			</div>
			<div>
				<div style={ { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } }>
					<span style={ { fontSize: '14px', color: '#374151' } }>Budget Utilization</span>
					<span style={ { fontSize: '14px', color: '#22c55e' } }>72%</span>
				</div>
				<CategoryBarUnresponsive
					values={ [ 72, 28 ] }
					width={ 352 }
					height={ 6 }
					colors={ [ '#22c55e', '#e5e7eb' ] }
					showLabels={ false }
					borderRadius={ 3 }
					marker={ { value: 72, showAnimation: true } }
				/>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: 'Example of CategoryBar integrated into a dashboard card layout.',
			},
		},
	},
};

export const ComparisonStack: Story = {
	render: () => (
		<div style={ { display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' } }>
			{ [ 'Jan', 'Feb', 'Mar', 'Apr' ].map( ( month, index ) => (
				<div key={ month }>
					<div style={ { fontSize: '12px', color: '#6b7280', marginBottom: '4px' } }>{ month }</div>
					<CategoryBarUnresponsive
						values={ [ 20 + index * 5, 30 - index * 3, 25 + index * 2, 25 - index * 4 + 10 ] }
						width={ 350 }
						height={ 8 }
						showLabels={ false }
						borderRadius={ 4 }
					/>
				</div>
			) ) }
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: 'Multiple CategoryBars stacked vertically to show comparison over time.',
			},
		},
	},
};

export const Responsive: Story = {
	args: {
		values: [ 30, 40, 30 ],
		height: 10,
		showLabels: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					'The responsive variant adapts to container width. Resize the container to see the chart adapt.',
			},
		},
	},
};

export const EdgeCases: Story = {
	render: () => (
		<div style={ { display: 'flex', flexDirection: 'column', gap: '24px' } }>
			<div>
				<h4 style={ { marginBottom: '8px' } }>Empty Data</h4>
				<CategoryBarUnresponsive values={ [] } width={ 300 } height={ 8 } />
			</div>
			<div>
				<h4 style={ { marginBottom: '8px' } }>Single Segment</h4>
				<CategoryBarUnresponsive values={ [ 100 ] } width={ 300 } height={ 8 } />
			</div>
			<div>
				<h4 style={ { marginBottom: '8px' } }>Many Segments</h4>
				<CategoryBarUnresponsive
					values={ [ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10 ] }
					width={ 300 }
					height={ 8 }
					showLabels={ false }
				/>
			</div>
			<div>
				<h4 style={ { marginBottom: '8px' } }>Very Small Values</h4>
				<CategoryBarUnresponsive values={ [ 1, 1, 98 ] } width={ 300 } height={ 8 } />
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: 'Examples of how the CategoryBar handles edge cases and unusual data.',
			},
		},
	},
};
