/*
import {
    globeClientWidth,
    globeClientHeight
} from "./index.js";
*/

let globeAniDiv = document.getElementById("globeAni");
export let globeClientWidth = globeAniDiv.clientWidth;
export let globeClientHeight = globeAniDiv.clientHeight;

export default class globeDiv {
    constructor(hostDiv) {

        new p5(function (p5) {

            //declare all variables here!
            let neue;
            let helvetica;

            let clientWidth_g = globeClientWidth;
            let clientHeight_g = globeClientHeight;

            let angle = 0;

            let table;
            let r = 200;

            let interaction = false;
            var cam;
            let zoomVal;

            let latRadius = [];
            let latHeight = [];

            let markers = [];
            let activeMarkerIndex;

            p5.preload = function () {
                neue = p5.loadFont('https://cdn.jsdelivr.net/gh/Krishna-Duddumpudi/dfx_website_v7/fonts/NeuePixel-Regular.otf');
                helvetica = p5.loadFont('https://cdn.jsdelivr.net/gh/Krishna-Duddumpudi/dfx_website_v7/fonts/HelveticaNeueLTStd-Roman.otf');

                table = p5.loadTable(
                    'https://cdn.jsdelivr.net/gh/Krishna-Duddumpudi/dfx_website_v7/projects_v2.csv',
                    'header'
                );
            }

            p5.setup = function () {
                let canvas = p5.createCanvas(clientWidth_g, clientHeight_g, p5.WEBGL);
                canvas.parent(hostDiv);
                p5.setAttributes('antialias', true);
                p5.background(0);

                cam = p5.createEasyCam();
                initCam();

                initGlobe();
            }

            p5.draw = function () {
                p5.background(0);
                drawGlobe();
                updateMarkers();
                drawGUI();

            }

            p5.windowResized = function () {

                clientWidth_g = document.getElementById("globeAni").clientWidth;
                clientHeight_g = document.getElementById("globeAni").clientHeight;

                p5.resizeCanvas(clientWidth_g, clientHeight_g);
                initCam();
                initGlobe();

            }

            function initCam() {

                // projection
                zoomVal = 1000;

                var cam_dist = zoomVal;

                cam.setDistanceMin(zoomVal);
                cam.setDistanceMax(zoomVal);

                var oscale = 1;

                var ox = clientWidth_g / 2 * oscale;
                var oy = clientHeight_g / 2 * oscale;

                p5.ortho(-ox, +ox, -oy, +oy, -10000, 10000);
                cam.setPanScale(0.004 / p5.sqrt(cam_dist));

                cam.setViewport([0, 0, clientWidth_g, clientHeight_g]);

            }

            function initGlobe() {

                latRadius = [];
                latHeight = [];

                if (clientHeight_g > clientWidth_g) {
                    // vertical format r = client width
                    r = (clientWidth_g / 2);
                } else {
                    // horizontal format r = client height
                    r = (clientHeight_g / 2);
                }


                // draw the longitudes
                for (let j = -6; j < 7; j++) {
                    let h = (r * 2) / 12;
                    let tempH = h * j;
                    let tempRadius = p5.sqrt(p5.pow(r, 2) - p5.pow(tempH, 2));
                    latHeight.push(tempH);
                    latRadius.push(tempRadius * 2);
                }

                // initialise the markers

                markers = [];

                console.log(table.rows.length);

                for (let i = 0; i < table.rows.length; i++) {
                    let tempMarker = new marker(
                        table.get(i, "Title"),
                        table.get(i, "Lat"),
                        table.get(i, "Long"),
                        table.get(i, "Client"),
                        table.get(i, "Location"),
                        table.get(i, "Year"),
                        table.get(i, "Format"),
                        table.get(i, "Service"),
                        table.get(i, "stackNumber")
                    )
                    markers.push(tempMarker);
                }

                for (let i = 0; i < markers.length; i++) {
                    markers[i].update();
                }

                console.log(markers.length + " markers pushed into the array!");
            }

            function drawGlobe() {
                p5.stroke(180);
                p5.strokeWeight(1);
                p5.noFill();

                // draw the latitudes & longitudes
                for (let i = 0; i < 25; i++) {
                    p5.push();
                    let rotateAngle = 360 / 25;
                    p5.rotateY(p5.radians(rotateAngle * i));
                    p5.ellipse(0, 0, r * 2, r * 2, 48);
                    p5.pop();
                }
                p5.push();
                p5.rotateX(p5.radians(90));
                for (let i = 0; i < latHeight.length; i++) {
                    p5.push();
                    p5.translate(0, 0, latHeight[i]);
                    p5.ellipse(0, 0, latRadius[i], latRadius[i]);
                    p5.pop();
                }
                p5.pop();

                // We don't need to translate here, since WEBGL mode centers the view
                if (p5.mouseIsPressed == false) {
                    cam.rotateY(angle);
                    angle = 0.001;
                }

                p5.noStroke();
                p5.fill(0,150);
                p5.sphere(r - 5, 48, 48);
            }

            function updateMarkers() {
                let distances = []
                for (let i = 0; i < markers.length; i++) {
                    markers[i].update();
                    markers[i].isActive = false;
                    distances.push(markers[i].distance);
                }
                activeMarkerIndex = indexOfSmallest(distances);
                markers[activeMarkerIndex].isActive = true;
            }

            function indexOfSmallest(a) {
                let lowest = 0;
                for (let i = 1; i < a.length; i++) {
                    if (a[i] < a[lowest]) lowest = i;
                }
                return lowest;
            }

            function drawGUI() {


                document.getElementById("globe_title").innerText = markers[activeMarkerIndex]._title;
                document.getElementById("globe_client").innerText = markers[activeMarkerIndex]._client;
                document.getElementById("globe_location").innerText = markers[activeMarkerIndex]._location;
                document.getElementById("globe_year").innerText = markers[activeMarkerIndex]._year;
                document.getElementById("globe_format").innerText = markers[activeMarkerIndex]._format;
                document.getElementById("globe_service").innerText = markers[activeMarkerIndex]._service;

            }

            class marker {
                constructor(Title, Lat, Long, Client, Location, Year, Format, Service, stackNumber, isActive, cam) {
                    this._title = Title;
                    this._lat = Lat;
                    this._long = Long;
                    this._client = Client;
                    this._location = Location;
                    this._year = Year;
                    this._format = Format;
                    this._service = Service;
                    this._stack = stackNumber;
                    this.isActive = false;
                    this.distance;

                    this.angleb;
                    this.raxis;

                    this._cam = cam;

                    this.init();

                    this.x;
                    this.y;
                    this.z;
                }

                init() {
                    let theta = p5.radians(this._lat);

                    let phi = p5.radians(this._long) + Math.PI;

                    // fix: in OpenGL, y & z axes are flipped from math notation of spherical coordinates
                    this.x = r * p5.cos(theta) * p5.cos(phi);
                    this.y = -r * p5.sin(theta);
                    this.z = -r * p5.cos(theta) * p5.sin(phi);

                    let pos = p5.createVector(this.x, this.y, this.z);


                    let h = p5.pow(10, p5.mag);
                    let maxh = p5.pow(10, 7);
                    h = p5.map(h, 0, maxh, 10, 100);


                    let xaxis = p5.createVector(1, 0, 0);

                    this.angleb = p5.abs(xaxis.angleBetween(pos));

                    this.raxis = xaxis.cross(pos);
                }

                update() {

                    this.distance = p5.dist(this.x, this.y, this.z, cam.getPosition()[0], cam.getPosition()[1], cam.getPosition()[2]);
                    //console.log("distance to marker : " + this.distance);

                    if (this.isActive == true) {
                        p5.fill(255, 37, 13);
                    } else {
                        p5.fill(71, 28, 212);
                    }

                    p5.push();
                    p5.translate(this.x, this.y, this.z);
                    // In p5.js, the rotation axis is a vector object instead of x,y,z
                    p5.rotate(this.angleb, this.raxis);
                    //stroke(255,0,0);
                    //strokeWeight(10);
                    let boxSize = clientHeight_g * 0.01;
                    p5.box(boxSize, boxSize, boxSize);
                    p5.pop()
                }

            }

        }, hostDiv);
    }
}

new globeDiv("globeAni");