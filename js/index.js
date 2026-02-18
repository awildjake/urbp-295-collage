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
function createImagePopup(imageUrl, captionText) {
    // Create popup container
    var popupContainer = document.createElement('div');
    popupContainer.className = 'popup-container';
    
    // Create close button
    var closeBtn = document.createElement('button');
    closeBtn.className = 'popup-close-btn';
    closeBtn.innerHTML = '×';
    
    // Create image
    var img = document.createElement('img');
    img.className = 'popup-image';
    img.src = imageUrl;
    
    // Create caption
    var caption = document.createElement('p');
    caption.className = 'popup-caption';
    caption.textContent = captionText;

    // Adjust caption width to match image width after image loads
    img.addEventListener('load', function() {
        // Get the actual rendered width of the image
        var imageWidth = img.offsetWidth;
        // Set caption width to match (subtract border width: 16px total)
        caption.style.width = (imageWidth - 16) + 'px';
    });

    // Create overlay background
    var overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    
    // Close popup function
    function closePopup() {
        document.body.removeChild(popupContainer);
        document.body.removeChild(overlay);
    }
    
    closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', closePopup);
    
    // Assemble and add to page
    popupContainer.appendChild(closeBtn);
    popupContainer.appendChild(img);
    popupContainer.appendChild(caption);
    document.body.appendChild(overlay);
    document.body.appendChild(popupContainer);
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
    
    imageOverlay.on('click', function() {
        createImagePopup(overlayData.popupImageUrl, overlayData.caption);
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

var imageUrlInter = 'https://res.cloudinary.com/do0ehwhde/image/upload/v1771279957/Picture1_cnopt5.jpg',
    imageBoundsInter = [[37.37572907, -121.88927114], [37.37307943, -121.88712537]];

var imageInter = L.imageOverlay(imageUrlInter, imageBoundsInter, {
    opacity: 1,
    interactive: true
}).addTo(map);

var imageUrlInter2 = 'https://res.cloudinary.com/do0ehwhde/image/upload/v1771279962/Picture2_bwyyrm.jpg',
    imageBoundsInter2 = [[37.37572907, -121.88698537], [37.37307943, -121.88483960]];

var imageInter2 = L.imageOverlay(imageUrlInter2, imageBoundsInter2, {
    opacity: 1,
    interactive: true
}).addTo(map);

var imageUrlInter3 = 'https://res.cloudinary.com/do0ehwhde/image/upload/v1771279968/Picture3_lakbgv.jpg',
    imageBoundsInter3 = [[37.37572907, -121.88469960], [37.37307943, -121.88255383]];

var imageInter3 = L.imageOverlay(imageUrlInter3, imageBoundsInter3, {
    opacity: 1,
    interactive: true
}).addTo(map);




var imageUrlInter5 = 'https://res.cloudinary.com/do0ehwhde/image/upload/v1771026586/IMG_7_famvqv.jpg',
    imageBoundsInter5 = [[37.36816834, -121.88135058], [37.36759989, -121.88027769]];

var imageUrlInter6 = 'https://res.cloudinary.com/do0ehwhde/image/upload/v1771026586/IMG_7_famvqv.jpg',
    imageBoundsInter6 = [[37.36735474, -121.88026428], [37.36645089, -121.87855840]];



var style = document.createElement('style');
style.textContent = `
    .collage-image:hover {
        opacity: 1 !important;
        z-index: 1000 !important;
    }
`;
document.head.appendChild(style);

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
    <iframe 
        src='https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=v2%3A2PACX-1vTbDKn39-sYNOPZWwXFyUWHf5C7R8eTznAKUFD422CxmmLrsvP3eZznIjTWKtHONIStgTGfkFVR-SUa&amp;font=Default&amp;lang=en&amp;initial_zoom=2&amp;width=100%25&amp;height=650'
        width='100%' 
        height='100%'
        webkitallowfullscreen mozallowfullscreen allowfullscreen frameborder='0'>
    </iframe>
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
    .addTo(map)
    .on('click', openTimeline);

    