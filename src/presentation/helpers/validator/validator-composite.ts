import { Validator } from './validator'

export class ValidatorComposite implements Validator {
  private readonly validators: Validator[]

  constructor (validators: Validator[]) {
    this.validators = validators
  }

  validate (input: any): Error {
    for (const validator of this.validators) {
      const errorValidator = validator.validate(input)

      if (errorValidator) {
        return errorValidator
      }
    }
  }
}
