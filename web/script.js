"use strict";

const localImageTab = document.getElementById("localImageTab");
const satelliteTab = document.getElementById("satelliteTab");
const searchBox = document.getElementById("searchBox")
const radioButtons = document.querySelectorAll(".radioButton");

let selectedRadioButton = document.querySelector(".radioButton.selected");
let currentTab = document.querySelector(".tab.selected");
let map;

initTabs();
initButtonPanel();
initDialogs();
initFileSelect();

// Adds functionality to tabs that allows for switching between the file
// select window and satellite image window.
function initTabs() {
    const fileSelect = document.getElementById("fileSelect");

    localImageTab.addEventListener("click", () => {
        // No need to do anything if we are already on this tab
        if (currentTab === localImageTab) {
            return;
        }
    
        localImageTab.classList.add("selected");
        satelliteTab.classList.remove("selected");
        searchBox.style.display = "none";
        map.getDiv().style.display = "none";
        fileSelect.style.display = "flex";
        currentTab = localImageTab;
    });
    
    satelliteTab.addEventListener("click", async () => {
        // No need to do anything if we are already on this tab
        if (currentTab === satelliteTab) {
            return;
        }

        const connectingDialog = document.getElementById("connectingDialog");
    
        // Loading of map is delayed until the first time we visit this tab
        if (map === undefined) {
            connectingDialog.showModal();

            try {
                await initMap();
            } catch {
                connectingDialog.close();
                document.getElementById("connectionFailedDialog").showModal();
                return;
            }
        }
    
        satelliteTab.classList.add("selected");
        localImageTab.classList.remove("selected");
        fileSelect.style.display = "none";
        map.getDiv().style.display = "block";
        searchBox.style.display = "block";
        currentTab = satelliteTab;
        connectingDialog.close();
    });
}

// Adds functionality to the buttons displayed next to the map or file select.
// Enhance button activates DAT using the enhance level represented by the
// currently selected radio button.
function initButtonPanel() {
    const enhanceButton = document.getElementById("enhanceButton");

    enhanceButton.addEventListener("click", async () => {
        if (currentTab === satelliteTab) {
            try {
                await getMapsImage();
            } catch {
                document.getElementById("connectionFailedDialog").showModal();
                return;
            }
        }
    
        await enhanceImage();
    });

    for (let radioButton of radioButtons) {
        radioButton.addEventListener("click", event => {
            const clickedRadioButton = event.target;
    
            selectedRadioButton.classList.remove("selected");
            clickedRadioButton.classList.add("selected");
            selectedRadioButton = clickedRadioButton;
        });
    }
}

// Asks Python to get an image from the Google Maps API at the location that
// is currently visible on the map. A loading dialog is shown while waiting
// for Python to finish.
async function getMapsImage() {
    const mapsImageDialog = document.getElementById("mapsImageDialog");
    const mapCenter = map.getCenter();
    const mapZoom = map.getZoom();

    mapsImageDialog.showModal();

    try {
        await window.pywebview.api.get_maps_image(mapCenter, mapZoom);
    } finally {
        mapsImageDialog.close();
    }
}

// Asks Python to activate DAT using the enhance level represented by the
// currently selected radio button. A loading dialog is shown while waiting
// for Python to finish, followed by a success dialog.
async function enhanceImage() {
    const enhancingDialog = document.getElementById("enhancingDialog");
    const enhanceLevel = selectedRadioButton.getAttribute("id");

    enhancingDialog.showModal();
    await window.pywebview.api.execute_enhance(enhanceLevel);
    enhancingDialog.close();
    successDialog.showModal();
}

// Adds functionality to buttons contained within dialogs, and prevents ESC
// from being used to close dialogs.
function initDialogs() {
    const dialogs = document.querySelectorAll("dialog");

    for (let dialog of dialogs) {
        dialog.addEventListener('cancel', event => {
            event.preventDefault();
        });
    }

    const okButtons = document.querySelectorAll("dialog button.okButton");

    for (let button of okButtons) {
        button.addEventListener("click", () => {
            button.parentNode.close();
        })
    }
}

// Adds functionality to the file select window that allows it to receive
// files, either through drag and drop or File Explorer. Python handles
// getting these files and their full paths.
function initFileSelect() {
    const fileDropZone = document.getElementById("fileDropZone");
    const chooseFileButton = document.getElementById("chooseFileButton");
    const fileDropElements = document.querySelectorAll(".fileDropAllowed")

    // This button asks Python to open File Explorer to get files
    chooseFileButton.addEventListener("click", async () => {
        await window.pywebview.api.open_file_dialog();
    });
    
    let enterTarget;

    // The event listeners below allow the file drop zone to visually react to
    // files being dragged over it
    for (let element of fileDropElements) {
        element.addEventListener("dragenter", event => {
            enterTarget = event.target;
            fileDropZone.classList.add("active");
        });
        
        element.addEventListener("dragleave", event => {
            if (event.target === enterTarget) {
                fileDropZone.classList.remove("active");
            }            
        });
        
        element.addEventListener("drop", () => {
            fileDropZone.classList.remove("active");
        });
    }

    preventDefaultDragBehavior();
}

// By default, dragging files into the browser will open them in a new tab.
// Running this functions prevents this from happening so that file drag and
// drop functionality can work as intended.
function preventDefaultDragBehavior() {
    document.addEventListener("dragover", event => {
        event.preventDefault();
        event.stopPropagation();
    });
}

// Connects to the Google Maps API to create an interactive map with a
// functional search box (functionality added to existing elements).
async function initMap() {
    // Load the Maps JavaScript API dynamically
    (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
        key: "AIzaSyAz7DIMRFMREUS1oea5JnwxDck_veuDqWI"
    });

    const {Map} = await google.maps.importLibrary("maps");
    const {SearchBox} = await google.maps.importLibrary("places")
    const {ControlPosition} = await google.maps.importLibrary("core")
    const {LatLngBounds} = await google.maps.importLibrary("core")

    map = new Map(document.getElementById("map"), {
        center: {lat: 42.684, lng: -73.827},
        restriction: {
            latLngBounds: {north: 85, south: -85, west: -180, east: 180},
            strictBounds: true,
        }, 
        zoom: 15,
        tilt: 0,
        mapTypeId: "satellite",
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        keyboardShortcuts: false
    });

    // The search box must be linked to the map's controls to appear properly
    const search = new SearchBox(searchBox);
    map.controls[ControlPosition.TOP_LEFT].push(searchBox);

    // The search box retrieves more details about predictions it displays
    search.addListener("places_changed", () => {
        const places = search.getPlaces();

        if (places.length === 0) {
            return;
        }

        // Get the actual location for each place
        const bounds = new LatLngBounds();

        places.forEach((place) => {
            if (!place.geometry || !place.geometry.location) {
                return;
            }

            if (place.geometry.viewport) {
                // Only geocodes have viewport
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
    
        map.fitBounds(bounds);
    });
}

// This function is called by Python whenever it receives a new image file
// so that the file name can be displayed in the GUI.
function updateCurrentFile(file) {
    const fileName = document.getElementById("fileName");
    fileName.textContent = file;
}

// This function is called by Python whenever it receives more than one file 
// through drag and drop so the user knows what went wrong.
function showTooManyFilesDialog() {
    const tooManyFilesDialog = document.getElementById("tooManyFilesDialog");
    tooManyFilesDialog.showModal();
}

// This function is called by Python whenever it receives a file through
// drag and drop that is not an image file so the user knows what went wrong.
function showWrongFileTypeDialog() {
    const wrongFileTypeDialog = document.getElementById("wrongFileTypeDialog");
    wrongFileTypeDialog.showModal();
}
