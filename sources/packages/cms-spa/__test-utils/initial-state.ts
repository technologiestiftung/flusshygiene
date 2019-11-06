import { DEFAULT_SPOT_ID } from '../src/lib/common/constants';

export const initialState = {
  data: {
    spots: [
      {
        id: DEFAULT_SPOT_ID,
        createdAt: new Date(2525),
        updatedAt: new Date(2525),
        name: 'Lade Badestellendaten',
      },
    ],
    loading: false,
    error: null,
    truncated: false,
  },
  postSpot: {
    loading: false,
    success: undefined,
    error: null,
  },
  detailSpot: {
    spot: {
      id: DEFAULT_SPOT_ID,
      createdAt: new Date(2525),
      updatedAt: new Date(2525),
      name: 'Lade Badestellendaten',
    },
    loading: false,
    error: null,
    truncated: false,
  },
  questionaire: { data: [] },
};
