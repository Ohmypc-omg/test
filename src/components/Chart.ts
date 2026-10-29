// Chart component using Canvas API

import { createElement } from '../utils/dom';
import type { ChartData, ChartDataset } from '../types';

export interface ChartProps {
  data: ChartData;
  type: 'line' | 'bar' | 'area';
  width?: number;
  height?: number;
  className?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  showPoints?: boolean;
  smooth?: boolean;
  colors?: string[];
  animate?: boolean;
}

interface ChartInstance {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  animationId: number | null;
  currentFrame: number;
  totalFrames: number;
}

// Color palette
const DEFAULT_COLORS = [
  '#4F46E5', // Primary
  '#10B981', // Success
  '#F59E0B', // Warning
  '#EF4444', // Error
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#EC4899', // Pink
  '#84CC16', // Lime
];

export function createChart(props: ChartProps): HTMLElement {
  const {
    data,
    type,
    width = 400,
    height = 250,
    className = '',
    showLegend = true,
    showGrid = true,
    showPoints = true,
    smooth = true,
    colors = DEFAULT_COLORS,
    animate = true,
  } = props;

  const container = createElement('div', { class: `chart-container ${className}`, style: { width: `${width}px`, height: `${height}px` } });

  const canvas = createElement('canvas', {
    width: String(width * 2), // 2x for retina
    height: String(height * 2),
    style: { width: `${width}px`, height: `${height}px` },
    class: 'chart-canvas',
    role: 'img',
    'aria-label': `${type} chart`,
  }) as HTMLCanvasElement;

  container.appendChild(canvas);

  const ctx = canvas.getContext('2d')!;
  ctx.scale(2, 2); // Scale for retina

  const chartInstance: ChartInstance = {
    canvas,
    ctx,
    animationId: null,
    currentFrame: 0,
    totalFrames: 60,
  };

  // Calculate chart dimensions
  const padding = { top: 20, right: showLegend ? 120 : 20, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find data ranges
  let minValue = Infinity;
  let maxValue = -Infinity;

  data.datasets.forEach(dataset => {
    dataset.data.forEach(value => {
      if (value < minValue) minValue = value;
      if (value > maxValue) maxValue = value;
    });
  });

  // Add some padding to the range
  const range = maxValue - minValue;
  minValue = Math.max(0, minValue - range * 0.1);
  maxValue = maxValue + range * 0.1;

  // If all values are the same, adjust
  if (minValue === maxValue) {
    minValue = 0;
    maxValue = maxValue * 1.1 || 10;
  }

  // Animation
  let animationStart: number | null = null;

  function drawChart(progress: number = 1): void {
    const { ctx } = chartInstance;

    // Clear
    ctx.clearRect(0, 0, width * 2, height * 2);

    // Draw grid
    if (showGrid) {
      drawGrid(ctx, padding, chartWidth, chartHeight, minValue, maxValue);
    }

    // Draw axes
    drawAxes(ctx, padding, chartWidth, chartHeight);

    // Draw datasets
    data.datasets.forEach((dataset, datasetIndex) => {
      const color = dataset.borderColor ?? colors[datasetIndex % colors.length];
      const bgColor = dataset.backgroundColor ?? color;

      const points = data.labels?.map((_, index) => {
        const x = padding.left + (index / Math.max(1, (data.labels?.length || 1) - 1)) * chartWidth;
        const value = (dataset.data[index] || 0) * progress;
        const y = padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
        return { x, y, value: dataset.data[index] || 0 };
      }) || [];

      if (type === 'area' || type === 'line') {
        drawLineChart(ctx, points, color, bgColor, type === 'area', smooth, padding, chartHeight);
      } else if (type === 'bar') {
        drawBarChart(ctx, points, color, bgColor, chartWidth / (data.labels?.length || 1) * 0.6, padding, chartHeight);
      }

      // Draw points
      if (showPoints && (type === 'line' || type === 'area')) {
        drawPoints(ctx, points, color, bgColor);
      }
    });

    // Draw legend
    if (showLegend) {
      drawLegend(ctx, data, colors, width, height, padding);
    }
  }

  function drawGrid(ctx: CanvasRenderingContext2D, chartPadding: typeof padding, chartWidth: number, chartHeight: number, minValue: number, maxValue: number): void {
    ctx.strokeStyle = 'var(--color-border)';
    ctx.lineWidth = 1;
    ctx.font = '11px Inter, system-ui';
    ctx.fillStyle = 'var(--color-text-muted)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const y = chartPadding.top + (i / steps) * chartHeight;
      const value = maxValue - (i / steps) * (maxValue - minValue);

      // Horizontal grid line
      ctx.beginPath();
      ctx.moveTo(chartPadding.left, y);
      ctx.lineTo(chartPadding.left + chartWidth, y);
      ctx.stroke();

      // Y-axis label
      ctx.fillText(formatValue(value), chartPadding.left - 10, y);
    }

    // Vertical grid lines (optional, for reference)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    data.labels?.forEach((label, index) => {
      const x = chartPadding.left + (index / Math.max(1, (data.labels?.length || 1) - 1)) * chartWidth;
      ctx.fillText(label, x, chartPadding.top + chartHeight + 8);
    });
  }

  function drawAxes(ctx: CanvasRenderingContext2D, chartPadding: typeof padding, chartWidth: number, chartHeight: number): void {
    ctx.strokeStyle = 'var(--color-border)';
    ctx.lineWidth = 1;

    // Y axis
    ctx.beginPath();
    ctx.moveTo(chartPadding.left, chartPadding.top);
    ctx.lineTo(chartPadding.left, chartPadding.top + chartHeight);
    ctx.stroke();

    // X axis
    ctx.beginPath();
    ctx.moveTo(chartPadding.left, chartPadding.top + chartHeight);
    ctx.lineTo(chartPadding.left + chartWidth, chartPadding.top + chartHeight);
    ctx.stroke();
  }

  function drawLineChart(
    ctx: CanvasRenderingContext2D,
    points: { x: number; y: number; value: number }[],
    color: string,
    bgColor: string,
    fill: boolean,
    smooth: boolean,
    chartPadding: typeof padding,
    chartHeight: number
  ): void {
    if (points.length < 2) return;

    // We know points has at least 2 elements after the check above
    const firstPoint = points[0]!;
    const lastPoint = points[points.length - 1]!;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (fill) {
      const gradient = ctx.createLinearGradient(0, chartPadding.top, 0, chartPadding.top + chartHeight);
      gradient.addColorStop(0, hexToRgba(bgColor, 0.3));
      gradient.addColorStop(1, hexToRgba(bgColor, 0));
      ctx.fillStyle = gradient;
    }

    ctx.beginPath();

    if (smooth) {
      // Catmull-Rom spline for smooth curves
      ctx.moveTo(firstPoint.x, firstPoint.y);

      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)]!;
        const p1 = points[i]!;
        const p2 = points[i + 1]!;
        const p3 = points[Math.min(points.length - 1, i + 2)]!;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
      }

      if (fill) {
        ctx.lineTo(lastPoint.x, chartPadding.top + chartHeight);
        ctx.lineTo(firstPoint.x, chartPadding.top + chartHeight);
        ctx.closePath();
        ctx.fill();
      }
    } else {
      ctx.moveTo(firstPoint.x, firstPoint.y);
      points.forEach(p => ctx.lineTo(p.x, p.y));

      if (fill) {
        ctx.lineTo(lastPoint.x, chartPadding.top + chartHeight);
        ctx.lineTo(firstPoint.x, chartPadding.top + chartHeight);
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.stroke();
  }

  function drawBarChart(
    ctx: CanvasRenderingContext2D,
    points: { x: number; y: number; value: number }[],
    color: string,
    bgColor: string,
    barWidth: number,
    chartPadding: typeof padding,
    chartHeight: number
  ): void {
    ctx.fillStyle = bgColor;

    points.forEach(point => {
      const x = point.x - barWidth / 2;
      const y = point.y;
      const height = chartPadding.top + chartHeight - point.y;

      // Rounded rectangle
      const radius = 4;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + barWidth - radius, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
      ctx.lineTo(x + barWidth, chartPadding.top + chartHeight);
      ctx.lineTo(x, chartPadding.top + chartHeight);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();
    });
  }

  function drawPoints(
    ctx: CanvasRenderingContext2D,
    points: { x: number; y: number; value: number }[],
    color: string,
    bgColor: string
  ): void {
    points.forEach(point => {
      ctx.fillStyle = 'var(--color-bg)';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawLegend(
    ctx: CanvasRenderingContext2D,
    data: ChartData,
    colors: string[],
    width: number,
    height: number,
    chartPadding: typeof padding
  ): void {
    const legendX = width - 110;
    let legendY = chartPadding.top;

    ctx.font = '12px Inter, system-ui';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    data.datasets.forEach((dataset, index) => {
      const color = dataset.borderColor ?? colors[index % colors.length];

      // Color indicator
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(legendX, legendY + 7, 5, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = 'var(--color-text)';
      ctx.fillText(dataset.label, legendX + 12, legendY + 7);

      legendY += 22;
    });
  }

  function formatValue(value: number): string {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return value.toFixed(value < 10 ? 1 : 0);
  }

  function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Animation loop
  function startAnimation(): void {
    if (!animate) {
      drawChart(1);
      return;
    }

    const startTime = performance.now();
    const duration = 1000; // 1 second

    function frame(currentTime: number): void {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (easeOutCubic)
      const eased = 1 - Math.pow(1 - progress, 3);

      drawChart(eased);

      if (progress < 1) {
        chartInstance.animationId = requestAnimationFrame(frame);
      }
    }

    chartInstance.animationId = requestAnimationFrame(frame);
  }

  // Handle resize
  const resizeObserver = new ResizeObserver(() => {
    const rect = container.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(2, 2);
      drawChart(1);
    }
  });

  resizeObserver.observe(container);

  // Start animation
  startAnimation();

  // Cleanup
  const destroy = () => {
    if (chartInstance.animationId) {
      cancelAnimationFrame(chartInstance.animationId);
    }
    resizeObserver.disconnect();
  };

  // Attach destroy to container
  (container as any)._chartDestroy = destroy;

  return container;
}

// Mini chart for stat cards
export function createMiniChart(data: number[], color: string, width = 100, height = 40): HTMLElement {
  const canvas = createElement('canvas', {
    width: String(width * 2),
    height: String(height * 2),
    style: { width: `${width}px`, height: `${height}px` },
    class: 'mini-chart',
  }) as HTMLCanvasElement;

  const ctx = canvas.getContext('2d')!;
  ctx.scale(2, 2);

  const padding = 4;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue || 1;

  // Gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, hexToRgba(color, 0.3));
  gradient.addColorStop(1, hexToRgba(color, 0));

  // Draw area
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);

  data.forEach((value, index) => {
    const x = padding + (index / Math.max(1, data.length - 1)) * chartWidth;
    const y = height - padding - ((value - minValue) / range) * chartHeight;
    if (index === 0) {
      ctx.lineTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.lineTo(padding + chartWidth, height - padding);
  ctx.closePath();
  ctx.fill();

  // Draw line
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();

  data.forEach((value, index) => {
    const x = padding + (index / Math.max(1, data.length - 1)) * chartWidth;
    const y = height - padding - ((value - minValue) / range) * chartHeight;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return canvas;
}

// Create sample chart data
export function createRevenueChartData(months: string[], revenue: number[]): ChartData {
  return {
    labels: months,
    datasets: [{
      label: 'Revenue',
      data: revenue,
      borderColor: '#4F46E5',
      backgroundColor: '#4F46E5',
      fill: true,
    }],
  };
}

export function createOrdersChartData(months: string[], orders: number[]): ChartData {
  return {
    labels: months,
    datasets: [{
      label: 'Orders',
      data: orders,
      borderColor: '#10B981',
      backgroundColor: '#10B981',
      fill: true,
    }],
  };
}

export function createComparisonChartData(months: string[], thisMonth: number[], lastMonth: number[]): ChartData {
  return {
    labels: months,
    datasets: [
      {
        label: 'This Month',
        data: thisMonth,
        borderColor: '#4F46E5',
        backgroundColor: '#4F46E5',
        fill: false,
      },
      {
        label: 'Last Month',
        data: lastMonth,
        borderColor: '#9CA3AF',
        backgroundColor: '#9CA3AF',
        fill: false,
      },
    ],
  };
}