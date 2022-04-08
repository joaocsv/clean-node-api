export interface AddLogErrorRepository {
  add (stack: string): Promise<void>
}
