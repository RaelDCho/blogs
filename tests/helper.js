
const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username:').fill(username)
  await page.getByLabel('password:').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async(page, title, author, url) => {
  await page.getByRole('button', { name: 'create a new blog' }).click()
  await page.getByLabel('title:').fill('creating a blog through playwright test!')
  await page.getByLabel('author:').fill('playwrighttester123')
  await page.getByLabel('url:').fill('www.playwright.com')
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(`${title} by ${author}`).waitFor()
}

export { loginWith, createBlog }