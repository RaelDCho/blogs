import { Link } from 'react-router-dom'

import Blog from './Blog'

const BlogList = ({ blogs, user, handleLike, deleteBlog }) => {

  return (
    <>
      {blogs.map(blog => (
        <li key={blog.id}>
          <Blog key={blog.id} blog={blog} user={user} handleLike={handleLike} deleteBlog={deleteBlog}/>
          {/* <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> */}
        </li>
      ))}
    </>
  )
}

export default BlogList