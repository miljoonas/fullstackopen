const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, newBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'asdf',
        password: 'asdf'
      }
    })

    await page.goto('http://localhost:5173')
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'new blog' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Login' })).not.toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      await expect(page.getByText('Wrong username or password')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).not.toBeVisible()

      await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await newBlog(page, 'test', 'dummy', 'https://test.url')

      await expect(page.getByRole('link', { name: 'test - dummy' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await newBlog(page, 'test2', 'dummy2', 'https://test.url2')
      await page.getByRole('link', { name: 'test2 - dummy2' }).click()

      await expect(page.getByText('likes 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      await newBlog(page, 'test3', 'dummy3', 'https://test.url3')
      await page.getByRole('link', { name: 'test3 - dummy3' }).click()

      page.once('dialog', dialog => {
        dialog.accept().catch(() => { })
      })
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByRole('link', { name: 'test3 - dummy3' })).not.toBeVisible()
    })
  })
})