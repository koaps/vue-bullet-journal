import axios from "axios";

const state = {
   habits: [],
   displayMonth: [],
   newHabit: {
      content: "",
      abbr: "",
      datesCompleted: [],
   },
   habitMode: "create",
};

const getters = {
   allHabits: (state) => state.habits,
   displayMonth: (state) => state.displayMonth,
   newHabit: (state) => state.newHabit,
   getHabitMode: (state) => state.habitMode,
};

const actions = {
   async initHabits({ commit, dispatch, rootState }) {
      const res = await axios.post("api/users/token", {
         token: rootState.users.token,
      });
      dispatch("changeActiveUser", { _id: res.data }, { root: true });
      const resHabits = await axios.get(`api/habits/${res.data}`);
      commit("initUserHabits", resHabits.data);

      const currentDate = new Date().toISOString().split("-", 2);
      await dispatch("setDateRange", currentDate);
   },
   async addHabit({ commit, rootState }, newHabit) {
      const activeUser = rootState.users.activeUser;
      const res = await axios.post(`api/habits/${activeUser}`, {
         ...newHabit,
         userId: activeUser._id,
      });

      commit("addStateHabit", res.data);
   },
   async updateHabit({ commit }, updatedHabit) {
      const res = await axios.put(
         `api/habits/${updatedHabit._id}`,
         updatedHabit
      );
      commit("updateStateHabit", res.data);
   },
   async deleteHabit({ commit }, deleteId) {
      const res = await axios.delete(`api/habits/${deleteId}`);
      commit("deleteStateHabit", res.data._id);
   },
   // display range of one month: current month or the month containing date selected
   async setDateRange({ commit }, currentDate) {
      const [year, month] = currentDate;
      const lastDay = new Date(year, month, 0).getDate() + 1;
      const dateRange = await [...Array(lastDay).keys()];
      dateRange.shift();
      const displayMonth = dateRange.map(
         (day) => `${year}-${month}-${String(day).padStart(2, "0")}`
      );
      commit("setDisplayMonth", displayMonth);
   },
   setEditHabit({ commit }, habit) {
      commit("changeEditHabit", habit);
   },
   setHabitMode({ commit }, mode) {
      commit("changeHabitMode", mode);
   },
};

const mutations = {
   initUserHabits(state, userHabits) {
      state.habits = userHabits;
   },
   addStateHabit(state, newHabit) {
      state.habits.push(newHabit);
      state.newHabit = {
         content: "",
         abbr: "",
         datesCompleted: [],
      };
   },
   updateStateHabit(state, updateHabit) {
      const habitIndex = state.habits.findIndex(
         (existingHabit) => existingHabit._id === updateHabit._id
      );
      state.habits.splice(habitIndex, 1, updateHabit);

      state.newHabit = {
         content: "",
         abbr: "",
         datesCompleted: [],
      };
      state.habitMode = "create";
   },
   deleteStateHabit(state, deleteId) {
      state.habits = state.habits.filter((habit) => habit._id !== deleteId);
   },
   setDisplayMonth(state, displayMonth) {
      state.displayMonth = displayMonth;
   },
   changeEditHabit(state, habit) {
      state.newHabit = habit;
      state.habitMode = "edit";
   },
   changeHabitMode(state, mode) {
      state.habitMode = mode;
   },
};

export default {
   state,
   getters,
   actions,
   mutations,
};
