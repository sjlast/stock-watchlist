// https://stackoverflow.com/questions/65282181/how-to-use-jest-for-testing-a-react-component-with-localstorage
const mockLocalStorage = (() => {
  let store = {};

  return {
    getItem: (key) => {
      return store[key] || null;
    },
    setItem: (key, value) => {
      store[key] = value;
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});
