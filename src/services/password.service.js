import { Markup } from 'telegraf'

import { getRandomPassword } from '../lib/utils.js'

export default class PasswordService {
  static generate(ctx) {
    const length = ctx.session.generatePasswordOptions.length
    const memorable = ctx.session.generatePasswordOptions.memorable

    const randomPassword = getRandomPassword(length, memorable)

    return {
      text:
        '*🔐 Придумываю надежный пароль...*\n\n' +
        `${`\`${randomPassword}\``}\n\n` +
        'Перейдя в параметры ниже, ты сможешь более детально настроить вариант сгенерированного пароля',
      options: {
        parse_mode: 'Markdown',
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback('🎲 Повторить', 'password_retry'),
            Markup.button.callback('⚙️ Параметры', 'password_options'),
          ],
        ]).resize().reply_markup,
      },
    }
  }

  static options(ctx) {
    const length = ctx.session.generatePasswordOptions.length
    const memorable = ctx.session.generatePasswordOptions.memorable

    return {
      text:
        '*Параметры генерации пароля:*\n\n' +
        '• Длина — количество символов в строке (от 1 до 300)\n' +
        '• Запоминаемый (Да/Нет) — делает внешний вид строки более запоминающимся (снижает безопасность)',
      options: {
        parse_mode: 'Markdown',
        reply_markup: Markup.inlineKeyboard([
          [Markup.button.callback('🎲 Сгенерировать', 'password')],
          [
            Markup.button.callback(`Длина (${length})`, 'select_password_length'),
            Markup.button.callback(
              `Запоминаемый (${memorable ? 'Да' : 'Нет'})`,
              'select_password_memorable'
            ),
          ],
        ]).resize().reply_markup,
      },
    }
  }
}
