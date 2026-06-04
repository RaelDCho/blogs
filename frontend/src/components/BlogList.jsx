import { Link } from 'react-router-dom'

import Blog from './Blog'

const BlogList = ({ blogs, user, handleLike, deleteBlog }) => {

  const listStyle = {
    listStyleType: 'none'
  }

  return (
    <>
      {/* HEADING */}
      <h3>Welcome, {user ? user.name : 'Guest'}!</h3>
      
      {/* List of blogs */}
      <ul style={listStyle}>
        {blogs.map(blog => (
          <li key={blog.id}>
            <Blog key={blog.id} blog={blog} user={user} handleLike={handleLike} deleteBlog={deleteBlog}/>
            {/* <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> */}
          </li>
        ))}
      </ul>
    </>
  )
}

export default BlogList