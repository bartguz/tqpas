import { Directive, Input, TemplateRef, ViewContainerRef, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

@Directive({ selector: '[ngSpawn]', standalone: true })
export class NgSpawnDirective implements OnChanges {
  @Input('ngSpawn') instances!: number;

  constructor(private templateRef: TemplateRef<unknown>, private viewContainer: ViewContainerRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { previousValue, currentValue }: SimpleChange = changes['instances'];
    const change: number = (currentValue || 0) - (previousValue || 0);
    this.applyChanges(change);
  }

  private applyChanges(change: number): void {
    const iterationTimes: number = Math.abs(change);
    const operation: () => void =
      change > 0
        ? (): unknown => this.viewContainer.createEmbeddedView(this.templateRef)
        : (): void => this.viewContainer.remove(0);

    for (let i: number = 0; i < iterationTimes; i++) {
      operation();
    }
  }
}
