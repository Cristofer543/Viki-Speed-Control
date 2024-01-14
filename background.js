chrome.commands.onCommand.addListener(function(command) {
  if (command === 'increase-speed') {
    increaseSpeed(); // Llama a la función para aumentar la velocidad
  } else if (command === 'decrease-speed') {
    decreaseSpeed(); // Llama a la función para disminuir la velocidad
  } else if (command === 'reset-speed') {
    resetSpeed(); // Llama a la función para restablecer la velocidad
  }
});

function increaseSpeed() {
  // Aumenta la velocidad en 0.1x
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: () => {
        let videoElement = document.querySelector('video');
        if (videoElement) {
          videoElement.playbackRate = Math.min(videoElement.playbackRate + 0.1, 2.0);
        }
      }
    });
  });
}

function decreaseSpeed() {
  // Disminuye la velocidad en 0.1x
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: () => {
        let videoElement = document.querySelector('video');
        if (videoElement) {
          videoElement.playbackRate = Math.max(videoElement.playbackRate - 0.1, 0.1);
        }
      }
    });
  });
}

function resetSpeed() {
  // Restablece la velocidad a 1.0x
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: () => {
        let videoElement = document.querySelector('video');
        if (videoElement) {
          videoElement.playbackRate = 1.0;
        }
      }
    });
  });
}
