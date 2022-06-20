export interface APIMessage<T> {
  message?: string | undefined | null;
  result?: T;
  completed: boolean;
}
