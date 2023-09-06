import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, interval, merge, Subject, Subscription, switchMap, take, tap} from "rxjs";

@Component({
  selector: 'app-button-racer',
  templateUrl: './button-racer.component.html',
  styleUrls: ['./button-racer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonRacerComponent implements OnInit, OnDestroy {

  red$ = new Subject<CustomButtonClickEvent>();
  blue$ = new Subject<CustomButtonClickEvent>();
  events$ = new Subject<CustomButtonClickEvent[]>();

  events: CustomButtonClickEvent[] = [];
  subscriptions: Subscription[] = [];

  onRedClick(event: any) {
    const redEvent: CustomButtonClickEvent = {color: 'red', emitAt: new Date().getTime(), event};
    this.red$.next(redEvent)
  }

  onBlueClick(event: any) {
    const blueEvent: CustomButtonClickEvent = {color: 'blue', emitAt: new Date().getTime(), event};
    this.blue$.next(blueEvent);
  }

  ngOnInit(): void {
    forkJoin(
      this.red$.pipe(take(1)),
      this.blue$.pipe(take(1))
    ).pipe(
      tap(events => events.forEach(e => this.newEvent(e)))
    ).subscribe();
    // merge(this.red$, this.blue$).pipe(
    //   switchMap(event => interval(1000).pipe(
    //     take(3),
    //     tap(() => this.newEvent(event))
    //   ))
    // ).subscribe()
  }

  newEvent(event: CustomButtonClickEvent) {
    this.events = [...this.events, {...event, pushedAt: new Date().getTime()}];
    this.events$.next(this.events);
  }

  clear() {
    this.events = [];
    this.events$.next([]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

}

export interface CustomButtonClickEvent {
  color: string;
  emitAt: number;
  pushedAt?: number;
  event: any;
}
