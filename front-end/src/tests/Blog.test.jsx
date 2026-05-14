import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog'
import Togglable from '../components/Togglable'

describe('<Blog />', async () => {
  let blog
  let userLike

  beforeEach(() => {
    blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'component-tester',
      url: 'www.component-testing.com',
      user: {
        username: 'quandingle',
        name: 'quandingle'
      },
      likes: 100
    }

    userLike = vi.fn()

    render(
      <Blog blog={blog} handleLike={userLike} />
    )
  })

  test('renders title and author', async () => {
    const titleAndAuthor = screen.getByText(
      'Component testing is done with react-testing-library', { exact: false }
    )

    const likes = screen.getByText(
      blog.url, { exact: false }
    )
    expect(likes).not.toBeVisible()

    const url = screen.getByText(blog.url)
    expect(url).not.toBeVisible()
  })

  test('after clicking \'view\' button, url and likes can be seen', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likes = screen.getByText(
      blog.url, { exact: false }
    )
    const url = screen.getByText(blog.url)
  })

  test('pressing like button twice calls event handler received as prop twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('👍🏻')
    
    for (let i = 0; i < 2; i++) {
      await user.click(button)
    }

    expect(userLike.mock.calls).toHaveLength(2)
  })
})