// wait for the page to load
addEventListener("DOMContentLoaded", () => {
  document.getElementById("start").addEventListener("click", () => {
    let url = "";
    let userOption = document.getElementById("userOption").value; // get user's preferred option

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      url = tabs[0].url;
      let found = false;

      let surveyType = "";
      const surveyTypes = {
        "https://ufuture.uitm.edu.my/sufo/questions/index/": "sufo",
        "https://ufuture.uitm.edu.my/kifo/questions/index/": "kifo",
        "https://ufuture.uitm.edu.my/ess/answers/entry/": "entrance",
        "https://ufuture.uitm.edu.my/ess/answers/exits/": "exit",
      };

      for (const [key, value] of Object.entries(surveyTypes)) {
        if (url.includes(key)) {
          surveyType = value;
          found = true;
          break;
        }
      }

      if (!found) {
        let button = document.getElementById("start");
        let status = document.getElementById("status");
        let statusMessage = document.getElementById("status-message");
        statusMessage.innerHTML = "Please run the script on the right website.";
        status.classList.remove("alert-primary");
        status.classList.add("alert-danger");
        button.blur();

        // make the background red for 3 seconds
        setTimeout(() => {
          statusMessage.innerHTML =
            "Click the button above to get started. This extension only works on the SuFO/KIFO/Entrace Survey/Exit Survey page.";
          status.classList.remove("alert-danger");
          status.classList.add("alert-primary");
        }, 3000);

        return;
      }

      // Set the max value of the slider based on the survey type
      if (surveyType === "sufo") {
        document.getElementById("userOption").max = "4";
      } else {
        document.getElementById("userOption").max = "5";
      }

      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: start,
        args: [surveyType, userOption], // pass userOption to start function
      });

      let button = document.getElementById("start");
      let status = document.getElementById("status");
      let statusMessage = document.getElementById("status-message");
      statusMessage.innerHTML = "Done!";
      status.classList.remove("alert-primary");
      status.classList.add("alert-success");
      button.blur();

      // make the background green for 3 seconds
      setTimeout(() => {
        statusMessage.innerHTML =
          "Click the button above to get started. This extension only works on the SuFO/KIFO/Entrace Survey/Exit Survey page.";
        status.classList.remove("alert-success");
        status.classList.add("alert-primary");
      }, 3000);
    });
  });
});

function start(surveyType, userOption) {
  // It selects all the radio input elements and clicks them
  let radios = document.querySelectorAll("input[type='radio']");
  for (let i = 0; i < radios.length; i++) {
    // get value of the radio input
    let value = radios[i].value;
    if (parseInt(value) === parseInt(userOption)) { // check if the value matches userOption
      radios[i].click();
    }
  }

  // click the submit button after everything is done
  let buttons = document.querySelectorAll("button");
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].innerText === "Submit") {
      buttons[i].click();
      break;
    }
  }
}
