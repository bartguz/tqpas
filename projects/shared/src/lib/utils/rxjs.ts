import { MonoTypeOperatorFunction, shareReplay } from 'rxjs';

//bg-info: convenience sharereplay with refcount to prevent memory leak
export function shareReplayOne<T>(): MonoTypeOperatorFunction<T> {
  return shareReplay({ bufferSize: 1, refCount: true });
}
