import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldsValidator } from './compare-fields-validator'

const makeSut = (): CompareFieldsValidator => {
  return new CompareFieldsValidator('field', 'fieldToCompare')
}

describe('CompareFields Validator', () => {
  test('Should return a InvalidParamError if validator fails', () => {
    const sut = makeSut()

    const resultValidator = sut.validate({ field: 'any_value', fieldToCompare: 'other_value' })

    expect(resultValidator).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should not return if validator succeeds', () => {
    const sut = makeSut()

    const resultValidator = sut.validate({ field: 'any_value', fieldToCompare: 'any_value' })

    expect(resultValidator).toBeFalsy()
  })
})
