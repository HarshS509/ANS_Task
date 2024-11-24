import { createSlice } from "@reduxjs/toolkit";

const abc = createSlice({
  name: "abc",
  initialState: {
    count: 0,
  },
  reducers: {
    increment: (state) => {
      state.count++;
    },
    decrement: (state) => {
      state.count--;
    },
  },
});
