// Initialize map
const map = L.map('map').setView([37.368567140269306, -121.87689414145946], 18);

map.createPane('trackPane');
map.getPane('trackPane').style.zIndex = 200; // overlayPane default is 400

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 21
}).addTo(map);

// Function to load and create overlays from JSON
function loadOverlaysFromJSON(jsonUrl, map) {
    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            data.overlays.forEach(overlayData => {
                createImageOverlay(overlayData, map);
            });
        })
        .catch(error => {
            console.error('Error loading overlays:', error);
        });
}

// Create a single shared layer group for all overlays
var overlayLayer = L.layerGroup();

// Constructor function to create individual overlay
function createImageOverlay(overlayData, map) {
    var imageBounds = [
        overlayData.bounds.northEast,
        overlayData.bounds.southWest
    ];
    
    var imageOverlay = L.imageOverlay(overlayData.imageUrl, imageBounds, {
        opacity: 1,
        interactive: true
    });
    
    imageOverlay.on('click', function() {
        playAudioWithFade(overlayData.soundUrl);
    });

    overlayLayer.addLayer(imageOverlay);

    // Add the layer group to the map if not already added
    if (!map.hasLayer(overlayLayer)) {
        overlayLayer.addTo(map);
    }
    
    return imageOverlay;
}

// Usage: Load all overlays
loadOverlaysFromJSON('assets/data/overlays.json', map);

// Reusable function to create image popup
function createImagePopup(images) {
    var currentIndex = 0;

    var overlay = document.createElement('div');
    overlay.className = 'popup-overlay';

    var popupContainer = document.createElement('div');
    popupContainer.className = 'popup-container';

    var closeBtn = document.createElement('button');
    closeBtn.className = 'popup-close-btn';
    closeBtn.innerHTML = '×';

    var img = document.createElement('img');
    img.className = 'popup-image';
    img.src = images[currentIndex].url;

    var caption = document.createElement('p');
    caption.className = 'popup-caption';

    img.addEventListener('load', function () {
        caption.style.width = (img.offsetWidth - 16) + 'px';
    });

    var prevBtn = document.createElement('button');
    prevBtn.className = 'popup-nav-btn popup-nav-prev';
    prevBtn.innerHTML = '&#8592;';

    var nextBtn = document.createElement('button');
    nextBtn.className = 'popup-nav-btn popup-nav-next';
    nextBtn.innerHTML = '&#8594;';

    var counter = document.createElement('span');
    counter.className = 'popup-counter';

    function updateSlide() {
        img.src = images[currentIndex].url;
        if (images[currentIndex].caption) {
            caption.textContent = images[currentIndex].caption;
            caption.style.display = '';
        } else {
            caption.textContent = '';
            caption.style.display = 'none';
        }
        counter.textContent = (currentIndex + 1) + ' / ' + images.length;
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === images.length - 1;
    }

    prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (currentIndex > 0) { currentIndex--; updateSlide(); }
    });

    nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (currentIndex < images.length - 1) { currentIndex++; updateSlide(); }
    });

    function closePopup() {
        document.body.removeChild(popupContainer);
        document.body.removeChild(overlay);
    }
    closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', closePopup);

    popupContainer.appendChild(closeBtn);

    if (images.length > 1) {
        var navWrapper = document.createElement('div');
        navWrapper.className = 'popup-nav-wrapper';
        navWrapper.appendChild(prevBtn);
        navWrapper.appendChild(img);
        navWrapper.appendChild(nextBtn);
        popupContainer.appendChild(navWrapper);

        counter.textContent = '1 / ' + images.length;
        popupContainer.appendChild(counter);
    } else {
        popupContainer.appendChild(img);
    }

    popupContainer.appendChild(caption);
    document.body.appendChild(overlay);
    document.body.appendChild(popupContainer);

    updateSlide(); // This now handles caption visibility correctly
}

// Create a single shared layer group for all interactive overlays
var interactiveOverlayLayer = L.layerGroup();

// Function to create an interactive overlay from data
function createInteractiveOverlay(overlayData, map) {
    var imageBounds = [
        overlayData.bounds.northEast,
        overlayData.bounds.southWest
    ];

    var imageOverlay = L.imageOverlay(overlayData.mapImageUrl, imageBounds, {
        opacity: 1,
        interactive: true,
        className: 'custom-overlay-shadow'
    });

    imageOverlay.on('click', function () {
        // Support both old single-image format and new array format
        var images = overlayData.popupImages || [{ url: overlayData.popupImageUrl, caption: overlayData.caption }];
        createImagePopup(images);
    });

    interactiveOverlayLayer.addLayer(imageOverlay);
    if (!map.hasLayer(interactiveOverlayLayer)) {
        interactiveOverlayLayer.addTo(map);
    }

    return imageOverlay;
}

// Load and create all interactive overlays from JSON
function loadInteractiveOverlays(jsonUrl, map) {
    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            data.interactiveOverlays.forEach(overlayData => {
                createInteractiveOverlay(overlayData, map);
            });
        })
        .catch(error => {
            console.error('Error loading interactive overlays:', error);
        });
}

// Load the interactive overlays
loadInteractiveOverlays('assets/data/interactive-overlays.json', map);

// Global audio management
var currentAudio = null;
var isFading = false;

// Function to get current slider volume
function getSliderVolume() {
    return document.getElementById('volumeSlider').value / 100;
}

// Function to play audio with fade out
function playAudioWithFade(audioFile) {
    // Stop any currently playing audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    
    // Create or reuse audio object
    if (!currentAudio || currentAudio.src !== audioFile) {
        currentAudio = new Audio(audioFile);
        
        // Add fade out listener
        currentAudio.addEventListener('timeupdate', function() {
            var fadeOutDuration = 3;
            var timeLeft = currentAudio.duration - currentAudio.currentTime;
            var sliderVolume = getSliderVolume();
            
            if (timeLeft <= fadeOutDuration && timeLeft > 0 && !currentAudio.paused) {
                isFading = true;
                currentAudio.volume = sliderVolume * (timeLeft / fadeOutDuration);
            } else if (!isFading) {
                currentAudio.volume = sliderVolume;
            }
        });
    }
    
    // Reset and play
    currentAudio.currentTime = 0;
    isFading = false;
    currentAudio.volume = getSliderVolume();
    currentAudio.play();
}

// Create volume control
L.Control.VolumeControl = L.Control.extend({
    onAdd: function(map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        
        container.style.backgroundColor = 'white';
        container.style.padding = '10px';
        container.style.borderRadius = '4px';
        container.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">🔊</span>
                <input type="range" min="0" max="100" value="50" 
                    style="width: 100px;" id="volumeSlider">
                <span id="volumeValue" style="font-size: 12px; min-width: 35px;">50%</span>
            </div>
        `;
        
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);
        
        return container;
    }
});

var volumeControl = new L.Control.VolumeControl({ position: 'topright' });
volumeControl.addTo(map);

// Connect slider to audio
document.getElementById('volumeSlider').addEventListener('input', function(e) {
    var volume = e.target.value / 100;
    if (currentAudio && !isFading) {
        currentAudio.volume = volume;
    }
    document.getElementById('volumeValue').textContent = e.target.value + '%';
});


// Navigation state
let mapLocations = [];
let currentLocationIndex = 0;

// Create Leaflet-style Navigation Control
L.Control.Navigation = L.Control.extend({
    onAdd: function(map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-navigation');
        
        this._prevButton = this._createButton('←', 'Previous location', container);
        this._counter = L.DomUtil.create('div', 'nav-counter', container);
        this._counter.innerHTML = '1 / ' + mapLocations.length;
        this._nextButton = this._createButton('→', 'Next location', container);
        
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);
        
        return container;
    },
    
    _createButton: function(html, title, container) {
        var link = L.DomUtil.create('a', '', container);
        link.innerHTML = html;
        link.href = '#';
        link.title = title;
        
        L.DomEvent.on(link, 'click', function(e) {
            L.DomEvent.stopPropagation(e);
            L.DomEvent.preventDefault(e);
        });
        
        return link;
    },
    
    updateCounter: function(index) {
        this._counter.innerHTML = (index + 1) + ' / ' + mapLocations.length;
    },
    
    updateButtons: function(index) {
        if (index === 0) {
            L.DomUtil.addClass(this._prevButton, 'disabled');
        } else {
            L.DomUtil.removeClass(this._prevButton, 'disabled');
        }
        
        if (index === mapLocations.length - 1) {
            L.DomUtil.addClass(this._nextButton, 'disabled');
        } else {
            L.DomUtil.removeClass(this._nextButton, 'disabled');
        }
    }
});

// Create navigation control (don't add to map yet)
var navigationControl = new L.Control.Navigation({ position: 'bottomleft' });

// Function to navigate to a specific location
function navigateToLocation(index) {
    if (index < 0 || index >= mapLocations.length) return;
    
    currentLocationIndex = index;
    const location = mapLocations[index];
    
    map.flyTo(location.center, location.zoom, {
        duration: 1.5,
        easeLinearity: 0.25
    });
    
    navigationControl.updateCounter(index);
    navigationControl.updateButtons(index);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentLocationIndex > 0) {
            navigateToLocation(currentLocationIndex - 1);
        }
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentLocationIndex < mapLocations.length - 1) {
            navigateToLocation(currentLocationIndex + 1);
        }
    }
});

// Load locations and initialize navigation
fetch('assets/data/locations.json')
    .then(res => res.json())
    .then(data => {
        mapLocations = data;
        navigationControl.addTo(map);

        // Button click handlers moved here so _prevButton/_nextButton exist
        L.DomEvent.on(navigationControl._prevButton, 'click', function() {
            if (currentLocationIndex > 0) {
                navigateToLocation(currentLocationIndex - 1);
            }
        });

        L.DomEvent.on(navigationControl._nextButton, 'click', function() {
            if (currentLocationIndex < mapLocations.length - 1) {
                navigateToLocation(currentLocationIndex + 1);
            }
        });

        navigateToLocation(0);
    })
    .catch(err => console.error('Failed to load locations.json:', err));

var layerControls = {
    "Static Overlays": overlayLayer,
    "Interactive Overlays": interactiveOverlayLayer
};

L.control.layers(null, layerControls).addTo(map);

// ── Timeline Popup ────────────────────────────────────────────────────────────

// Create the overlay and popup elements and add to the page
var timelineOverlay = document.createElement('div');
timelineOverlay.id = 'timeline-overlay';
document.body.appendChild(timelineOverlay);

var timelinePopup = document.createElement('div');
timelinePopup.id = 'timeline-popup';
timelinePopup.innerHTML = `
    <button id="timeline-close">✕</button>
    <iframe src='https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=v2%3A2PACX-1vTb-2UQYawiFZu50EvjxgMbmHHpGrHJADTOLM_nUEH_1az-czym2wHtAITuEz1r-SMrhCz1Fz456iT8&font=Default&lang=en&initial_zoom=0&width=100%25&height=650' width='100%' height='650' webkitallowfullscreen mozallowfullscreen allowfullscreen frameborder='0'></iframe>
`;
document.body.appendChild(timelinePopup);

function openTimeline() {
    timelineOverlay.classList.add('active');
    timelinePopup.classList.add('active');
}

function closeTimeline() {
    timelineOverlay.classList.remove('active');
    timelinePopup.classList.remove('active');
}

document.getElementById('timeline-close').addEventListener('click', closeTimeline);
timelineOverlay.addEventListener('click', closeTimeline); // click backdrop to close too

// ── Marker ────────────────────────────────────────────────────────────────────
var timelineMarker = L.marker([37.37022337, -121.88035548])
    .addTo(map).on('click', openTimeline);

var tapeUrl = 'https://res.cloudinary.com/do0ehwhde/image/upload/v1771449665/tape_georef_pffjzk.png',
    tapeBounds = [[37.36464244, -121.88138276], [37.36399438, -121.88024014]];

var tape = L.imageOverlay(tapeUrl, tapeBounds, {
    opacity: 1,
    zIndex: 500
}).addTo(map);

var audioIcon = L.divIcon({
    className: '',
    html: `<img src="assets/img/audio-icon.svg" style="width:48px;height:48px;cursor:pointer;
                filter: drop-shadow(0 0 6px rgba(255,242,0,0.9));
                transition: filter 0.2s ease;">`,
    iconSize: [48, 48],
    iconAnchor: [24, 24]
});

var audioMarker = L.marker([37.366918184866094, -121.87984443826947], { icon: audioIcon }).addTo(map);

audioMarker.on('click', function () {
    playAudioWithFade('https://res.cloudinary.com/do0ehwhde/video/upload/v1771526698/BerryessaFleaMarketAudio_bhujog.mp3');
});

var minZoom = 17; // adjust to your preference

function updateAudioMarkerVisibility() {
    if (map.getZoom() >= minZoom) {
        if (!map.hasLayer(audioMarker)) {
            audioMarker.addTo(map);
        }
    } else {
        if (map.hasLayer(audioMarker)) {
            map.removeLayer(audioMarker);
        }
    }
}

// Run on zoom change and on initial load
map.on('zoomend', updateAudioMarkerVisibility);
updateAudioMarkerVisibility();

map.on('click', function (e) {
    console.log(e.latlng.lat + ', ' + e.latlng.lng);
});