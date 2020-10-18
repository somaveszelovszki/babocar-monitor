import React from "react";
import { Table } from "react-bootstrap";
import InputField from './InputField'

export function getSimpleObjects(obj, level)
{
  let simpleObjects = []
  if(typeof obj === 'object') {
    for (let [key, value] of Object.entries(obj)) {
      if(typeof value === 'object') {
        simpleObjects.push({ parent: key, children: getSimpleObjects(value, level + 1)})
      }
      else {
        simpleObjects.push({key, value})
      }
      if(level === 1) {
        console.log(`${key}: ${value}`);
      }
      else {
        console.log(`${key}: ${value}`);
      }
    }
  }
  return simpleObjects
}

export function generateTable(data, inputChangeHandler, handleEnter, onClickParentHandler)
{ 
  let table = []
  if(typeof data === 'object')
  {
    let simpleObjects = getSimpleObjects(data, 1)
    if(simpleObjects.length > 5)
    {
      simpleObjects.forEach(object => {
        if(object.hasOwnProperty('children') === false) {
          if(typeof object['value'] == 'boolean')
          {
            table.push(<tr><td>{object['key']}</td><td>{object['value'] === true ? 'true' : 'false'}</td></tr>)
          }
          else
          {
            let input = <InputField key = {'input-'+object['key']} name={object['key']} value={object['value']} onInputChange={inputChangeHandler} onClickParentHandler={(e) => onClickParentHandler(e)} handleEnter={(e) => handleEnter(e)}></InputField>
            table.push(input)
          }
        }
        else {
          let parent = <td>{object['parent']}</td>
          let children = object['children'].map(child => {
            if(child.hasOwnProperty('children') === false)
            {
              let input = <InputField key = {'input-'+child['key']} name={child['key']} value={child['value']} onInputChange={inputChangeHandler} onClickParentHandler={(e) => onClickParentHandler(e)} handleEnter={(e) => handleEnter(e)}></InputField>
              return <tr><td>{child['key']}</td><td>{input}</td></tr>
            }
            else {
              return <tr><td>{child['parent']}</td><td>{child['children'].map(child => {
                if(child.hasOwnProperty('children') === false) {
                  let input = <InputField key = {'input-'+child['key']} name={child['key']} value={child['value']} onInputChange={inputChangeHandler} onClickParentHandler={(e) => onClickParentHandler(e)} handleEnter={(e) => handleEnter(e)}></InputField>
                  return input
                }
                else {
                  return <tr><td>{child['parent']}</td><td>{child['children'].map(child => {
                    if(child.hasOwnProperty('children') === false) {
                      let input = <InputField key = {'input-'+child['key']} name={child['key']} value={child['value']} onInputChange={inputChangeHandler} onClickParentHandler={(e) => onClickParentHandler(e)} handleEnter={(e) => handleEnter(e)}></InputField>
                      return input
                    }
                    else {
                      return child['children'].map(child => {
                        return null
                      })
                    } 
                  })}</td></tr>
                } 
              })}</td></tr>
            }
          })
          table.push(<tr>{parent}{children}</tr>)
        }
      })
    }
    return <Table striped bordered hover>{table}</Table>
  }
  else
  {
    return null
  }
}