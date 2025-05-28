import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/useAPI/api";

// 1. Type Definition
export interface AboutUsData {
  id: number;
  title: string;
  logo: string;
  back: string;
  backgroundApp: string;
  backgroundImage: string;
  about: string;
  born_date: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  linkedin: string | null;
  facebook: string;
  twitter: string;
  instagram: string;
}

interface AboutUsState {
  data: AboutUsData | null;
  loading: boolean;
  error: string | null;
}

// 2. Initial State
const initialState: AboutUsState = {
  data: null,
  loading: false,
  error: null,
};

// 3. Async Thunk
export const fetchAboutUs = createAsyncThunk<AboutUsData>(
  "aboutUs/fetchAboutUs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/info/aboutus/");
      return response.data[0] as AboutUsData;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch About Us data."
      );
    }
  }
);

// 4. Slice
const aboutUsSlice = createSlice({
  name: "aboutUs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAboutUs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAboutUs.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAboutUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default aboutUsSlice.reducer;
