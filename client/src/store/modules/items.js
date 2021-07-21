import axios from "axios";

const state = {
  items: [],
  newItem: {
    content: "",
    type: "general",
    category: "",
    dateTime: "",
    completed: false,
  },
  itemMode: "create",
  filterConditions: {
    property: "",
    value: "",
  },
  sortConditions: "FIFO",
};

const getters = {
  allItems: (state) => state.items,
  newItem: (state) => state.newItem,
  getItemMode: (state) => state.itemMode,
  categories: (state) => {
    const allCategories = state.items.map((item) => item.category);
    return [...new Set(allCategories.filter((category) => category !== ""))];
  },
  filterConditions: (state) => state.filterConditions,
  sortConditions: (state) => state.sortConditions,
};

const actions = {
  async initItems({ commit, rootState }) {
    const res = await axios.post("api/users/token", {
      token: rootState.users.token,
    });
    const resItems = await axios.get(`api/items/${res.data}`);
    commit("initUserItems", resItems.data);
  },

  async addItem({ commit, rootState }, newItem) {
    const activeUser = rootState.users.activeUser;
    const res = await axios.post(`api/items/${activeUser}`, {
      ...newItem,
      userId: activeUser._id,
    });

    commit("addStateItem", res.data);
  },

  async updateItem({ commit }, updatedItem) {
    const res = await axios.put(`api/items/${updatedItem._id}`, updatedItem);
    commit("updateStateItems", res.data);
  },

  async deleteItem({ commit }, deleteId) {
    const res = await axios.delete(`api/items/${deleteId}`);
    commit("deleteStateItem", res.data._id);
  },
  // set selected category in suggestions menu to newItem
  fillCategory({ commit }, category) {
    commit("fillCategory", category);
  },
  // fill newItem with data equal to the item being edited (for resubmission)
  setEditItem({ commit }, item) {
    commit("changeEditItem", item);
  },
  changeFilter({ commit }, condition) {
    commit("setFilter", condition);
  },
  changeSort({ commit }, condition) {
    commit("setSort", condition);
  },
};

const mutations = {
  initUserItems(state, userItems) {
    state.items = userItems;
  },
  addStateItem(state, newItem) {
    state.items.push(newItem);

    state.newItem = {
      content: "",
      type: "general",
      category: "",
      dateTime: "",
      completed: false,
    };
  },
  updateStateItems(state, updatedItem) {
    const itemIndex = state.items.findIndex(
      (existingItem) => existingItem._id === updatedItem._id,
    );
    state.items.splice(itemIndex, 1, updatedItem);

    state.newItem = {
      content: "",
      type: "general",
      category: "",
      dateTime: "",
      completed: false,
    };
    state.itemMode = "create";
  },
  deleteStateItem(state, deleteId) {
    state.items = state.items.filter((item) => item._id !== deleteId);
  },
  fillCategory(state, category) {
    state.newItem.category = category;
  },
  changeEditItem(state, item) {
    state.newItem = item;
    state.itemMode = "edit";
  },
  setFilter(state, condition) {
    state.filterConditions = condition;
  },
  setSort(state, condition) {
    state.sortConditions = condition;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
