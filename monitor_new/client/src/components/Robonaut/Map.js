import React from "react";

const lineColor = 'black';
const lineWidth = '2';
const circleWidth = '1';
const circleColor = 'black';
const circleColorActive = 'red';

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            coordinates: this.props.coordinates
        }
      }
    componentDidMount() {
        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")
        // Line
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        const coordinates = this.state.coordinates
        // Circle
        /*
        ctx.strokeStyle = circleColorActive;
        ctx.lineWidth = circleWidth;
        ctx.fillStyle = circleColorActive;
        ctx.beginPath();
        ctx.arc(95, 50, 40, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        // Other lines?
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(200, 100);
        ctx.lineTo(250, 150);
        ctx.stroke();
        ctx.moveTo(250, 150);
        ctx.lineTo(300, 200);
        ctx.stroke();
        ctx.moveTo(300, 200);
        ctx.lineTo(400, 500);
        ctx.stroke();
        */
        //console.log('Map componentDidMount coordinates:', this.props.coordinates);
        
    }
    componentWillReceiveProps()
    {
        //console.log('Map componentWillReceiveProps coordinates:', this.props.coordinates);
        this.setState({ coordinates: this.props.coordinates})
    }
    componentDidUpdate()
    {
        console.log('Map componentDidUpdate coordinates:', this.props.coordinates);
        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")
        // Line
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        const coordinates = this.state.coordinates
        for(var i = 0; i < coordinates.length - 1; i++)
        {
	    console.log('componentDidUpdate', Math.floor(coordinates[i].x), Math.floor(coordinates[i].y));
            ctx.moveTo(Math.floor(coordinates[i].x), Math.floor(coordinates[i].y));
            ctx.lineTo(Math.floor(coordinates[i+1].x), Math.floor(coordinates[i+1].y));
            ctx.stroke();
        }
    }
    render() {
        return(
          <div>
            <canvas ref="canvas" width={640} height={425} />
          </div>
        )
      }
    }
export default Map