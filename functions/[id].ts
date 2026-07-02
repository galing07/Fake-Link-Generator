/// <reference types="@cloudflare/workers-types" />

import type { IPage } from '../lib/types'
import { createFakePreview, createResponse, isBot, expandData } from '../lib'

const page404 = () =>
  new Response(
    `<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>404 Halaman Tidak Ditemukan</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0;border:0;vertical-align:baseline}@keyframes slate-client-animation-glitch{0%{clip:rect(64px,9999px,66px,0)}5%{clip:rect(30px,9999px,36px,0)}10%{clip:rect(80px,9999px,71px,0)}15%{clip:rect(65px,9999px,64px,0)}20%{clip:rect(88px,9999px,40px,0)}25%{clip:rect(17px,9999px,79px,0)}30%{clip:rect(24px,9999px,26px,0)}35%{clip:rect(88px,9999px,26px,0)}40%{clip:rect(88px,9999px,80px,0)}45%{clip:rect(28px,9999px,51px,0)}50%{clip:rect(23px,9999px,40px,0)}55%{clip:rect(16px,9999px,86px,0)}60%{clip:rect(23px,9999px,94px,0)}65%{clip:rect(82px,9999px,39px,0)}70%{clip:rect(37px,9999px,92px,0)}75%{clip:rect(71px,9999px,52px,0)}80%{clip:rect(28px,9999px,74px,0)}85%{clip:rect(67px,9999px,96px,0)}90%{clip:rect(40px,9999px,88px,0)}95%{clip:rect(99px,9999px,61px,0)}100%{clip:rect(76px,9999px,77px,0)}}h1{font-size:120px;position:relative}h1::after,h1::before{content:"404";right:0;left:0;top:0;bottom:0;margin:auto;position:absolute;background-color:#f7f7f7;color:#000}h1::before{text-shadow:2px 0 #00ffea;animation:slate-client-animation-glitch 3s infinite linear}h1::after{text-shadow:-2px 0 #fe3a7f;animation:slate-client-animation-glitch 2s infinite linear}h2{text-align:center}.container{min-height:10%;height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;padding:24px}body,html{background:#f8f8f8;color:#0f0e12;font-size:16px;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-feature-settings:"liga","ss01","zero","cv11","frac","calt","tnum"}
    </style>
  </head>
  <body>
    <div class="container">
      <h1>404</h1>
      <h2>Halaman yang Anda cari tidak tersedia</h2>
    </div>
  </body>
  </html>`,
    {
      status: 404,
      headers: new Headers({
        'Content-Type': 'text/html; charset=UTF-8',
      }),
    }
  )

export const onRequestGet: PagesFunction<{
  DB: KVNamespace
}> = async context => {
  try {
    const { id } = context.params
    const { request } = context
    const { DB } = context.env

    const maybeData = await DB.get(Array.isArray(id) ? id[0] : id, 'json')

    if (!maybeData) return page404()

    const data = maybeData as IPage;

    const expanded = expandData(data);

    if (isBot(request)) {
      return new Response(createFakePreview(expanded), {
        headers: {
          'Content-Type': 'text/html; charset=UTF-8',
        },
      })
    } else {
      return Response.redirect(expanded.redirect, 302)
    }
  } catch (error) {
    return createResponse({ message: error.message }, 500)
  }
}
