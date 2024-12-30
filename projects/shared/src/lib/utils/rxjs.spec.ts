import { Subject, tap } from "rxjs";
import { shareReplayOne } from "./rxjs";

describe('shareReplayOnce', () => {
  let subject: Subject<any> = new Subject();
  let fn: jasmine.Spy = jasmine.createSpy('fn')
  const value: string = 'asd';

  it('should run pipe once for all subscribers when shareReplayOnce used', () => {
    const pipe = subject.pipe(
      tap((x) => fn(x)),
      shareReplayOne()
    );
    pipe.subscribe();
    pipe.subscribe();
    pipe.subscribe();
    subject.next(value);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(value);
  });
});