import { useRef, useEffect, useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';
import PropTypes from 'prop-types';
import { formatPrice, formatDate } from '../utils/format';

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs">
        <p className="font-medium">{formatDate(label, { month: 'short', day: 'numeric' })}</p>
        <p className="text-primary font-semibold">
          {formatPrice(payload[0].value, currency)}
        </p>
      </div>
    );
  }
  
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
  currency: PropTypes.string,
};

const PriceSparkline = ({ 
  data, 
  currency = 'INR', 
  width = '100%', 
  height = 120,
  showCurrentPrice = true,
  showLowestPrice = true,
  animate = true
}) => {
  const [chartData, setChartData] = useState([]);
  const [lowestPrice, setLowestPrice] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  
  // Process data when it changes
  useEffect(() => {
    if (!data || data.length === 0) return;
    
    // Format data for Recharts
    const formattedData = data.map(item => ({
      date: item.date,
      price: item.price
    }));
    
    setChartData(formattedData);
    
    // Find lowest price
    const lowest = Math.min(...formattedData.map(item => item.price));
    setLowestPrice(lowest);
    
    // Get current (latest) price
    const latest = formattedData[formattedData.length - 1].price;
    setCurrentPrice(latest);
  }, [data]);
  
  // If no data, show empty state
  if (!data || data.length === 0 || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 bg-gray-50 rounded border border-gray-200 text-neutral-mid text-sm">
        No price history available
      </div>
    );
  }
  
  return (
    <div className="price-sparkline">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-neutral-mid">Price Trend (90 days)</div>
        <div className="text-sm font-medium text-neutral-dark">
          Current: {formatPrice(currentPrice, currency)}
        </div>
      </div>
      
      <div style={{ width, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => formatDate(date, { month: 'short' })}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              domain={['dataMin - 50', 'dataMax + 50']} 
              hide 
            />
            <Tooltip 
              content={<CustomTooltip currency={currency} />} 
              cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
            />
            
            {/* Lowest price reference line */}
            {showLowestPrice && lowestPrice && (
              <>
                <ReferenceLine 
                  y={lowestPrice} 
                  stroke="#43A047" 
                  strokeDasharray="3 3" 
                  strokeWidth={1}
                />
                <text
                  x={10}
                  y={chartData.findIndex(d => d.price === lowestPrice) > -1 
                    ? chartData.findIndex(d => d.price === lowestPrice) * 10 + 10 
                    : 10}
                  fill="#43A047"
                  fontSize={10}
                  textAnchor="start"
                >
                  Lowest: {formatPrice(lowestPrice, currency)}
                </text>
              </>
            )}
            
            {/* Current price reference line */}
            {showCurrentPrice && currentPrice && (
              <ReferenceLine 
                y={currentPrice} 
                stroke="#1E88E5" 
                strokeDasharray="3 3" 
                strokeWidth={1}
              />
            )}
            
            <Line
              type="monotone"
              dataKey="price"
              stroke="#1E88E5"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#1E88E5', stroke: '#fff', strokeWidth: 2 }}
              isAnimationActive={animate}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex justify-between text-xs text-neutral-mid mt-1">
        <span>{formatDate(chartData[0].date, { month: 'short', day: 'numeric' })}</span>
        <span>{formatDate(chartData[chartData.length - 1].date, { month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  );
};

PriceSparkline.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  currency: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showCurrentPrice: PropTypes.bool,
  showLowestPrice: PropTypes.bool,
  animate: PropTypes.bool,
};

export default PriceSparkline;