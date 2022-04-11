export interface AddLogErrorRepository {
  addError (stack: string): Promise<void>
}
