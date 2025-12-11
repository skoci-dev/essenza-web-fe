// Conditional rendering component with ShowElse fallback
// Usage:
// <ShowIf when={condition}>
//   <Content />
//   <ShowElse>Fallback</ShowElse>
// </ShowIf>

import React from 'react'

const ShowElse = ({ children }) => children

const ShowIf = ({ when, children }) => {
  let main = []
  let elseChild = null

  // Separate ShowElse from other children
  React.Children.forEach(children, child => {
    if (child?.type === ShowElse) {
      elseChild = child
    } else {
      main.push(child)
    }
  })

  return when ? main : elseChild
}

ShowIf.ShowElse = ShowElse
export { ShowIf, ShowElse }
