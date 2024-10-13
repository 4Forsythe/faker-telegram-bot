import { faker } from '@faker-js/faker'

/**
 * Функция для получения случайного ключа по переданным параметрам
 * @param {'uuid' | 'nanoid'} format - формат генерации ('uuid' | 'nanoid')
 * @param {number} length - длина символов в строке (number)
 * @returns уникальный ключ в формате uuid или nanoid (по умолчанию возвращает uuid)
 */

export function getRandomKey(format = 'uuid', length = 21) {
  return format === 'uuid' ? faker.string.uuid() : faker.string.nanoid(length)
}

/**
 * Функция для генерации случайного пароля по переданным параметрам
 * @param {number} length - длина символов в строке (number)
 * @param {boolean} memorable - запоминаемость внешнего вида строки (boolean)
 * @returns случайно сгенерированный пароль
 */

export function getRandomPassword(length = 15, memorable = false) {
  return faker.internet.password({ length, memorable })
}

/**
 * Функция для генерации уникального токена (секрета)
 * @param {number} length - длина символов в строке (number)
 * @returns уникальная строка токена
 */

export function getRandomToken(length = 10) {
  return faker.string.sample(length)
}
