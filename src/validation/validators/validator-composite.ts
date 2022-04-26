import { Validator } from '../../presentation/protocols/validator'

export class ValidatorComposite implements Validator {
  constructor (private readonly validators: Validator[]) {}

  validate (input: any): Error {
    for (const validator of this.validators) {
      const errorValidator = validator.validate(input)

      if (errorValidator) {
        return errorValidator
      }
    }
  }
}
