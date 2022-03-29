import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()

    const isValid = sut.isValid('valid_email@mail.com')

    expect(isValid).toBe(false)
  })
})
