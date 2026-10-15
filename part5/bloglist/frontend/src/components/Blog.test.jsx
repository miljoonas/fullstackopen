import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
// import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect, test, vi } from 'vitest'

const blog = {
  id: '6acca56f19cf6e94df51bef1',
  title: 'Test Blog',
  author: 'Dummy',
  url: 'fso.miljoonas.fi',
  likes: 14,
  user: {
    name: 'Mikko Meikäläinen',
    username: 'mikko',
    id: '12345'
  }
}

const creator = {
  name: 'Mikko Meikäläinen',
  username: 'mikko',
}

const otherUser = {
  name: 'Test User',
  username: 'other',
}

const renderBlog = (props = {}) => {
  const likeBlog = props.likeBlog ?? vi.fn()
  const deleteBlog = props.deleteBlog ?? vi.fn()
  return {
    likeBlog,
    deleteBlog,
    ...render(
      <MemoryRouter>
        <Blog
          blog={blog}
          likeBlog={likeBlog}
          deleteBlog={deleteBlog}
          {...props}
        />
      </MemoryRouter>
    )
  }
}

const expectBlogDetails = () => {
  expect(screen.getByRole('heading', { name: 'Dummy: Test Blog' })).toBeVisible()
  expect(screen.getByRole('link', blog.url)).toBeVisible()
  expect(screen.getByText('likes 14')).toBeVisible()
  expect(screen.getByText('Added by Mikko Meikäläinen')).toBeVisible()
}

describe('<Blog />', () => {
  test('shows blog details and likes to a logged-out user, with no buttons', () => {
    renderBlog({ user: null })
    expectBlogDetails()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  test('shows only the like button to a logged-in user who is not the creator', () => {
    renderBlog({ user: otherUser })

    expectBlogDetails()
    expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
  })

  test('shows like and remove buttons to the blog creator', () => {
    renderBlog({ user: creator })

    expectBlogDetails()
    expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
  })
})