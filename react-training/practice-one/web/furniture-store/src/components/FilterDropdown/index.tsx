import { memo } from 'react';
import Button from '../common/Button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '../ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { SortPosition, SORT_LABELS } from '../../constants/sort';

const FilterDropdown = ({
  position,
  setPosition,
}: {
  position: string;
  setPosition: (value: string) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-50 border-1 rounded-4xl text-base py-4"
        >
          {SORT_LABELS[position as SortPosition] || SORT_LABELS[SortPosition.MOST_RECENT]}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value={SortPosition.MOST_RECENT}>
            {SORT_LABELS[SortPosition.MOST_RECENT]}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SortPosition.LOW_TO_HIGH}>
            {SORT_LABELS[SortPosition.LOW_TO_HIGH]}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SortPosition.HIGH_TO_LOW}>
            {SORT_LABELS[SortPosition.HIGH_TO_LOW]}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(FilterDropdown);
