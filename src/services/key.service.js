import { Markup } from 'telegraf'

import { getRandomKey } from '../lib/utils.js'

export default class KeyService {
  static generate(format, length) {
    const randomKey = getRandomKey(format, length)

    return {
      text:
        '*Сейчас придумаю!*\n\n' +
        `${`\`${randomKey}\``}\n\n` +
        'Перейдя в параметры ниже, ты сможешь более детально настроить вариант сгенерированного ключа',
      options: {
        parse_mode: 'Markdown',
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback('🎲 Повторить', 'key_retry'),
            Markup.button.callback('⚙️ Параметры', 'key_options'),
          ],
        ]).resize().reply_markup,
      },
    }
  }

  static options(ctx) {
    const format = ctx.session.generateKeyOptions.format
    const length = ctx.session.generateKeyOptions.length

    return {
      text:
        '*Параметры генерации ключа:*\n\n' +
        '• Формат — UUID (стандартный идентификатор из 32 символов), Nanoid (более современный, безопасный и компактный идентификатор)\n' +
        '• Длина — количество символов в строке (от 21 до 200)',
      options: {
        parse_mode: 'Markdown',
        reply_markup: Markup.inlineKeyboard([
          [Markup.button.callback('🎲 Сгенерировать', 'key')],
          [
            Markup.button.callback(`Формат (${format.toUpperCase()})`, 'select_key_format'),
            Markup.button.callback(`Длина (${length})`, 'select_key_length'),
          ],
        ]).resize().reply_markup,
      },
    }
  }
}
