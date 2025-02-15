import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const SecurityPieChart = forwardRef(({ data, title }, ref) => {
  const chartRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getChartImage: () => {
      const chartInstance = chartRef.current;
      if (chartInstance) {
        return chartInstance.canvas.toDataURL('image/png');
      }
      return null;
    }
  }));

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: [
          '#7a0000', 
          '#d32f2f', 
          '#ed6c02', 
          '#2e7d32',
        ],
        borderColor: [
          '#ffffff',
          '#ffffff',
          '#ffffff',
          '#ffffff',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          generateLabels: (chart) => {
            const data = chart.data;
            const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
            
            return data.labels.map((label, index) => ({
              text: `${label} - ${data.datasets[0].data[index]} (${((data.datasets[0].data[index] / total) * 100).toFixed(1)}%)`,
              fillStyle: data.datasets[0].backgroundColor[index],
              strokeStyle: data.datasets[0].borderColor[index],
              lineWidth: data.datasets[0].borderWidth,
              hidden: false,
            }));
          },
        },
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
        },
      },
    },
    maintainAspectRatio: true,
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto' }}>
      <Pie ref={chartRef} data={chartData} options={options} />
    </div>
  );
});

export default SecurityPieChart; 