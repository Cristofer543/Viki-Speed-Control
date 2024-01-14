document.addEventListener('DOMContentLoaded', function() {
  // Asegúrate de que los elementos HTML estén presentes en popup.html
  const increaseSpeedButton = document.getElementById('increaseSpeed');
  const decreaseSpeedButton = document.getElementById('decreaseSpeed');
  const resetSpeedButton = document.getElementById('resetSpeed');
  const customSpeedInput = document.getElementById('customSpeed');
  const setCustomSpeedButton = document.getElementById('setCustomSpeed');
  const speedDisplay = document.getElementById('speedDisplay');

  let originalPlaybackRate = 1.0; // Valor original de velocidad de reproducción
  let playbackRate = originalPlaybackRate; // Inicializamos la velocidad de reproducción

  // Función para actualizar y mostrar la velocidad actual
  function updateSpeedDisplay() {
    speedDisplay.textContent = playbackRate.toFixed(1) + 'x';
  }

  // Función para aplicar la velocidad de reproducción al elemento de video
function setVideoPlaybackRate(rate) {

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: (rate) => {
          let videoElement = document.querySelector('video');
          if (videoElement) {
            videoElement.playbackRate = rate;
          }
        },
        args: [playbackRate] // Pasamos la velocidad de reproducción como argumento
      });
    });
  }
  document.addEventListener('DOMContentLoaded', function() {
  // Aquí puedes usar setVideoPlaybackRate
});

// Ahora setVideoPlaybackRate es accesible desde aquí también
chrome.storage.sync.get(['customSpeed'], function(result) {
  if (result.customSpeed) {
    setVideoPlaybackRate(result.customSpeed);
  }
});

  // Función para resamplear el audio
  function resampleAudio(audioContext, audioBuffer, rate) {
    let audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;

    // Cambiar la velocidad de reproducción del audio
    audioSource.playbackRate.value = rate;

    return audioSource;
  }

  // Función para cambiar la velocidad del audio
  function setAudioSpeed(speed) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: (rate) => {
          let audioContext = new (window.AudioContext || window.webkitAudioContext)();
          let audioElement = document.querySelector('audio');

          if (audioElement) {
            fetch(audioElement.src)
              .then(response => response.arrayBuffer())
              .then(data => audioContext.decodeAudioData(data))
              .then(audioBuffer => {
                let resampledAudio = resampleAudio(audioContext, audioBuffer, rate);
                resampledAudio.connect(audioContext.destination);
                resampledAudio.start();
              });
          }
        },
        args: [speed] // Pasamos la velocidad de reproducción como argumento
      });
    });
  }

  // Añade un evento al botón de acelerar
  increaseSpeedButton.addEventListener('click', function() {
    playbackRate += 0.1; // Aumenta la velocidad en 0.1x
    playbackRate = Math.min(playbackRate, 5.0); // Limita la velocidad máxima a 2.0x
    updateSpeedDisplay(); // Actualiza la velocidad de reproducción en la interfaz
    setVideoPlaybackRate();
    setAudioSpeed(playbackRate); // Ajusta la velocidad del audio
  });

  // Añade un evento al botón de ralentizar
  decreaseSpeedButton.addEventListener('click', function() {
    playbackRate -= 0.1; // Reduce la velocidad en 0.1x
    playbackRate = Math.max(playbackRate, 0.1); // Limita la velocidad mínima a 0.1x
    updateSpeedDisplay(); // Actualiza la velocidad de reproducción en la interfaz
    setVideoPlaybackRate();
    setAudioSpeed(playbackRate); // Ajusta la velocidad del audio
  });

  // Añade un evento al botón de restablecer
  resetSpeedButton.addEventListener('click', function() {
    playbackRate = originalPlaybackRate; // Restablece la velocidad a su valor original
    updateSpeedDisplay(); // Actualiza la velocidad de reproducción en la interfaz
    setVideoPlaybackRate();
    setAudioSpeed(playbackRate); // Ajusta la velocidad del audio
  });

  // Añade un evento al botón de establecer velocidad personalizada
  setCustomSpeedButton.addEventListener('click', function() {
    const customSpeed = parseFloat(customSpeedInput.value);
    if (!isNaN(customSpeed) && customSpeed >= 0.1 && customSpeed <= 5.0) {
      playbackRate = customSpeed; // Establece la velocidad personalizada
      updateSpeedDisplay(); // Actualiza la velocidad de reproducción en la interfaz
      setVideoPlaybackRate();
      setAudioSpeed(playbackRate); // Ajusta la velocidad del audio
    } else {
      alert('Ingresa una velocidad personalizada válida entre 0.1x y 5.0x');
    }
  });

  // Actualiza la velocidad de reproducción inicial en la interfaz
  updateSpeedDisplay();
});



document.addEventListener('DOMContentLoaded', function() {
  const increaseSpeedButton = document.getElementById('increaseSpeed');
  const decreaseSpeedButton = document.getElementById('decreaseSpeed');

  // Añade un evento al botón de acelerar
  increaseSpeedButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: () => {
          // Intenta obtener el elemento de video
          let videoElement = document.querySelector('video');
          
          // Si no se encuentra un elemento de video, créalo y agréguelo al cuerpo del documento
          if (!videoElement) {
            videoElement = document.createElement('video');
            document.body.appendChild(videoElement);
          }
          
          // Cambiar la velocidad de reproducción a 1.5x
          videoElement.playbackRate = videoElement.playbackRate + 0.1;
        }
      });
    });
  });

  // Añade un evento al botón de ralentizar
  decreaseSpeedButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: () => {
          // Intenta obtener el elemento de video
          let videoElement = document.querySelector('video');
          
          // Si no se encuentra un elemento de video, créalo y agréguelo al cuerpo del documento
          if (!videoElement) {
            videoElement = document.createElement('video');
            document.body.appendChild(videoElement);
          }
          
          // Cambiar la velocidad de reproducción a 0.5x
          videoElement.playbackRate = videoElement.playbackRate - 0.1;
        }
      });
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Asegúrate de que los elementos HTML estén presentes en popup.html
  const decreaseSpeedButton = document.getElementById('decreaseSpeed');
  
  let originalPlaybackRate = 1.0; // Valor original de velocidad de reproducción
  let playbackRate = originalPlaybackRate; // Inicializamos la velocidad de reproducción

  // Función para aplicar la velocidad de reproducción al elemento de video
  function setVideoPlaybackRate() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: (rate) => {
          let videoElement = document.querySelector('video');
          if (videoElement) {
            videoElement.playbackRate = rate;
          }
        },
        args: [playbackRate] // Pasamos la velocidad de reproducción como argumento
      });
    });
  }

  // Función para cambiar la velocidad del audio
  function setAudioSpeed(speed) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: (rate) => {
          let audioContext = new (window.AudioContext || window.webkitAudioContext)();
          let audioElement = document.querySelector('audio');

          if (audioElement) {
            let source = audioContext.createMediaElementSource(audioElement);
            let gainNode = audioContext.createGain();
            source.connect(gainNode);
            gainNode.connect(audioContext.destination);
            gainNode.gain.value = rate;
          }
        },
        args: [speed] // Pasamos la velocidad de reproducción como argumento
      });
    });
  }

  // Añade un evento al botón de ralentizar
  decreaseSpeedButton.addEventListener('click', function() {
    playbackRate -= 0.1; // Reduce la velocidad en 0.1x
    setVideoPlaybackRate();
    setAudioSpeed(playbackRate); // Ajusta la velocidad del audio
  });

});
// Función para añadir los controles de velocidad al menú de configuraciones
function addSpeedControls() {
  // Encuentra el menú de configuración por su clase
  const settingsMenu = document.querySelector('.vmp-player-settings-menu');

  if (settingsMenu) {
    // Funciones para controlar la velocidad de reproducción
    const videoElement = document.querySelector('video'); // Asegúrate de que este selector obtenga el video correcto

    function increaseSpeed() {
      if (videoElement) videoElement.playbackRate = Math.min(videoElement.playbackRate + 0.25, 2); // Limita a 2x
    }

    function decreaseSpeed() {
      if (videoElement) videoElement.playbackRate = Math.max(videoElement.playbackRate - 0.25, 0.5); // Limita a 0.5x
    }

    function resetSpeed() {
      if (videoElement) videoElement.playbackRate = 1;
    }

    // Crear y añadir botones al menú
    function createMenuItem(text, handler) {
      const menuItem = document.createElement('div');
      menuItem.textContent = text;
      menuItem.style.padding = '8px 16px'; // Asume que este es el estilo deseado
      menuItem.style.cursor = 'pointer';
      menuItem.addEventListener('click', handler);
      return menuItem;
    }

    // Añadir botones de "Ralentizar", "Acelerar" y "Restablecer"
    settingsMenu.appendChild(createMenuItem('Ralentizar', decreaseSpeed));
    settingsMenu.appendChild(createMenuItem('Acelerar', increaseSpeed));
    settingsMenu.appendChild(createMenuItem('Restablecer', resetSpeed));
  }
}

// Asegúrate de llamar a esta función cuando el menú ya esté en el DOM
// Esto podría ser después de un evento como 'DOMContentLoaded' o un 'MutationObserver'
// si el menú se carga dinámicamente
addSpeedControls();
function addSpeedControls() {
  // Encuentra el menú de configuraciones de Viki por su clase
  const settingsMenu = document.querySelector('.vmp-player-settings-menu');

  if (settingsMenu) {
    // Funciones para controlar la velocidad de reproducción
    const videoElement = document.querySelector('video'); // Asegúrate de que este selector obtenga el video correcto

    function increaseSpeed() {
      if (videoElement) videoElement.playbackRate = Math.min(videoElement.playbackRate + 0.25, 2); // Limita a 2x
    }

    function decreaseSpeed() {
      if (videoElement) videoElement.playbackRate = Math.max(videoElement.playbackRate - 0.25, 0.5); // Limita a 0.5x
    }

    function resetSpeed() {
      if (videoElement) videoElement.playbackRate = 1;
    }

    // Crear y añadir botones al menú
    function createMenuItem(text, handler) {
      const menuItem = document.createElement('div');
      menuItem.textContent = text;
      menuItem.classList.add('sc-hlLBRy', 'dCeuqH'); // Asume que estas son las clases de estilo para elementos de menú
      menuItem.style.cursor = 'pointer';
      menuItem.addEventListener('click', handler);
      return menuItem;
    }

    // Añadir botones de "+ Acelerar", "- Ralentizar" y "Restablecer"
    settingsMenu.appendChild(createMenuItem('+ Acelerar', increaseSpeed));
    settingsMenu.appendChild(createMenuItem('- Ralentizar', decreaseSpeed));
    settingsMenu.appendChild(createMenuItem('Restablecer', resetSpeed));
  }
}

// Luego, debes asegurarte de ejecutar addSpeedControls cuando el menú esté disponible en el DOM.
// Puedes intentar ejecutarlo después de que se haya cargado el sitio o usar MutationObserver si el menú se carga dinámicamente.
// Para guardar la velocidad de reproducción
function savePlaybackRate(rate) {
  chrome.storage.sync.set({ 'playbackRate': rate }, function() {
    console.log('Playback rate saved: ' + rate);
  });
}

// Para aplicar la velocidad de reproducción guardada cuando se carga un nuevo video
function applySavedPlaybackRate() {
  chrome.storage.sync.get(['playbackRate'], function(result) {
    if (result.playbackRate) {
      const videoElement = document.querySelector('video');
      if (videoElement) {
        videoElement.playbackRate = result.playbackRate;
      }
    }
  });
}

// Asegúrate de llamar a applySavedPlaybackRate cuando el documento esté listo o cuando se cargue un nuevo video
// Esta función puede ser llamada desde la interfaz de usuario de la extensión
function setCustomPlaybackRate(customRate) {
  const videoElement = document.querySelector('video');
  if (videoElement) {
    videoElement.playbackRate = customRate;
    savePlaybackRate(customRate); // Reutiliza la función de guardar la velocidad
  }
}

// Necesitarás una interfaz de usuario donde los usuarios puedan ingresar su velocidad personalizada y una función que llame a setCustomPlaybackRate
let message = chrome.i18n.getMessage("Viki Speed Control");
// En tu script popup.js o en el script donde manejas la velocidad personalizada
document.getElementById('setCustomSpeed').addEventListener('click', function() {
    const customSpeed = parseFloat(document.getElementById('customSpeed').value);
    if (!isNaN(customSpeed) && customSpeed >= 0.1 && customSpeed <= 3.0) {
        chrome.storage.sync.set({'customSpeed': customSpeed}, function() {
            console.log('Custom speed saved: ' + customSpeed);
        });
    } else {
        alert('Ingresa una velocidad personalizada válida entre 0.1x y 3.0x');
    }
});
