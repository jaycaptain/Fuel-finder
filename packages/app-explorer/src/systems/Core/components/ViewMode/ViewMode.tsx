import { ToggleGroup } from '@fuels/ui';
import Link from 'next/link';

export enum ViewModes {
  Simple = 'simple',
  Advanced = 'advanced',
}

export function ViewMode({ mode }: { mode: ViewModes }) {
  return (
    <ToggleGroup defaultValue={mode} aria-label="View mode">
      <ToggleGroup.Item value="simple" aria-label="Simple view">
        <Link prefetch href={`./${ViewModes.Simple}`}>
          Simple
        </Link>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="advanced" aria-label="Advanced view">
        <Link prefetch href={`./${ViewModes.Advanced}`}>
          Advanced
        </Link>
      </ToggleGroup.Item>
    </ToggleGroup>
  );
}
