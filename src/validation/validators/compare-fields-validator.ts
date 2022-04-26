import { InvalidParamError } from '../../presentation/errors'
import { Validator } from '../../presentation/protocols/'

export class CompareFieldsValidator implements Validator {
  constructor (
    private readonly fieldName: string,
    private readonly fieldToCompareName: string
  ) {}

  validate (input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName)
    }
  }
}
