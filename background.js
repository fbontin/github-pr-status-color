function shouldAddCss(url) {
  const { hostname, pathname } = (new URL(url));

  const isOnGithub = hostname === "github.com";
  const isPRView = pathname.includes("/pulls");

  return isOnGithub && isPRView;
}

function addCSS(tab) {
  if (shouldAddCss(tab.url)) {
    const CSS = `
      a[aria-label*='Review required'] {
        color: rgb(227, 179, 65) !important;
      }
      a[aria-label*='review approval'] {
        color: rgb(86, 211, 100) !important;
      }
      a[aria-label*='requesting changes'] {
        color: rgb(84, 163, 255) !important;
      }
    `;

    browser.tabs.insertCSS(tab.id, { code: CSS });
  }
}

/*
Initialize the page action: set icon and title, then show.
Only operates on tabs whose URL's protocol is applicable.
*/
function initializePageAction(tab) {
  addCSS(tab);
}

/*
When first loaded, initialize the page action for all tabs.
*/
var gettingAllTabs = browser.tabs.query({});
gettingAllTabs.then((tabs) => {
  for (let tab of tabs) {
    addCSS(tab);
  }
});

/*
Each time a tab is updated, reset the page action for that tab.
*/
browser.tabs.onUpdated.addListener((_id, _changeInfo, tab) => {
  initializePageAction(tab);
});
