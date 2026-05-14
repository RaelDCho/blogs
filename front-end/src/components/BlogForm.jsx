import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BlogForm = (props) => {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async event => {
    // stop form from submitting and thus refreshing page
    event.preventDefault()

    props.createBlog({
      title: title,
      author: author,
      url: url,
      user: props.username,
    })

    // back to main page
    // navigate('/')

    // // clean up input fields
    // setTitle('')
    // setAuthor('')
    // setUrl('')
    cleanUp()
  }

  const cleanUp = () => {
    navigate('/')
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title:
            <input value={title} onChange={event => setTitle(event.target.value)} />
          </label>
        </div>
        <div>
          <label>
            author:
            <input value={author} onChange={event => setAuthor(event.target.value)}/>
          </label>
        </div>
        <div>
          <label>
            url:
            <input value={url} onChange={event => setUrl(event.target.value)} />
          </label>
        </div>
        <button type='submit'>create</button>
      </form>
      <button onClick={cleanUp}>cancel</button>
    </>
  )
}

export default BlogForm