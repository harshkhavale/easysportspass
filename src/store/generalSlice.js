import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { publicApi, setAuthToken } from "../api"; // Assuming setAuthToken adds token to headers
import { ENDPOINTS } from "../constants/endpoints";

// Initial state for generalSlice
const initialState = {
  countries: [],
  states: [],
  cities: [],
  plans: [],
  selectedPlan: null,
  activeSection: "Home",
  status: "idle",
  error: null,
};

// Fetch Countries Thunk with Token
export const fetchCountries = createAsyncThunk(
  "general/fetchCountries",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;  // Get token from auth state

    if (!token) {
      return rejectWithValue("Token not found");
    }

    setAuthToken(token); // Set the token in the request headers

    try {
      const response = await publicApi.get(ENDPOINTS.COUNTRY.COUNTRY);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch Membership Plans Thunk with Token
export const fetchPlans = createAsyncThunk(
  "general/fetchPlans",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token; // Get token from auth state

    if (!token) {
      return rejectWithValue("Token not found");
    }

    setAuthToken(token); // Set the token in the request headers

    try {
      const response = await publicApi.get(ENDPOINTS.MEMBERSHIP.GET_NORMAL_PLANS);
      return response.data.$values.map((plan) => ({
        ...plan,
        membershipPlanAttributes: plan.membershipPlanAttributes.$values,
      }));
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch States Thunk with Token
export const fetchStates = createAsyncThunk(
  "general/fetchStates",
  async (countryId, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token; // Get token from auth state

    if (!token) {
      return rejectWithValue("Token not found");
    }

    setAuthToken(token); // Set the token in the request headers

    try {
      const response = await publicApi.get(ENDPOINTS.STATE.STATE, {
        params: { countryId },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch Cities Thunk with Token
export const fetchCities = createAsyncThunk(
  "general/fetchCities",
  async (stateId, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token; // Get token from auth state

    if (!token) {
      return rejectWithValue("Token not found");
    }

    setAuthToken(token); // Set the token in the request headers

    try {
      const response = await publicApi.get(ENDPOINTS.CITY.CITY, {
        params: { stateId },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// General Slice
const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    selectPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.countries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchPlans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchStates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.states = action.payload;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchCities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { selectPlan, setActiveSection } = generalSlice.actions;
export default generalSlice.reducer;
