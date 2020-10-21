import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default class ParameterLineChart extends React.Component {
    
    render() {

        return (
            <ResponsiveContainer>
                <LineChart
                    width={500}
                    height={300}
                    data={this.props.data}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="speed" stroke="#fc6f03" activeDot={{ r: 8 }} isAnimationActive={false} />
                    <Line type="monotone" dataKey="angle" stroke="#03fcbe" isAnimationActive={false} />
                    <Line type="monotone" dataKey="sin" stroke="#037bfc" isAnimationActive={false} />
                </LineChart>
            </ResponsiveContainer>
        )
    }
}
