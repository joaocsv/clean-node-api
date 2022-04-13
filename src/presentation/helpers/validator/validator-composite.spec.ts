import { MissingParamError } from '../../errors'
import { Validator } from './validator'
import { ValidatorComposite } from './validator-composite'

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidatorStub()
}

interface SutTypes {
  sut: ValidatorComposite
  validatorStub: Validator
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const sut = new ValidatorComposite([validatorStub])

  return {
    sut,
    validatorStub
  }
}

describe('Validator Composite', () => {
  test('Should return an error if any validator fails', () => {
    const { sut, validatorStub } = makeSut()

    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const resultValidator = sut.validate({ name: 'any_name' })

    expect(resultValidator).toEqual(new MissingParamError('field'))
  })
})
