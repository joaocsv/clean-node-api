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
  validatorStubs: Validator[]
}

const makeSut = (): SutTypes => {
  const validatorStubs = [makeValidatorStub(), makeValidatorStub()]
  const sut = new ValidatorComposite(validatorStubs)

  return {
    sut,
    validatorStubs
  }
}

describe('Validator Composite', () => {
  test('Should return an error if any validator fails', () => {
    const { sut, validatorStubs } = makeSut()

    jest.spyOn(validatorStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const resultValidator = sut.validate({ name: 'any_name' })

    expect(resultValidator).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more then one validator fails', () => {
    const { sut, validatorStubs } = makeSut()

    jest.spyOn(validatorStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validatorStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const resultValidator = sut.validate({ name: 'any_name' })

    expect(resultValidator).toEqual(new Error())
  })

  test('Should not return if validator succeeds', () => {
    const { sut } = makeSut()

    const resultValidator = sut.validate({ name: 'any_name' })

    expect(resultValidator).toBeFalsy()
  })
})
