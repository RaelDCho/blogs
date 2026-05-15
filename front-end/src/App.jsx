import { useState, useEffect, useRef } from 'react'

// services
import blogService from './services/blogs'
import loginService from './services/login'

// navigation
import { BrowserRouter as Router, useMatch, Routes, Route, Link } from 'react-router-dom'

// components
// import Header from './components/Header'
import Blog from './components/Blog'
import BlogView from './components/BlogView'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'

// util components
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Footer from './components/util/Footer'

// css
import { AppBar, Button, Toolbar } from '@mui/material'

// css
import './assets/BlogApp.css'

const App = () => {
  const [blogs, setBlogs] = useState([])

  // user inputs
  const [user, setUser] = useState(null)

  // notifications and error messages
  const [notification, setNotification] = useState(null)

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

  // useMatch to get id of blog to then pass to Blog component
  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find(blog => blog.id === match.params.id) : null

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
      console.log('error occurred in login')
      setNotification({ text: 'error: invalid credentials', type: 'error' })
      setTimeout(() => setNotification(null), 3000)
    }
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
    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))

      // set notification messages
      setNotification({ text: `added blog ${returnedBlog.title}`, type:'success' })
    }).catch(error => {
      setNotification({ text: error, type: 'error' })
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
      setNotification({ text: error, type: 'error' })
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
      setNotification({ text: `${removeBlog.title} has been removed.`, type: 'success' })
    }).catch(error => {
      setNotification({ text: error, type: 'error' })
    })

    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const blogFormRef = useRef()

  const padding = {
    padding: 5
  }

  const style = { 
    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
    padding: 5
  }

  return (
    <div className='site'>
      {/* LINKS HEADER */}
      <AppBar position='static'>
        <Toolbar>
          <Button color='inherit' component={Link} to='/' style={style}>home</Button>
          
          {user && <Button color='inherit' component={Link} to='/create' style={padding}>new blog</Button>}
          {!user
            ? <Button color='inherit' component={Link} to='/login' style={padding}>login</Button>
            : <Button color='inherit' onClick={handleLogout}>logout</Button>}
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

      {/* ROUTES */}
      <Routes>
        <Route path='/' element={
          <BlogList blogs={blogs} user={user} handleLike={handleLike} deleteBlog={deleteBlog} />
        } />
        {user && <Route path='/create' element={
          <BlogForm createBlog={addBlog} username={user ? user.username : ''} />
        } />}
        <Route path='/login' element={
          <LoginForm handleLogin={handleLogin} />
        } />
        <Route path='/blogs/:id' element={
          <BlogView blog={blog} user={user} handleLike={handleLike} deleteBlog={deleteBlog} />
        } />
      </Routes>
      <Footer />
    </div>
  )
}

export default App