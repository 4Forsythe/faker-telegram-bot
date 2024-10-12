import 'dotenv/config'

import { Telegraf, Markup, session } from 'telegraf'
import { message } from 'telegraf/filters'

import KeyService from './services/key.service.js'

const token = process.env.TELEGRAM_BOT_TOKEN

const API = '🔥 API'
const HELPERS = '❓ Хелперы'
const RANDOMIZER = '🎲 Рандомайзер'
const CRYPTO = '🔒 Криптография'

const SESSION = {
  generateKeyOptions: {
    format: 'uuid',
    length: 21,
    isAwaiting: false,
  },
}

const bot = new Telegraf(token)

bot.use(session())

bot.command('start', async (ctx) => {
  ctx.session = SESSION

  await ctx.replyWithPhoto(
    { source: 'src/assets/hello.jpg' },
    {
      caption:
        '*Что может делать этот бот?*\n\n' +
        '🐼 Вас приветствует *Faker API Bot*!\n\n' +
        'Я умею генерировать огромное количество разнообразных фейковых (но реалистичных) данных в один клик, используя все доступные возможности официальной документации.\n\n' +
        '[📋 Официальная документация](https://fakerjs.dev/api/) | [📍 GitHub](https://github.com/faker-js/faker)\n\n' +
        '🌟 Вот несколько моих *возможностей*:\n\n' +
        '• Генерация ключей, токенов, секретов или паролей по выбранной модели\n' +
        '• Хеширование и дехеширование\n' +
        '• Генерация типовых данных (числа, строки, объекты, массивы)\n' +
        '• Генерация тематических данных по различным категориям (имена, адреса, товары, коммерация и т.д.)\n' +
        '• Генерация моковых данных (для тестирования или разработки)\n\n' +
        'Бот поможет вам в генерации реалистичного контента для творческих, коммерческих и образовательных целей — абсолютно бесплатно.',
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    }
  )

  await ctx.reply(
    '👀 Что я могу для тебя сделать?',
    Markup.keyboard([
      [API, HELPERS],
      [RANDOMIZER, CRYPTO],
    ])
      .oneTime()
      .resize()
  )
})

bot.hears(RANDOMIZER, async (ctx) => {
  await ctx.reply(
    '*Что именно ты хочешь сгенерировать?*\n\n' +
      'Я могу сгенерировать любое количество фейковых данных на основе одной из перечисленных категорий:',
    {
      parse_mode: 'Markdown',
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.callback('🔑 Ключ', 'key'),
          Markup.button.callback('🍪 Токен', 'token'),
          Markup.button.callback('🔐 Пароль', 'password'),
        ],
      ]).resize().reply_markup,
    }
  )
})

bot.action('key', async (ctx) => {
  await ctx.answerCbQuery()
  ctx.session = SESSION

  const format = ctx.session.generateKeyOptions.format
  const length = ctx.session.generateKeyOptions.length

  const { text, options } = KeyService.generate(format, length)
  await ctx.reply(text, options)
})

bot.action('key_retry', async (ctx) => {
  await ctx.answerCbQuery()
  ctx.session = SESSION

  const format = ctx.session.generateKeyOptions.format
  const length = ctx.session.generateKeyOptions.length
  const messageId = ctx.callbackQuery.message.message_id

  if (!messageId) {
    const { text, options } = KeyService.generate(format, length)
    await ctx.reply(text, options)
  }

  const { text, options } = KeyService.generate(format, length)
  await ctx.telegram.editMessageText(ctx.chat.id, messageId, messageId, text, options)
})

bot.action('key_options', async (ctx) => {
  await ctx.answerCbQuery()
  ctx.session ??= SESSION

  const messageId = ctx.callbackQuery.message.message_id

  const { text, options } = KeyService.options(ctx)

  if (!messageId) {
    await ctx.reply(text, options)
  }

  await ctx.telegram.editMessageText(ctx.chat.id, messageId, messageId, text, options)
})

bot.action('select_key_format', async (ctx) => {
  await ctx.answerCbQuery()
  ctx.session ??= SESSION

  const format = ctx.session.generateKeyOptions.format
  const messageId = ctx.callbackQuery.message.message_id

  ctx.session.generateKeyOptions.format = format === 'uuid' ? 'nanoid' : 'uuid'

  const { text, options } = KeyService.options(ctx)

  if (!messageId) {
    await ctx.reply(text, options)
  }

  await ctx.telegram.editMessageText(ctx.chat.id, messageId, messageId, text, options)
})

bot.action('select_key_length', async (ctx) => {
  await ctx.answerCbQuery()
  ctx.session ??= SESSION

  ctx.session.generateKeyOptions.isAwaiting = true

  return ctx.reply(
    '*Какую длину мне установить для ключа?*\n\n' +
      'Напиши в чат сообщение с цифрой от 21 до 200, и я постараюсь что-нибудь придумать.\n\n' +
      '_Внимание! Формат ключа UUID имеет строгий стандарт по длине в 32 символа (этот параметр не будет на него распространяться)_',
    {
      parse_mode: 'Markdown',
    }
  )
})

bot.on(message('text'), async (ctx) => {
  if (ctx.session && ctx.session.generateKeyOptions.isAwaiting) {
    const length = parseInt(ctx.message.text)

    if (length >= 21 && length <= 200) {
      ctx.session.generateKeyOptions.length = length
      ctx.session.generateKeyOptions.isAwaiting = false

      const { text, options } = KeyService.options(ctx)

      return ctx.reply(text, options)
    }

    return ctx.reply('Пожалуйста, введите любое значение от 21 до 200')
  }
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
