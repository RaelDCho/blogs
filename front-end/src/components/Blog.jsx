import { Link } from 'react-router-dom'

import Togglable from './Togglable'

import { Button } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'

const Blog = ({ blog, user, handleLike, deleteBlog }) => {
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

  return (
    <div style={blogStyle} className='blog'>
      <div style={blogLine}>
        {blog.title} by {blog.author}
      </div>
      <Togglable buttonLabel='view'>
        <div style={blogLine}>
          {blog.user && blog.user.name}
        </div>
        <div style={blogLine}>
          <Link to={`/blogs/${blog.id}`}>{blog.url}</Link>
        </div>
        <div style={blogLine}>
          likes: {blog.likes} <button onClick={() => likeBlog(blog.id)}>👍🏻</button>
        </div>
        <div>
          {user && (user.username === blog.user.username) 
            ? <Button variant='outlined' color='error' startIcon={<DeleteIcon />} onClick={() => removeBlog(blog.id)}>delete</Button> : ''}
        </div>
      </Togglable>
    </div>
  )
}

export default Blog