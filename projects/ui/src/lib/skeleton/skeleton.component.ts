import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-skeleton',
  standalone: true,
  template: '',
  styleUrl: './skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {}
