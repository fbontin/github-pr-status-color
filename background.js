const isFirefox = typeof InstallTrigger !== 'undefined';
const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

let b;
if (isFirefox) {
  b = browser;
} else if (isChrome) {
  b = chrome;
} else {
  throw Error('No compatible browser found');
}

function shouldAddCss(url) {
  const { hostname, pathname } = (new URL(url));
  const isOnGithub = hostname === "github.com";
  const isPRView = pathname.includes("/pulls");

  return isOnGithub && isPRView;
}

function addCss(tab) {
  if (shouldAddCss(tab.url)) {
    const CSS = `
      a[aria-label*='Review required'] {
        color: rgb(84, 163, 255) !important;
      }
      a[aria-label*='review approval'] {
        color: rgb(86, 211, 100) !important;
      }
      a[aria-label*='requesting changes'] {
        color: rgb(227, 179, 65) !important;
      }
    `;

    b.tabs.insertCSS(tab.id, { code: CSS });
  }
}

/*
Initialize the page action: set icon and title, then show.
Only operates on tabs whose URL's protocol is applicable.
*/
function initializePageAction(tab) {
  addCss(tab);
}

/*
When first loaded, initialize the page action for all tabs.
*/
const addCssOnTabs = (tabs) => {
  for (let tab of tabs) {
    addCss(tab);
  }
}

if (isFirefox) {
  b.tabs.query({}).then(addCssOnTabs);
} else {
  b.tabs.query({}, addCssOnTabs);
}

/*
Each time a tab is updated, reset the page action for that tab.
*/
b.tabs.onUpdated.addListener((_id, _changeInfo, tab) => {
  initializePageAction(tab);
});
