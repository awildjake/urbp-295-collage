// Initialize map
const map = L.map('map').setView([37.368567140269306, -121.87689414145946], 18);

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

// Constructor function to create individual overlay
function createImageOverlay(overlayData, map) {
    var imageBounds = [
        overlayData.bounds.northEast,
        overlayData.bounds.southWest
    ];
    
    var imageOverlay = L.imageOverlay(overlayData.imageUrl, imageBounds, {
        opacity: 1,
        interactive: true
    }).addTo(map);
    
    imageOverlay.on('click', function() {
        playAudioWithFade(overlayData.soundUrl);
    });
    
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

/*
Interactive overlay popup images go here
*/

// Popup 1
var imageUrlInter1 = 'https://res.cloudinary.com/do0ehwhde/image/upload/v1771268371/Asset_4_drtycr.png',
    imageBoundsInter1 = [[37.37099065, -121.87870059], [37.37046218, -121.87834110]];

var imageInter1 = L.imageOverlay(imageUrlInter1, imageBoundsInter1, {
    opacity: 1,
    interactive: true,
    className: 'custom-overlay-shadow'
}).addTo(map);

var imageUrlInter2 = 'https://res.cloudinary.com/do0ehwhde/image/upload/v1771269312/IMG_3091_e9pwvl.jpg';

imageInter1.on('click', function() {
    createImagePopup(
        imageUrlInter2,
        'North of the Berryessa Flea Market, a mixed use housing complex occupies what was once an additional parking lot for the market.'
    );
});

// Popup 2
var imageUrlInter3 = 'https://res.cloudinary.com/do0ehwhde/image/upload/v1771271693/Asset_2_kydax3.png',
    imageBoundsInter3 = [[37.36953794, -121.87663206], [37.36928326, -121.87634877]];

var imageInter3 = L.imageOverlay(imageUrlInter3, imageBoundsInter3, {
    opacity: 1,
    interactive: true,
    className: 'custom-overlay-shadow'
}).addTo(map);

var imageUrlInter4 = 'https://res.cloudinary.com/do0ehwhde/image/upload/v1771271713/IMG_3143_l12ze8.jpg';

imageInter3.on('click', function() {
    createImagePopup(
        imageUrlInter4,
        "These hats feature the names of 8 Mexican states, they are adorned in the traditional \"Piteado\" style which typically consists of embroidered leather."
    );
});

// Popup 3
var imageUrlInter5 = 'https://res.cloudinary.com/do0ehwhde/image/upload/v1771268861/Asset_1_wjwdor.png',
    imageBoundsInter5 = [[37.36943227, -121.87799916], [37.36889410, -121.87743321]];

var imageInter5 = L.imageOverlay(imageUrlInter5, imageBoundsInter5, {
    opacity: 1,
    interactive: true,
    className: 'custom-overlay-shadow'
}).addTo(map);

var imageUrlInter6 = 'https://res.cloudinary.com/do0ehwhde/image/upload/v1771272128/IMG_3155_zjguol.jpg';

imageInter5.on('click', function() {
    createImagePopup(
        imageUrlInter6,
        "Traditional Mexican wares include \"cantaro\" clay pottery and different versions of the Virgin Mary."
    );
});

// Popup 4
/*
var imageUrlInter7 = '', // Replace with your hosted image URL
    imageBoundsInter7 = [[37.37092812, -121.88146591], [37.36820387, -121.87829018]];

var imageInter7 = L.imageOverlay(imageUrlInter7, imageBoundsInter7, {
    opacity: 1,
    interactive: true,
    className: 'custom-overlay-shadow'
}).addTo(map);

var imageInter8 = ''

imageInter7.on('click', function() {
    createImagePopup(
        imageUrlInter8,
        "Traditional Mexican wares include \"cantaro\" clay pottery and different versions of the Virgin Mary."
    );
});
*/

/*
End of interactive overlay popup images
*/

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

// Define your locations array (customize these!)
const mapLocations = [
    {
        name: "Overview",
        center: [37.368567140269306, -121.87689414145946],
        zoom: 18
    },
    {
        name: "North Housing Complex",
        center: [37.37072641, -121.87852084],
        zoom: 20
    },
    {
        name: "Hat Vendor",
        center: [37.36940560, -121.87649041],
        zoom: 21
    },
    {
        name: "Traditional Wares",
        center: [37.36916318, -121.87771618],
        zoom: 20
    },
    {
        name: "Full Market View",
        center: [37.36956549, -121.87987804],
        zoom: 17
    }
];

// Navigation state
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

// Add navigation control to map
var navigationControl = new L.Control.Navigation({ position: 'bottomleft' });
navigationControl.addTo(map);

// Function to navigate to a specific location
function navigateToLocation(index) {
    if (index < 0 || index >= mapLocations.length) return;
    
    currentLocationIndex = index;
    const location = mapLocations[index];
    
    // Animate map to new location
    map.flyTo(location.center, location.zoom, {
        duration: 1.5,
        easeLinearity: 0.25
    });
    
    // Update navigation control
    navigationControl.updateCounter(index);
    navigationControl.updateButtons(index);
}

// Button click handlers
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

// Initialize navigation
navigateToLocation(0);