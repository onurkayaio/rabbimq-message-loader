let oldHref = document.location.href;

window.onload = function () {
  run();

  let bodyList = document.querySelector('body'), observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (oldHref != document.location.href) {
        oldHref = document.location.href;

        run();
      }
    });
  });

  let config = {
    childList: true,
    subtree: true
  };

  observer.observe(bodyList, config);
};

function run() {
  if (!checkCurrentPathIsAvailableToLoad(window.location.href)) {
    console.info('current page is not available to load message.');

    return;
  }

  preparePayload();
}

function preparePayload() {
  console.log('started to load payload.');

  setTimeout(function () {
    let splitPath = window.location.href.split('/');
    let currentQueue = splitPath[splitPath.length - 1];

    let payloadForm;

    $('form').each(function () {
      if ('#/exchanges/publish' == $(this).attr('action')) {
        payloadForm = $(this);

        var html = '<button style="margin-top: 5px" id="upload-payload">Load Message</button>';
        $(this).parent().parent().append(html);
      }
    });

    $('#upload-payload').click(function () {
      const payloadPath = 'payloads/' + currentQueue + '.json';
      const url = chrome.runtime.getURL(payloadPath);

      fetch(url)
        .then((response) => response.text())
        .then((json) => {
          $(payloadForm[0][11]).val(json);
        })
        .catch(error => {
          if ($(document).find('#error-message').length === 0) {
            $(document).find('#upload-payload').append('<span style="padding-left: 30px; color: white" id="error-message">' + error + '</span>');
          }
        });
    });

  }, 500);
}

function checkCurrentPathIsAvailableToLoad(path) {
  const availablePaths = ['exchanges/%2F', 'queues/%2F'];
  let isAvailable = false;

  availablePaths.forEach(function (value) {
    if (path.indexOf(value) >= 0) {
      isAvailable = true;
    }
  });

  return isAvailable;
}
