import { useState, useImperativeHandle } from 'react'

import { Link } from 'react-router-dom'

import { Box, Button } from '@mui/material'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      {props.buttonLabel && <div style={hideWhenVisible}>
        <Button variant='outlined' onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </div>}
      <Box style={showWhenVisible}>
        {props.children}
        <Box style={{ display: 'flex' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Button variant='outlined' style={{ margin: 5 }} onClick={toggleVisibility}>Cancel</Button>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Button variant='contained' component={Link} style={{ margin: 5 }} to={`/blogs/${props.blogId}`}>More</Button>
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default Togglable