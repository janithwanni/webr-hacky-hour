// Configure the Monaco Editor's loader
  require.config({
    paths: {
      'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.31.0/min/vs'
    }
  });


  // Start a timer
  const initializeWebRTimerStart = performance.now();

  // Determine if we need to install R packages
  var installRPackagesList = [''];
  // Check to see if we have an empty array, if we do set to skip the installation.
  var setupRPackages = !(installRPackagesList.indexOf("") !== -1);

  // Display a startup message?
  var showStartupMessage = true;
  var showHeaderMessage = false;
  if (showStartupMessage) {

    // Create the outermost div element
    var quartoTitleMeta = document.createElement("div");
    quartoTitleMeta.classList.add("quarto-title-meta");

    // Create the first inner div element
    var firstInnerDiv = document.createElement("div");

    // Create the second inner div element with "WebR Status" heading 
    // and contents
    var secondInnerDiv = document.createElement("div");
    secondInnerDiv.classList.add("quarto-title-meta-heading");
    secondInnerDiv.innerText = "WebR Status";

    // Add another inner div
    var secondInnerDivContents = document.createElement("div");
    secondInnerDivContents.classList.add("quarto-title-meta-contents");

    // Describe the WebR state
    var startupMessageWebR = document.createElement("p");
    startupMessageWebR.innerText = "🟡 Loading...";
    startupMessageWebR.setAttribute("id", "startup");
    // Add `aria-live` to auto-announce the startup status to screen readers
    startupMessageWebR.setAttribute("aria-live", "assertive");

    // Put everything together
    secondInnerDivContents.appendChild(startupMessageWebR);

    // Add a status indicator for COOP and COEP Headers
    if (showHeaderMessage) {
      var crossOriginMessage = document.createElement("p");
      crossOriginMessage.innerText = `${crossOriginIsolated ? '🟢' : '🟡'} COOP & COEP Headers`;
      crossOriginMessage.setAttribute("id", "coop-coep-header");
      secondInnerDivContents.appendChild(crossOriginMessage);
    }

    firstInnerDiv.appendChild(secondInnerDiv);
    firstInnerDiv.appendChild(secondInnerDivContents);
    quartoTitleMeta.appendChild(firstInnerDiv);

    // Add new element as last child in header element
    var header = document.getElementById("webr-status")
    header.appendChild(quartoTitleMeta);
  }

  // Retrieve the webr.mjs
  import { WebR } from "https://webr.r-wasm.org/v0.2.0/webr.mjs";

  // Populate WebR options with defaults or new values based on 
  // webr meta
  globalThis.webR = new WebR({
    "baseURL": "",
    "serviceWorkerUrl": "",
    "homedir": "/home/web_user"
  });

  // Initialization WebR
  await globalThis.webR.init();

  // Setup a shelter
  globalThis.webRCodeShelter = await new globalThis.webR.Shelter();

  // Installing Packages
  if (showStartupMessage && setupRPackages) {
    // If initialized, but we have packages to install switch status
    startupMessageWebR.innerText = "🟡 Installing package dependencies..."
    // Install packages
    await globalThis.webR.installPackages(installRPackagesList)
  }

  // Switch to allowing code to be executed
  document.querySelectorAll(".btn-webr").forEach((btn) => {
    btn.innerText = "Run code";
    btn.disabled = false;
  });

  // Stop timer
  const initializeWebRTimerEnd = performance.now();

  if (showStartupMessage) {
    // If initialized, switch to a green light
    startupMessageWebR.innerText = "🟢 Ready!"
  }