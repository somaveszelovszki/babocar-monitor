import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const colors = [
    '#f51d1d',
    '#f5821d',
    '#f5e71d',
    '#73f51d',
    '#1df573',
    '#1df5d5',
    '#1d9ff5',
    '#1d3df5',
    '#851df5',
    '#e31df5',
    '#f51d9b',
    '#f51d53',
]

export default class ParameterLineChart extends React.Component {
    
    render() {

        //console.log('ParameterLineChart', this.props.data);

        const fieldNames = this.props.data.length > 0 && Object.keys(this.props.data[0])

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
                    {fieldNames && fieldNames.map((fieldName, index) => {
                        const color = index < colors.length ? colors[index] : colors[0]
                        return <Line type="monotone" dataKey={fieldName} stroke={color} activeDot={{ r: 8 }} isAnimationActive={false} />
                    })}
                </LineChart>
            </ResponsiveContainer>
        )
    }
}
