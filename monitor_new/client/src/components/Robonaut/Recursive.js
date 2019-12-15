import React from "react";
import { Form } from "react-bootstrap"; // Necessary react-bootstrap components

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

export function generateTable(data)
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
            table.push(<tr><td>{object['key']}</td><td>{object['value']}</td></tr>)
          }
        }
        else {
          console.log(object['parent'] + ' has children')
          let parent = <td>{object['parent']}</td>
          let children = object['children'].map(child => {
            if(child.hasOwnProperty('children') === false)
            {
              return <tr><td>{child['key']}</td><td>{child['value']}</td></tr>
            }
            else {
              
            }
          })
          table.push(<tr>{parent}{children}</tr>)
        }
      })
    }
    return <table>{table}</table>
  }
  else
  {
    return null
  }
}