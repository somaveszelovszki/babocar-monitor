import React from "react";
import { Table } from "react-bootstrap";
import InputField from './InputField'

export function getSimpleObjects(obj, level)
{
  let simpleObjects = []
  //console.log('getSimpleObjects level: ' + level)
  if(typeof obj === 'object')
  {
    for (let [key, value] of Object.entries(obj)) {
      if(typeof value === 'object')
      {
        //console.log(key + ' has children on level ' + level)
        simpleObjects.push({ parent: key, children: getSimpleObjects(value, level + 1)})
      }
      else {
        simpleObjects.push({key, value})
      }
      if(level === 1)
      {
        //console.log(`${key}: ${value}`);
      }
      else {
        //console.log(`${key}: ${value}`);
      }
    }
  }
  simpleObjects.forEach(object => {
    //console.log('simple object: ', object)
  })
  //console.log('end of getSimpleObjects')
  return simpleObjects
}

function getChildren(object)
{
  console.log('getChildren', object)
  let childrenArray = []
  if(object.hasOwnProperty('children'))
  {
    console.log('children:', object['children']);
  }
  else {
    
  }
}

export function generateTable(data, inputChangeHandler)
{
  let table = []
  let children = []
  if(typeof data === 'object')
  {
    let simpleObjects = getSimpleObjects(data, 1)
    if(simpleObjects.length > 5)
    {
      console.log('generateTable --> getSimpleObjects: ', simpleObjects)
      simpleObjects.forEach(object => {
        //console.log('for each object', object)
        if(object.hasOwnProperty('children') === false) {
          console.log(object['key'] + ' has no children, value type: '  + typeof object['value'])
          if(typeof object['value'] == 'boolean')
          {
            table.push(<tr><td>{object['key']}</td><td>{object['value'] === true ? 'true' : 'false'}</td></tr>)
          }
          else
          {
            let input = <InputField key = {'input-'+object['key']} name={object['key']} value={object['value']} onInputChange={inputChangeHandler} onClickParentHandler={(e) => this.handleClick(e)} handleEnter={(e) => this.handleEnter(e)}></InputField>
            //table.push(<tr><td>{object['key']}</td><td>{object['value']}</td></tr>)
            table.push(input)
          }
        }
        else {
          console.log(object['parent'] + ' has children')
          let parent = <td>{object['parent']}</td>
          let children = object['children'].map(child => {
            if(child.hasOwnProperty('children') === false)
            {
              let input = <InputField key = {'input-'+child['key']} name={child['key']} value={child['value']} onInputChange={inputChangeHandler} onClickParentHandler={(e) => this.handleClick(e)} handleEnter={(e) => this.handleEnter(e)}></InputField>
              return <tr><td>{child['key']}</td><td>{input}</td></tr>
              //return <tr><td>{child['key']}</td><td>{child['value']}</td></tr>
            }
            else {
              //getChildren(child)
              console.log('children', child['children']);
              return <tr><td>{child['parent']}</td><td>{child['children'].map(child => {
                console.log('child', child);
                if(child.hasOwnProperty('children') === false)
                {
                  console.log('child has no more children');
                  let input = <InputField key = {'input-'+child['key']} name={child['key']} value={child['value']} onInputChange={inputChangeHandler} onClickParentHandler={(e) => this.handleClick(e)} handleEnter={(e) => this.handleEnter(e)}></InputField>
                  return input
                  //return <tr><td>{child['key']}</td><td>{child['value']}</td></tr>
                }
                else {
                  //getChildren(child)
                  console.log('children', child['children']);
                  return <tr><td>{child['parent']}</td><td>{child['children'].map(child => {
                    console.log('child', child);
                    if(child.hasOwnProperty('children') === false)
                    {
                      console.log('child has no more children', child);
                      let input = <InputField key = {'input-'+child['key']} name={child['key']} value={child['value']} onInputChange={inputChangeHandler} onClickParentHandler={(e) => this.handleClick(e)} handleEnter={(e) => this.handleEnter(e)}></InputField>
                      return input
                    }
                    else {
                      //getChildren(child)
                      console.log('children', child['children']);
                      child['children'].map(child => {
                        console.log('child', child);
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