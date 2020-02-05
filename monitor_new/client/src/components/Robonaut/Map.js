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
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        const coordinates = this.state.coordinates
        //console.log('Map componentDidMount coordinates:', this.props.coordinates);
    }
    componentWillReceiveProps()
    {
        //console.log('Map componentWillReceiveProps coordinates:', this.props.coordinates);
        this.setState({ coordinates: this.props.coordinates})
    }
    componentDidUpdate(prevProps)
    {
        //console.log('Map componentDidUpdate coordinates:', this.props.coordinates);
        if(prevProps.coordinates.length != this.props.coordinates && this.props.coordinates.length >= 2)
        {
          console.log('componentDidUpdate new coordinate from', this.props.coordinates[this.props.coordinates.length-2], ' to ', this.props.coordinates[this.props.coordinates.length-1]);
          const canvas = this.refs.canvas
          const ctx = canvas.getContext("2d")
          // Line
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = lineWidth;
          const coordinates = this.props.coordinates
          ctx.moveTo(coordinates[this.props.coordinates.length-2].x + 50, coordinates[this.props.coordinates.length-2].y + 50);
          ctx.lineTo(coordinates[this.props.coordinates.length-1].x + 50, coordinates[this.props.coordinates.length-1].y + 50);
          ctx.stroke();
          /*
          for(var i = 0; i < coordinates.length - 1; i++)
          {
              ctx.moveTo(coordinates[i].x + 50, coordinates[i].y + 50);
              ctx.lineTo(coordinates[i+1].x + 50, coordinates[i+1].y + 50);
              ctx.stroke();
          }
          */
        }
    }
    render() {
        return(
          <div>
            <canvas ref="canvas" width={640} height={1200} />
          </div>
        )
      }
    }
export default Map