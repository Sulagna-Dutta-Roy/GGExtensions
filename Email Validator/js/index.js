let result = {
  tag: "",
  free: false,
  role: false,
  user: "sadafkausar",
  email: "sadafkausar@gmail.com",
  score: 0.64,
  state: "undeliverable",
  domain: "gmail.com",
  reson: "invalid_mailbox",
  mx_found: true,
  catch_all: null,
  disposable: false,
  smtp_check: false,
  did_you_mean: "",
  format_valid: true,
};

submitBtn.addEventListener("click", async (e) => {
  resultConts.innerHTML = `<img width="190" src="/img/loading.svg" alt="" />`;
  e.preventDefault();
  let key = "ema_live_bIjh8bzUApMrZUuXcOQvVKHV0L4AHgCCqt4yGR8a";
  let email = document.getElementById("username").value;

  let url = `https://api.emailvalidation.io/v1/info?apikey=${key}&email=${email}`;
  let res = await fetch(url);
  let result = await res.json();
  let str = ``;
  for (key of Object.keys(result)) {
    if (result[key] !== "" && result[key] !== " ") {
      str = str + `<div>${key}:${result[key]}</div>`;
    }
  }

  resultConts.innerHTML = str;
});
