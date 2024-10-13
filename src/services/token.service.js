import { Markup } from 'telegraf'

import { getRandomToken } from '../lib/utils.js'

export default class TokenService {
  static generate(ctx) {
    const length = ctx.session.generateTokenOptions.length

    const randomToken = getRandomToken(length)

    return {
      text:
        '🍪 Сейчас придумаю!\n\n' +
        `${randomToken}\n\n` +
        'Перейдя в параметры ниже, ты сможешь более детально настроить вариант сгенерированного пароля',
      options: {
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback('🎲 Повторить', 'token_retry'),
            Markup.button.callback('⚙️ Параметры', 'token_options'),
          ],
        ]).resize().reply_markup,
      },
    }
  }

  static options(ctx) {
    const length = ctx.session.generateTokenOptions.length

    return {
      text:
        '*Параметры генерации токена:*\n\n' +
        '• Длина — количество символов в строке (от 1 до 500)',
      options: {
        parse_mode: 'Markdown',
        reply_markup: Markup.inlineKeyboard([
          [Markup.button.callback('🎲 Сгенерировать', 'token')],
          [Markup.button.callback(`Длина (${length})`, 'select_token_length')],
        ]).resize().reply_markup,
      },
    }
  }
}
