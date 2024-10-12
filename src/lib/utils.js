import { faker } from '@faker-js/faker'

/**
 * Функция для получения случайного ключа по переданным параметрам
 * @param {*} format - формат генерации ('uuid' | 'nanoid')
 * @param {*} length - длина символов в строке (number)
 * @returns уникальный ключ в формате uuid или nanoid (по умолчанию возвращает uuid)
 */

export function getRandomKey(format = 'uuid', length = 21) {
  return format === 'uuid' ? faker.string.uuid() : faker.string.nanoid(length)
}
