import { MissingParamError } from '../../errors'
import { RequiredFieldValidator } from './required-field-validator'

describe('RequiredField Validator', () => {
  test('Should return a MissingParamError if validator fails', () => {
    const sut = new RequiredFieldValidator('field')

    const resultValidator = sut.validate({ otherField: 'any_value' })

    expect(resultValidator).toEqual(new MissingParamError('field'))
  })
})
