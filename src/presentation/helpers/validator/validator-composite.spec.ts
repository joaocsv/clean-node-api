import { MissingParamError } from '../../errors'
import { Validator } from './validator'
import { ValidatorComposite } from './validator-composite'

describe('Validator Composite', () => {
  test('Should return an error if any validator fails', () => {
    class ValidatorStub implements Validator {
      validate (input: any): Error {
        return new MissingParamError('field')
      }
    }

    const validatorStub = new ValidatorStub()

    const sut = new ValidatorComposite([validatorStub])

    const resultValidator = sut.validate({ name: 'any_name' })

    expect(resultValidator).toEqual(new MissingParamError('field'))
  })
})
