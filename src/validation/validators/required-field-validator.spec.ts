import { MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidator } from './required-field-validator'

const makeSut = (): RequiredFieldValidator => {
  return new RequiredFieldValidator('field')
}

describe('RequiredField Validator', () => {
  test('Should return a MissingParamError if validator fails', () => {
    const sut = makeSut()

    const resultValidator = sut.validate({ otherField: 'any_value' })

    expect(resultValidator).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validator succeeds', () => {
    const sut = makeSut()

    const resultValidator = sut.validate({ field: 'any_value' })

    expect(resultValidator).toBeFalsy()
  })
})
