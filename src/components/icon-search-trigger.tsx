'use client';

import type { FC } from 'react';
import {
  SearchTrigger,
  type FullSearchTriggerProps,
} from 'fumadocs-ui/layouts/shared/slots/search-trigger';

/**
 * Drop-in replacement for fumadocs's wide "Search… ⌘K" desktop trigger.
 * Renders the same compact icon button used at the mobile breakpoint, on
 * every breakpoint — so the trigger is honest about being a button (not
 * a fake input that pretends you can type into it).
 *
 * The HomeLayout passes a wide-bar className to the `full` slot
 * (`w-full rounded-full ps-2.5 max-w-[240px]`); we drop it so the icon
 * button keeps its native sizing.
 */
export const IconSearchTrigger: FC<FullSearchTriggerProps> = ({
  // Drop the layout-passed className (intended for the wide bar) and
  // the HTML `color` attribute (collides with SearchTrigger's button
  // color variant). SearchTrigger picks its own size/color defaults.
  className: _className,
  color: _color,
  ...rest
}) => {
  return <SearchTrigger {...rest} />;
};
