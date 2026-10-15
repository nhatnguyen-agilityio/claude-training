export const Category = {
  ALL: 'All',
  BEDROOM: 'Bedroom',
  LIVING_ROOM: 'Living Room',
  KITCHEN: 'Kitchen',
  WORKSPACE: 'Workspace',
  OUTDOOR: 'Outdoor',
  BATHROOM: 'Bathroom',
  HOME_OFFICE: 'Home office',
  DINING_ROOM: 'Dinning room',
} as const;

export type Category = (typeof Category)[keyof typeof Category];

export const CATEGORY_LIST = Object.values(Category);
