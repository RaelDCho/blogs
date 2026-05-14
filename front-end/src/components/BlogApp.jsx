import { useState, useEffect, useRef } from 'react'

// components
import Header from './Header'
import Blog from './Blog'
import LoginForm from './LoginForm'
import BlogList from './BlogList'
import BlogForm from './BlogForm'
import Notification from './Notification'
import Togglable from './Togglable'

// services
import blogService from '../services/blogs'
import loginService from '../services/login'

const BlogApp = () => {
  const [blogs, setBlogs] = useState([])

  // user inputs
  const [user, setUser] = useState(null)
  // const [username, setUsername] = useState('')
  // const [password, setPassword] = useState('')

  // blog inputs
  // const [title, setTitle] = useState('')
  // const [author, setAuthor] = useState('')
  // const [url, setUrl] = useState('')

  // notifications and error messages
  const [notification, setNotification] = useState(null)
  const [messageType, setMessageType] = useState(false) // false if error, true if success

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
      blogs.sort((a, b) => b.likes - a.likes)
    })
  }, [blogs.length])
  // have to implement a way for blog to re-render after likes are updated

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // input onchange to parse to BlogForm child component
  // unused now that we are using useRef and useImperativeHandle
  // const parseOnChange = {
  //   handleTitle: event => {
  //     setTitle(event.target.value)
  //   },

  //   handleAuthor: () => {
  //     setAuthor(event.target.value)
  //   },

  //   handleUrl: () => {
  //     setUrl(event.target.value)
  //   }
  // }

  // Login and Logout functions
  const handleLogin = async userObject => {
    event.preventDefault()

    try {
      const user = await loginService.login(userObject)

      // save user token to local storage - is this better or using httpOnly cookies?
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      console.log(`hello ${user.name}`)
      setUser(user)
      // setUsername('')
      // setPassword('')
    } catch {
      setMessageType(false)
      console.log('error occurred in login')
      setNotification('error: invalid credentials')
      setTimeout(() => setNotification(null), 3000)
    }

    // console.log(messageType)
  }

  const handleLogout = async () => {
    try {
      await window.localStorage.removeItem('loggedBlogUser')
      setUser(null)
      console.log('logged out successfully')
    } catch {
      console.log('error logging out')
    }
  }

  // add function
  const addBlog = blogObject => {
    // event.preventDefault()

    // const blogObject = {
    //   title: title,
    //   author: author,
    //   url: url,
    //   user: user.username
    // }

    blogFormRef.current.toggleVisibility()

    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))

      // // clean up input fields
      // setTitle('')
      // setAuthor('')
      // setUrl('')

      // set notification messages
      setNotification(`added blog ${returnedBlog.title}`)
      setMessageType(true)
    }).catch(error => {
      setNotification(error)
      setMessageType(false)
    })

    setTimeout(() => { setNotification(null) }, 3000)
  }

  // move to bloglist
  const handleLike = id => {
    // console.log(id)
    const blog = blogs.find(blog => blog.id === id)
    const likedBlog = {
      ...blog,
      likes: blog.likes + 1
    }

    blogService.update(id, likedBlog).then(returnedBlog => {
      setBlogs(blogs.map(blog => blog.id === id ? likedBlog : blog))
    }).catch(error => {
      setNotification(error)
      setMessageType(false)
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    })
  }

  const deleteBlog = id => {
    console.log(id)
    const removeBlog = blogs.find(blog => blog.id === id)

    blogService.remove(id).then(response => {
      console.log(`removed ${id}`)
      setBlogs(blogs.filter(blog => blog.id !== id))
      setNotification(`${removeBlog.title} has been removed.`)
      setMessageType(true)
    }).catch(error => {
      setNotification(`${error}`)
      setMessageType(false)
    })

    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const blogFormRef = useRef()

  // if (!user) {
  //   return (
  //     <div className='login-page'>
  //       <LoginForm
  //         handleLogin={handleLogin}
  //         notification={notification}
  //         messageType={messageType}
  //       />
  //     </div>
  //   )
  // }
  // when user is logged out, header should show a button for logging in, and no name
  // when button for logging in is pressed, there should be a togglable for a form
  // when user is logged in, header should show a welcome message and button for logging out
  return (
    <div className='blog'>
      <h3>Blogs</h3>
      {user ? <Header onClick={handleLogout} user={user} name={user.name}/> : <p>login</p>}
      {!user &&
        <Togglable buttonLabel='login'>
          <LoginForm
            handleLogin={handleLogin}
            // notification={notification}
            messageType={messageType}
          />
        </Togglable>
      }
      {user &&
        <Togglable buttonLabel='create a new blog' ref={blogFormRef}>
          <BlogForm createBlog={addBlog} username={user.username} />
        </Togglable>
      }
      <div>
        <Notification notification={notification} messageType={messageType} />
        <BlogList blogs={blogs} user={user} handleLike={handleLike} deleteBlog={deleteBlog} />
      </div>
    </div>
  )
}

export default BlogApp