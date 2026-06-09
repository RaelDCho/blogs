import { Link } from 'react-router-dom'

import Togglable from './Togglable'

import { Button } from '@mui/material'
import { Delete as DeleteIcon, ThumbUpOffAlt as ThumbsUp } from '@mui/icons-material'

const Blog = ({ blog, user, handleLike, deleteBlog }) => {
  // functionalities
  const likeBlog = id => {
    if (user) {
      handleLike(blog.id)
    } else {
      console.log('user is not logged in')
    }
  }

  const removeBlog = id => {
    if (window.confirm(`Remove blog: ${blog.title} by ${blog.author}?`)) {
      deleteBlog(id)
    }
  }

  // css
  const blogStyle = {
    padding: 10,
    border: '2px solid gray',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
    fontFamily: 'monospace',
    fontSize: 20,
  }

  const blogLine = {
    padding: 10
  }

  return (
    <div style={blogStyle} className='blog'>
      <div style={blogLine}>
        {blog.title} by {blog.author}
      </div>
      <Togglable buttonLabel='view' blogId={blog.id}>
        <div style={blogLine}>
          {blog.user && blog.user.name}
        </div>
        <div style={blogLine}>
          likes: {blog.likes}
        </div>
        {user && <div style={blogLine}>
          <Button variant='outlined' style={{ margin: 5 }} onClick={() => likeBlog(blog.id)}><ThumbsUp /></Button>
          {(user.username === blog.user.username)
            ? <Button variant='outlined' color='error' style={{ margin: 5 }} onClick={() => removeBlog(blog.id)}><DeleteIcon /></Button> : ''}
        </div>}
      </Togglable>
    </div>
  )
}

export default Blog