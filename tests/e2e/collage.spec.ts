import { expect, test } from '@playwright/test'
import path from 'node:path'

const categories = [
  'animal',
  'place',
  'flower',
  'personality',
  'season',
  'hobby',
  'color',
  'drink',
  'food',
]

test('renders default categories and primary actions', async ({ page }) => {
  await page.goto('/')

  for (const [index, category] of categories.entries()) {
    await expect(
      page.getByLabel(`Edit category ${index + 1} name`),
    ).toHaveValue(category)
    await expect(page.getByLabel(`Choose image for ${category}`)).toBeVisible()
  }

  await expect(
    page.getByRole('heading', { name: 'Friendship Collage' }),
  ).toBeVisible()

  await expect(
    page.getByRole('button', { name: 'Present the collage' }),
  ).toBeDisabled()
  await expect(
    page.getByRole('button', { name: 'Download an image' }),
  ).toBeDisabled()
  await expect(
    page.getByRole('button', { name: 'Generate a GIF' }),
  ).toBeDisabled()
})

test('selects category images and navigates showcase mode', async ({
  page,
}) => {
  await page.goto('/')
  await uploadAllImages(page)

  await page.getByLabel('Edit category 1 name').fill('favorite animal')

  await page.getByRole('button', { name: 'Present the collage' }).click()
  await expect(page.getByText('Friendship prompt')).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'favorite animal' }),
  ).toBeVisible()

  await page.keyboard.press('Enter')
  await expect(page.getByAltText('favorite animal selection')).toBeVisible()

  await page.keyboard.press('Space')
  await expect(page.getByRole('heading', { name: 'place' })).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.getByLabel('Edit category 1 name')).toHaveValue(
    'favorite animal',
  )
  await expect(page.getByAltText('favorite animal preview')).toBeVisible()
})

test('preserves image aspect ratios in previews and showcase mode', async ({
  page,
}) => {
  await page.goto('/')
  await uploadAllImages(page)

  await expect(page.getByAltText('animal preview')).toHaveCSS(
    'object-fit',
    'contain',
  )
  await page.getByRole('button', { name: 'Present the collage' }).click()
  await page.keyboard.press('Enter')
  await expect(page.getByAltText('animal selection')).toHaveCSS(
    'object-fit',
    'contain',
  )
})

test('persists edited labels and selected images', async ({ page }) => {
  await page.goto('/')
  await page
    .getByLabel('Choose image for animal')
    .setInputFiles(fixturePath('animal.svg'))
  await page.getByLabel('Edit category 1 name').fill('tiny beast')
  await expect(
    page.getByText('Image selected. You can replace it anytime.'),
  ).toBeVisible()

  const storedSelection = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('friendship-collage')
      request.addEventListener('success', () => resolve(request.result))
      request.addEventListener('error', () => reject(request.error))
    })
    const record = await new Promise<{ name: string } | undefined>(
      (resolve, reject) => {
        const request = db
          .transaction('selections', 'readonly')
          .objectStore('selections')
          .get('category-0')
        request.addEventListener('success', () => resolve(request.result))
        request.addEventListener('error', () => reject(request.error))
      },
    )
    db.close()
    return {
      legacyLocalStorage: localStorage.getItem('friendship-collage:selections'),
      name: record?.name,
    }
  })

  expect(storedSelection).toEqual({
    legacyLocalStorage: null,
    name: 'animal.svg',
  })
  await page.reload()

  await expect(page.getByLabel('Edit category 1 name')).toHaveValue(
    'tiny beast',
  )
  await expect(page.getByAltText('tiny beast preview')).toBeVisible()
})

test('removes selected images and disables actions again', async ({ page }) => {
  await page.goto('/')
  await uploadAllImages(page)
  await expect(
    page.getByRole('button', { name: 'Present the collage' }),
  ).toBeEnabled()

  await page.getByRole('button', { name: 'Remove image' }).first().click()

  await expect(page.getByAltText('animal preview')).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'Present the collage' }),
  ).toBeDisabled()
  await expect(
    page.getByRole('button', { name: 'Download an image' }),
  ).toBeDisabled()
  await expect(
    page.getByRole('button', { name: 'Generate a GIF' }),
  ).toBeDisabled()
})

test('communicates missing images before media actions', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('button', { name: 'Download an image' }),
  ).toBeDisabled()
})

test('requests generated image download and GIF generation', async ({
  page,
}) => {
  await page.goto('/')
  await uploadAllImages(page)

  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download an image' }).click()
  await expect((await download).suggestedFilename()).toBe(
    'friendship-collage.png',
  )

  const gifDownload = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Generate a GIF' }).click()
  await expect((await gifDownload).suggestedFilename()).toBe(
    'friendship-collage.gif',
  )
})

test('keeps the category grid usable on mobile', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile project only')
  await page.goto('/')

  await expect(page.getByLabel('Edit category 1 name')).toHaveValue('animal')
  await expect(page.getByLabel('Edit category 9 name')).toHaveValue('food')
  await expect(page.locator('body')).toHaveJSProperty(
    'scrollWidth',
    await page.evaluate(() => document.body.clientWidth),
  )
})

async function uploadAllImages(page: Parameters<typeof test>[0]['page']) {
  for (const [index, category] of categories.entries()) {
    const fixture = index % 2 === 0 ? 'animal.svg' : 'place.svg'
    await page
      .getByLabel(`Choose image for ${category}`)
      .setInputFiles(fixturePath(fixture))
    await expect(page.getByAltText(`${category} preview`)).toBeVisible()
  }
}

function fixturePath(name: string) {
  return path.join(import.meta.dirname, 'fixtures', name)
}
