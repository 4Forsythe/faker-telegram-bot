import 'dotenv/config'

import { Telegraf, Markup, session } from 'telegraf'
import { message } from 'telegraf/filters'

import KeyService from './services/key.service.js'
import PasswordService from './services/password.service.js'

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
  generatePasswordOptions: {
    length: 15,
    memorable: false,
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

// bot.hears(API, (ctx) => {
//   ctx.reply(
//     '*Какой модуль тебя интересует?*\n\n' +
//       'Я могу сгенерировать любое количество фейковых данных на основе одной из этих категорий:',
//     {
//       parse_mode: 'Markdown',
//       reply_markup: Markup.inlineKeyboard([
//         [
//           Markup.button.callback('📦 Коммерция', 'commerce'),
//           Markup.button.callback('💸 Финансы', 'finance'),
//           Markup.button.callback('💌 Адреса', 'location'),
//         ],
//         [
//           Markup.button.callback('👾 Хакерство', 'hacker'),
//           Markup.button.callback('⏰ Дата', 'date'),
//           Markup.button.callback('🎧 Музыка', 'music'),
//         ],
//         [
//           Markup.button.callback('🍔 Еда', 'food'),
//           Markup.button.callback('👨🏻‍💼 Личность', 'person'),
//           Markup.button.callback('🐼 Животные', 'animal'),
//         ],
//         [
//           Markup.button.callback('☎️ Телефоны', 'phone'),
//           Markup.button.callback('🌐 Интернет', 'internet'),
//           Markup.button.callback('🚚 Авто', 'vehicle'),
//         ],
//         [
//           Markup.button.callback('🏛️ Компании', 'commerce'),
//           Markup.button.callback('🌄 Картинки', 'image'),
//           Markup.button.callback('🌈 Цвета', 'color'),
//         ],
//         [
//           Markup.button.callback('🔢 Числа', 'number'),
//           Markup.button.callback('💬 Слова', 'word'),
//           Markup.button.callback('🅰️ Строки', 'string'),
//         ],
//       ]).resize().reply_markup,
//     }
//   )
// })

bot.hears(RANDOMIZER, async (ctx) => {
  await ctx.reply(
    '*Что именно ты хочешь сгенерировать?*\n\n' +
      'Я могу случайным образом сгенерировать уникальный ключ (идентификатор), секрет или токен, и надежный пароль.',
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

/* KEY ACTIONS */

bot.action('key', async (ctx) => {
  await ctx.answerCbQuery()
  ctx.session = SESSION

  const { text, options } = KeyService.generate(ctx)
  await ctx.reply(text, options)
})

bot.action('key_retry', async (ctx) => {
  await ctx.answerCbQuery()
  ctx.session = SESSION

  const messageId = ctx.callbackQuery.message.message_id

  if (!messageId) {
    const { text, options } = KeyService.generate(ctx)
    await ctx.reply(text, options)
  }

  const { text, options } = KeyService.generate(ctx)
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

/* PASSWORD ACTIONS */

bot.action('password', async (ctx) => {
  await ctx.answerCbQuery()
  ctx.session = SESSION

  const { text, options } = PasswordService.generate(ctx)
  await ctx.reply(text, options)
})

bot.action('password_retry', async (ctx) => {
  await ctx.answerCbQuery()
  ctx.session = SESSION

  const messageId = ctx.callbackQuery.message.message_id

  if (!messageId) {
    const { text, options } = PasswordService.generate(ctx)
    await ctx.reply(text, options)
  }

  const { text, options } = PasswordService.generate(ctx)
  await ctx.telegram.editMessageText(ctx.chat.id, messageId, messageId, text, options)
})

bot.action('password_options', async (ctx) => {
  await ctx.answerCbQuery()
  ctx.session ??= SESSION

  const messageId = ctx.callbackQuery.message.message_id

  const { text, options } = PasswordService.options(ctx)

  if (!messageId) {
    await ctx.reply(text, options)
  }

  await ctx.telegram.editMessageText(ctx.chat.id, messageId, messageId, text, options)
})

bot.action('select_password_length', async (ctx) => {
  await ctx.answerCbQuery()
  ctx.session ??= SESSION

  ctx.session.generatePasswordOptions.isAwaiting = true

  return ctx.reply(
    '*Какую длину мне установить для пароля?*\n\n' +
      'Напиши в чат сообщение с цифрой от 1 до 300, и я постараюсь что-нибудь придумать.',
    {
      parse_mode: 'Markdown',
    }
  )
})

bot.action('select_password_memorable', async (ctx) => {
  await ctx.answerCbQuery()
  ctx.session ??= SESSION

  const memorable = ctx.session.generatePasswordOptions.memorable
  const messageId = ctx.callbackQuery.message.message_id

  ctx.session.generatePasswordOptions.memorable = !memorable

  const { text, options } = PasswordService.options(ctx)

  if (!messageId) {
    await ctx.reply(text, options)
  }

  await ctx.telegram.editMessageText(ctx.chat.id, messageId, messageId, text, options)
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

  if (ctx.session && ctx.session.generatePasswordOptions.isAwaiting) {
    const length = parseInt(ctx.message.text)

    if (length >= 1 && length <= 300) {
      ctx.session.generatePasswordOptions.length = length
      ctx.session.generatePasswordOptions.isAwaiting = false

      const { text, options } = PasswordService.options(ctx)

      return ctx.reply(text, options)
    }

    return ctx.reply('Пожалуйста, введите любое значение от 1 до 300')
  }
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
