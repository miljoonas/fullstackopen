import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { vi } from 'vitest'

const blog = {
  id: '6acca56f19cf6e94df51bef1',
  title: 'Test Blog',
  author: 'Dummy',
  url: 'fso.miljoonas.fi',
  likes: 14,
  user: {
    name: 'Mikko Meikäläinen',
    id: '12345'
  }
}

describe('<Blog />', () => {
  test('renders title', async () => {
    const user = userEvent.setup()

    const likeBlog = vi.fn()
    const deleteBlog = vi.fn()

    render(<Blog blog={blog} likeBlog={likeBlog} deleteBlog={deleteBlog} />)

    expect(screen.getAllByText('Test Blog - Dummy').length).toBeGreaterThan(0)
    expect(screen.queryByText(blog.url)).not.toBeVisible()
    expect(screen.getByText('likes 14')).not.toBeVisible()

    await user.click(screen.getByRole('button', { name: 'view' }))

    expect(screen.getByText(blog.url)).toBeVisible()
    expect(screen.getByText('likes 14')).toBeVisible()
    expect(screen.getByText('Mikko Meikäläinen')).toBeVisible()
    expect(screen.getByRole('button', { name: 'hide' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
  })

  test('view button reveals right content', async () => {
    const user = userEvent.setup()



    const likeBlog = vi.fn()
    const deleteBlog = vi.fn()

    render(<Blog blog={blog} likeBlog={likeBlog} deleteBlog={deleteBlog} />)

    expect(screen.getAllByText('Test Blog - Dummy').length).toBeGreaterThan(0)
    expect(screen.queryByText(blog.url)).not.toBeVisible()
    expect(screen.getByText('likes 14')).not.toBeVisible()

    await user.click(screen.getByRole('button', { name: 'view' }))

    expect(screen.getByText(blog.url)).toBeVisible()
    expect(screen.getByText('likes 14')).toBeVisible()
    expect(screen.getByText('Mikko Meikäläinen')).toBeVisible()
    expect(screen.getByRole('button', { name: 'hide' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
  })

  test('calls likeBlog twice when like button is clicked twice', async () => {
    const user = userEvent.setup()

    const likeBlog = vi.fn()
    const deleteBlog = vi.fn()

    render(
      <Blog
        blog={blog}
        likeBlog={likeBlog}
        deleteBlog={deleteBlog}
      />
    )

    await user.click(screen.getByRole('button', { name: 'view' }))

    const likeButton = screen.getByRole('button', { name: 'like' })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(likeBlog).toHaveBeenCalledTimes(2)

    expect(likeBlog).toHaveBeenNthCalledWith(1, blog)
    expect(likeBlog).toHaveBeenNthCalledWith(2, blog)
  })
})