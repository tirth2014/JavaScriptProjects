function storageQuotaChromePrivateTest() {
    navigator.webkitTemporaryStorage.queryUsageAndQuota(
        function (_, quota) {
            var quotaInMib = Math.round(quota / (1024 * 1024));
            var quotaLimitInMib = Math.round(getQuotaLimit() / (1024 * 1024)) * 2;

            __callback(quotaInMib < quotaLimitInMib);
        },
        function (e) {
            console.error(
                new Error(
                    'detectIncognito somehow failed to query storage quota: ' +
                    e.message
                )
            );
        }
    );
}

// For Chrome versions 50 to 75
function oldChromePrivateTest() {
    var fs = window.webkitRequestFileSystem;
    var success = function () {
        __callback(false);
    };
    var error = function () {
        __callback(true);
    };
    fs(0, 1, success, error);
}

function chromePrivateTest() {
    if (self.Promise !== undefined && self.Promise.allSettled !== undefined) {
        storageQuotaChromePrivateTest();
    } else {
        oldChromePrivateTest();
    }
}

// Helper function
function __callback(isIncognito) {
    if (isIncognito) {
        console.log("The window is in Incognito mode.");
    } else {
        console.log("The window is NOT in Incognito mode.");
    }
}


function getQuotaLimit() {
    var w = window;
    if (
        w.performance !== undefined &&
        w.performance.memory !== undefined &&
        w.performance.memory.jsHeapSizeLimit !== undefined
    ) {
        return w.performance.memory.jsHeapSizeLimit;
    }
    return 1073741824; // Default to 1 GB if not available
}



// Call the test function
chromePrivateTest();
