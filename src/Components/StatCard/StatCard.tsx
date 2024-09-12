
import React from 'react'
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts'
import { GoArrowUpRight } from 'react-icons/go'
import { StatCardProps } from '../../Type/ComponentBasedType'

const StatCard: React.FC<StatCardProps> = ({ items }) => {
  const color1 = 'black'
  const color2 = 'rgba(255, 255, 255, 0)'

  return (
    <div className="">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-bold text-[#A6A6A6] text-[1.20rem]">{items[0].title}</div>
        <div className="text-gray-600 text-lg flex gap-3">
          <h1 className="text-[2rem] font-bold text-[#A6A6A6]">{items[0].percentage}%</h1>

          <GoArrowUpRight style={{ color: '#A6A6A6', fontSize: '2rem' }} />
        </div>
      </div>
      <div className="flex justify-between mt-12">
        <div className=" font-extrabold text-[3rem] " style={{ color: '#00000' }}>
          {items[0].count}
        </div>
        <div style={{ width: '50%', height: 100 }}>
          <ResponsiveContainer>
            <AreaChart data={items} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id={'abc'} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color1} stopOpacity={0.4}></stop>
                  <stop offset="75%" stopColor={color2} stopOpacity={0.05}></stop>
                </linearGradient>
              </defs>
              <Tooltip />
              <Area
                type="monotone"
                dataKey="count"
                stroke={color1}
                activeDot={{ r: 8 }}
                fill="url(#abc)"
                min={400000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default StatCard
