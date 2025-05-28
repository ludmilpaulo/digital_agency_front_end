import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/useAPI/api';

export interface CarouselImage {
  image: string;
}
export interface CarouselItem {
  id: number;
  image: CarouselImage[];
  title: string;
  sub_title: string;
}

interface CarouselState {
  items: CarouselItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CarouselState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk to fetch carousel data
export const fetchCarousel = createAsyncThunk<CarouselItem[]>(
  'carousel/fetchCarousel',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/info/carousels/');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const carouselSlice = createSlice({
  name: 'carousel',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarousel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarousel.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCarousel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default carouselSlice.reducer;
