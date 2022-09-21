export const fetchApi = async (url) =>
  fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8"
    }
  })
    .then((res) => res.json())
    .then((response) => response);
