import React from "react";

const lineColor = 'black';
const lineWidth = '2';
const canvasSize = 640
const canvasWidth = canvasSize 
const canvasHeight = canvasSize 
const mapSizeCm = 50*100 // 50 m in cms

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            coordinates: this.props.coordinates
        }
	      this.realityToMap = this.realityToMap.bind(this)
      }

    componentDidMount() {
        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
    }

    componentWillReceiveProps() {
        this.setState({ coordinates: this.props.coordinates})
    }

    realityToMap(coordinateCm, axis) {
  		return (axis === 'y' ? -coordinateCm : coordinateCm) * canvasSize / mapSizeCm + canvasSize/2
    }
    
    componentDidUpdate(prevProps)
    {
        if(prevProps.coordinates.length != this.props.coordinates && this.props.coordinates.length >= 2)
        {
          const canvas = this.refs.canvas
          const ctx = canvas.getContext("2d")
          // Line
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = lineWidth;
          const coordinates = this.props.coordinates
          ctx.moveTo(this.realityToMap(coordinates[this.props.coordinates.length-2].x, 'x'), this.realityToMap(coordinates[this.props.coordinates.length-2].y, 'y'));
          ctx.lineTo(this.realityToMap(coordinates[this.props.coordinates.length-1].x, 'x'), this.realityToMap(coordinates[this.props.coordinates.length-1].y, 'y'));
          ctx.stroke();
          if(coordinates[this.props.coordinates.length-1].hasOwnProperty('junction'))
          {
            ctx.font = "10px Arial";
            ctx.fillText(Math.round(coordinates[this.props.coordinates.length-1]['junction']), this.realityToMap(coordinates[this.props.coordinates.length-1].x+5, 'x'), this.realityToMap(coordinates[this.props.coordinates.length-1].y, 'y'));
          }
        }
    }
    render() {
        return (
          <div>
            <canvas ref="canvas" width={canvasWidth} height={canvasHeight} />
          </div>
        )
      }
    }

export default Map