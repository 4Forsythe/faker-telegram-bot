import 'dotenv/config'

import { Telegraf } from 'telegraf'

const token = process.env.TELEGRAM_BOT_TOKEN

const bot = new Telegraf(token)

bot.command('start', async (ctx) => {
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
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
