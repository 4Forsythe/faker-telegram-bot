import bcrypt from 'bcrypt'

import { Markup } from 'telegraf'

export default class CryptoService {
  static async generate(ctx) {
    const value = ctx.session.generateHashOptions.value

    const hash = await bcrypt.hash(value, 10)

    return {
      text: '*🔒 Хеширую данные...*\n\n' + `${`\`${hash}\``}`,
      options: {
        parse_mode: 'Markdown',
        reply_markup: Markup.inlineKeyboard([
          [Markup.button.callback('✍🏻 Попробовать еще', 'hash')],
        ]).resize().reply_markup,
      },
    }
  }

  static async compare(ctx) {
    const hash = ctx.session.compareHashOptions.hash
    const value = ctx.session.compareHashOptions.value

    const isCompare = await bcrypt.compare(value, hash)

    const message = isCompare ? 'Хеш *соответствует* сообщению' : 'Хеш *не соответствует* сообщению'

    return {
      text: '*🔒 Проверяю хеш...*\n\n' + `${message}`,
      options: {
        parse_mode: 'Markdown',
        reply_markup: Markup.inlineKeyboard([
          [Markup.button.callback('✍🏻 Попробовать еще', 'compare')],
        ]).resize().reply_markup,
      },
    }
  }
}
