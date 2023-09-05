import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {concatMap, interval, map, merge, Subject, Subscription, take, tap} from "rxjs";

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
    this.red$.next({color: 'red', emitAt: new Date().getTime(), event})
  }

  onBlueClick(event: any) {
    this.blue$.next({color: 'blue', emitAt: new Date().getTime(), event})
  }

  ngOnInit(): void {
    merge(this.red$, this.blue$).pipe(
      concatMap(event => interval(1000).pipe(
        take(3),
        map(() => event),
        tap(this.newEvent.bind(this))
      ))
    ).subscribe()
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
