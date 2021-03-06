"use strict";

const kTestPath = getRootDirectory(gTestPath)
                  .replace("chrome://mochitests/content", "http://example.com")
const kTestURI = kTestPath + "file_data_download.html";

function addWindowListener(aURL, aCallback) {
  Services.wm.addListener({
    onOpenWindow(aXULWindow) {
      info("window opened, waiting for focus");
      Services.wm.removeListener(this);
      var domwindow = aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor)
                                .getInterface(Ci.nsIDOMWindow);
      waitForFocus(function() {
        is(domwindow.document.location.href, aURL, "should have seen the right window open");
        aCallback(domwindow);
      }, domwindow);
    },
    onCloseWindow(aXULWindow) { },
    onWindowTitleChange(aXULWindow, aNewTitle) { }
  });
}

function test() {
  waitForExplicitFinish();
  Services.prefs.setBoolPref("security.data_uri.block_toplevel_data_uri_navigations", true);
  registerCleanupFunction(function() {
    Services.prefs.clearUserPref("security.data_uri.block_toplevel_data_uri_navigations");
  });
  addWindowListener("chrome://mozapps/content/downloads/unknownContentType.xul", function(win) {
    is(win.document.getElementById("location").value, "data-foo.html",
       "file name of download should match");
     win.close();
     finish();
  });
  gBrowser.loadURI(kTestURI);
}
