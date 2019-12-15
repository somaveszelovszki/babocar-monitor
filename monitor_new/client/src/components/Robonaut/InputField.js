import React from "react";
import { Form } from "react-bootstrap"; // Necessary react-bootstrap components
/* Page specific CSS file */
import './Robonaut.css';

export default class InputField extends React.Component {
    constructor(props) {
      super(props);
      this.state = { value: this.props.value };
      this.handleChange = this.handleChange.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handleKeyPress = this.handleKeyPress.bind(this);
      this.handleClickBoolean = this.handleClickBoolean.bind(this);
      this.handleChangeBoolean = this.handleChangeBoolean.bind(this);
    }
  
    componentWillReceiveProps(props) {
          this.setState({ value: props.value })
    }
    
    handleKeyPress(event) {
      //console.log("handleKeyPress", event.key)
      if(event.key === 'Enter')
      {
        //console.log("Enter key pressed. Submit form to serial port.")
        this.props.handleEnter(event)
      }
    }
  
      // Input change handler function
      handleChange(event) {
          this.setState({ value: event.target.value }) // Update input field state with new value
          //console.log('Input', event.target.name, 'changed to', event.target.value)
          this.props.onInputChange({ key: event.target.name, value: event.target.value }) // Pass value to parent component
    }
    
        // Input change handler function
      handleChangeBoolean(event) {
      const key = event.target.id
      //console.log('Change child boolean element: ' + key + ' to ' + event.target.checked)
          this.props.onInputChange({ key: key, value: event.target.checked }) // Pass value to parent component
    }
    
    handleClick(event) {
      //console.log('Clicked on child element: ' + event.target.name + ' ' +event.target.value );
      this.props.onClickParentHandler({ key: event.target.name, value: event.target.value }) // Pass value to parent component
    }
  
    handleClickBoolean(event) {
      //console.log('Clicked on boolean child element: ', event.target.id.split('checkbox-')[1]);
      this.setState({value: !this.state.value}, () => {console.log(this.state.value)})
    }
  
    render() {
      const name = this.props.name
      var input = null
      if (typeof(this.props.value) !== 'number' && typeof(this.props.value) !== 'string' && (this.props.value === true || this.props.value === false)) {
       input = (<tr><td colSpan="2"><Form.Check
       custom
       checked={this.props.value}
         type="checkbox"
         id={'checkbox-' + name}
         label={name}
         onChange={this.handleChangeBoolean}
         /></td></tr>)
      }
      else {
        input = <tr><td>{name}</td><td><input type="text" name={name} value={this.state.value} onChange={this.handleChange} onClick={this.handleClick} onKeyPress={this.handleKeyPress}></input></td></tr>
      }
      return input
    }
  }
  