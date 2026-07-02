/// <reference types="@cloudflare/workers-types" />

import type { IExpandedPage } from '../lib/types'
import { nanoid } from 'nanoid/non-secure'
import { isURL, createResponse } from '../lib'

const hash = (s: string) => s.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0).toString(36).slice(1);

export const onRequestPost: PagesFunction<{
  DB: KVNamespace
}> = async context => {
  try {
    const { request, env: { DB } } = context;
    const body: Partial<IExpandedPage> = await request.json();

    if (!body.description || !body.image || !body.redirect || !body.title) {
      return createResponse(
        {
          message: "Anda harus mengisi 'description', 'image', 'title' и 'redirect'",
        },
        422
      )
    }

    if (!isURL(body.redirect)) {
      return createResponse({ message: 'URL-tujuan tidak valid' }, 422)
    }

    if (body.redirect.length > 250) {
      return createResponse(
        { message: 'Panjang URL redirect harus kurang dari atau sama dengan 250 karakter' },
        422
      )
    }

    /*
     * '👨‍👨‍👧‍👧'.length --> 11
     * Perlu dipertimbangkan cara menangani karakter Unicode
     */
    if (body.title.length > 70) {
      return createResponse(
        { message: 'Panjang judul harus kurang dari atau sama dengan 70 karakter' },
        422
      )
    }

    if (body.description.length > 150) {
      return createResponse(
        { message: 'Panjang deskripsi harus kurang dari atau sama dengan 150 karakter' },
        422
      )
    }

    if (body.image.startsWith('data:')) {
      return createResponse(
        { message: 'Penggunaan data:image tidak diperbolehkan' },
        422
      )
    }

    if (!isURL(body.image)) {
      return createResponse(
        { message: 'URL gambar tidak valid' },
        422
      )
    }

    if (body.image.length > 200) {
      return createResponse(
        { message: 'Panjang URL gambar harus kurang dari atau sama dengan 200 karakter' },
        422
      )
    }

    const id = nanoid(6) + '_' + hash(body.redirect)

    await DB.put(
      id,
      JSON.stringify({
        d: body.description,
        i: body.image,
        r: body.redirect,
        t: body.title,
      })
    )

    return createResponse({ message: 'Создано успешно', id }, 201)
  } catch (error) {
    return createResponse({ message: error.message }, 500)
  }
}
