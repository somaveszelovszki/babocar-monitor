import React from "react";
import { Form } from "react-bootstrap"; // Necessary react-bootstrap components

export default class InputField extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        value: this.props.value,
        checked: this.props.checked
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handleKeyPress = this.handleKeyPress.bind(this);
      this.handleClickBoolean = this.handleClickBoolean.bind(this);
      this.handleChangeBoolean = this.handleChangeBoolean.bind(this);
      this.handleGraphCheckboxChange = this.handleGraphCheckboxChange.bind(this);
    }
   componentDidUpdate(prevProps)
   {
      if(prevProps.value !== this.props.value)
      {
          this.setState({        
            value: this.props.value
          });
      }
  }

    handleKeyPress(event) {
      if(event.key === 'Enter')
      {
        console.log("Enter key pressed. Submit form to serial port.")
        this.props.handleEnter(event)
      }
    }
  
    // Input change handler function
    handleChange(event) {
        this.setState({ value: event.target.value }) // Update input field state with new value
        this.props.onInputChange({ key: event.target.name, value: event.target.value }) // Pass value to parent component
    }
    
    // Input change handler function
    handleChangeBoolean(event) {
    const key = event.target.id
        this.props.onInputChange({ key: key, value: event.target.checked }) // Pass value to parent component
    }
    
    handleClick(event) {
      this.props.onClickParentHandler({ key: event.target.name, value: event.target.value }) // Pass value to parent component
    }
  
    handleClickBoolean(event) {
      this.setState({value: !this.state.value}, () => {console.log(this.state.value)})
    }

    handleGraphCheckboxChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.props.onGraphCheckboxChange(name, value)
    }
  
    render() {
      const name = this.props.name
      var input
      if (typeof(this.props.value) !== 'number' && typeof(this.props.value) !== 'string' && (this.props.value === true || this.props.value === false)) {
      // Render checkbox field
      input = (
       <tr>
         <td colSpan="3">
           <Form.Check
              custom
              checked={this.props.value}
              type="checkbox"
              id={'checkbox-' + name}
              label={name}
              onChange={this.handleChangeBoolean}
            />
         </td>
        </tr>
         )
      }
      // Render text field
      else {
        input = (
        <tr>
          <td>
            <input
                type="checkbox"
                name={name}
                checked={this.props.checked}
                onChange={this.handleGraphCheckboxChange}
            />
          </td>
          <td>{name}</td>
          <td>
            <input
              type="text"
              name={name}
              value={this.state.value}
              onChange={this.handleChange}
              onClick={this.handleClick}
              onKeyPress={this.handleKeyPress}
            />
          </td>
        </tr>
        )
      }
      return input
    }
  }
  