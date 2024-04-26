/*
import {
    heroClientWidth,
    heroClientHeight,
    deviceCheck
} from "./index.js";
*/

let heroAniDiv = document.getElementById("vectorField");
let heroClientWidth = heroAniDiv.clientWidth;
let heroClientHeight = heroAniDiv.clientHeight;


export default class heroDiv {
    constructor(hostDiv) {

        new p5(function (p5) {

            // declare all context variables here

            let clientWidth = heroClientWidth;
            let clientHeight = heroClientHeight;

            let numGrids;
            let gridSpacing;
            let gridAddOn;
            let arrowLength;

            let allArrows = [];

            let clientOffsetX;
            let clientOffsetY;
            let yMax;

            let onMobile = false;

            let neue;
            let helvetica;

            let heroStatement;
            let maskWidth;
            let introString = "We are ";
            let introWidth;
            let closingString = "data scientists  ";
            let closingWidth;
            let fontSize;

            let heroStatements = [
                "coders",
                "nerds",
                "artists",
                "makers",
                "tinkerers",
                "designers",
                "pragmatists",
                "dreamers",
                "educators",
                "researchers",
                "data scientists"];

            let type_1;
            let newLine = false;

            p5.preload = function () {
                neue = p5.loadFont('https://cdn.jsdelivr.net/gh/Krishna-Duddumpudi/dfx_website_v7/fonts/NeuePixel-Regular.otf');
                helvetica = p5.loadFont('https://cdn.jsdelivr.net/gh/Krishna-Duddumpudi/dfx_website_v7/fonts/HelveticaNeueLTStd-Roman.otf');
            }

            p5.setup = function () {
                let canvas = p5.createCanvas(clientWidth, clientHeight);
                canvas.parent(hostDiv);
                p5.setAttributes('antialias', true);
                onMobile = deviceCheck();
                initGrid();
                makeArrows();

                type_1 = new typeWriter(heroStatements);
            }

            p5.draw = function () {
                p5.background(0);
                drawArrows();
                //drawDebugGird();
                type_1.update();
            }

            p5.windowResized = function () {

                clientWidth = document.getElementById("vectorField").clientWidth;
                clientHeight = document.getElementById("vectorField").clientHeight;

                p5.resizeCanvas(clientWidth, clientHeight);

                allArrows = [];

                onMobile = deviceCheck();
                initGrid();
                makeArrows();

                type_1 = new typeWriter(heroStatements);

            }

            function deviceCheck(onMobile) {
                if (/Android|iPhone/i.test(navigator.userAgent)) {
                    // mobile
                    onMobile = true;
                    console.log("user is on mobile");

                } else {
                    // desktop
                    onMobile = false;
                    console.log("user is on desktop");
                }
                return onMobile;
            }

            function drawDebugGird() {
                p5.stroke(255, 0, 0);
                p5.strokeWeight(1);
                for (let x = clientOffsetX; x < clientWidth; x += gridSpacing) {
                    p5.line(x, 0, x, clientHeight);
                    x += gridAddOn;
                }

                for (let y = clientOffsetY; y <= clientHeight; y += gridSpacing) {
                    p5.line(0, y, clientWidth, y);
                }

                p5.strokeWeight(1);
                p5.stroke(0, 255, 0);
                p5.line(0, yMax, clientWidth, yMax);
            }

            function initGrid() {

                if (onMobile == true) {
                    numGrids = 15;
                } else {
                    if (clientWidth / 60 < 50) {
                        numGrids = p5.floor(clientWidth / 40);
                    } else {
                        numGrids = 60;
                    }
                }

                gridSpacing = clientWidth / numGrids;
                arrowLength = gridSpacing * 0.65;

                clientOffsetX = arrowLength / 2;
                gridAddOn = (gridSpacing - arrowLength) / (numGrids - 1);

                clientOffsetY = 0;

                for (let y = clientOffsetY; y < clientHeight - (arrowLength / 2); y += gridSpacing) {
                    yMax = y;
                }

                let balance = clientHeight - yMax;
                console.log("balance is : " + balance);

                clientOffsetY = clientOffsetY + (balance / 2);

                calculateFontSize();

            }


            function makeArrows() {
                let canvasYMax;
                canvasYMax = clientHeight - (arrowLength / 2)

                for (let x = clientOffsetX; x < clientWidth; x += gridSpacing) {
                    for (let y = clientOffsetY; y < canvasYMax; y += gridSpacing) {
                        let tempArrow;
                        tempArrow = new arrow(x, y)
                        allArrows.push(tempArrow);
                    }
                    x += gridAddOn;
                }
            }

            function drawArrows() {
                for (let i = 0; i < allArrows.length; i++) {
                    allArrows[i].display();
                }
            }



            function calculateFontSize() {

                //process default font size
                fontSize = gridSpacing * 4;

                p5.textFont(helvetica);
                p5.textSize(fontSize);
                closingWidth = p5.textWidth(closingString);

                if (closingWidth < clientWidth) {
                    fontSize = gridSpacing * 4;
                    console.log("font size is : " + fontSize);
                } else {
                    fontSize = (clientWidth / closingWidth) * (gridSpacing * 4);
                    console.log("resized font size is : " + (clientWidth / closingWidth) * gridSpacing);
                }
            }

            class arrow {

                constructor(posX, posY) {
                    this._posX = posX;
                    this._posY = posY;
                    this.arrowLength = arrowLength;
                    this.angle = 0;
                    this.arrowHeading;
                    this.inc = 4;

                    this.reMappedNoise;

                    this._noiseX = this._posX;
                    this._noiseY = this._posY;

                    this.fallOff = 0;
                    this.lerpedAngle;
                }

                display() {
                    // angle calculation
                    //calculate heading vector to mouse position
                    let hv = p5.createVector(p5.mouseX - this._posX, p5.mouseY - this._posY);
                    this.arrowHeading = hv.heading();

                    //base noise calculations
                    let multiplier = 0.0015;



                    if (onMobile == false) {
                        let noiseVal = p5.noise(this._posX * multiplier, this._posY * multiplier);
                        this.reMappedNoise = p5.map(noiseVal, 0, 1, -3.14, 3.14);
                    } else {
                        this._noiseX += this.inc;
                        this._noiseY += this.inc;

                        let noiseVal = p5.noise(this._noiseX * multiplier, this._noiseY * multiplier);
                        this.reMappedNoise = p5.map(noiseVal, 0, 1, -3.14, 3.14);
                    }
                    if (onMobile == false) {

                        let d = p5.dist(this._posX, this._posY, p5.mouseX, p5.mouseY);

                        // lerp angles based on touch
                        if (d < 500) {
                            this.lerpedAngle = p5.lerp(this.arrowHeading, this.reMappedNoise, d / 500);
                            this.angle = this.lerpedAngle;
                            this.fallOff = 100;
                        } else {
                            this.angle = this.reMappedNoise;
                        }
                    } else {
                        this.angle = this.reMappedNoise;
                    }

                    p5.push();
                    p5.translate(this._posX, this._posY);
                    p5.rotate(this.angle);

                    // draw the arrow
                    p5.stroke(180);
                    p5.noFill();
                    p5.strokeWeight(1);

                    p5.line(-(this.arrowLength / 2), 0, this.arrowLength / 2, 0);
                    p5.line(this.arrowLength / 2, 0, this.arrowLength / 6, this.arrowLength / 6);
                    p5.line(this.arrowLength / 2, 0, this.arrowLength / 6, -this.arrowLength / 6);
                    //p5.circle(0, 0, arrowLength); // debug graphics

                    p5.pop();
                }
            }

            class typeWriter {
                constructor(statementCollection) {
                    this._statementCollection = statementCollection;
                    this._heroStatements; // bring in our collection of hero statements
                    this.currentStatement;
                    this.statementIndex = 0;
                    this.totalCharCount;

                    this.chars = [];
                    this.typePattern = [];
                    this.typeWidth = [];
                    this.currentChar = 0;
                    this.nextCharPos = 0;

                    this.currentCharIndex = 0;
                    this.displayString;
                    this.counter = 0;

                    this.maskWidth = 0;
                    this.maskWidthModule = 0;
                    this.maskM1 = 0;
                    this.maskM2 = 0;
                    this.shuffleStatements();
                    this.pickStatement();

                    this.holdCounter = 20;
                    this.drawCursor = true;

                    this.textPosY = (yMax - fontSize) - gridSpacing;
                    this.textOffset;
                }

                update() {

                    let typeGlitch = p5.int(p5.random(3, 15));

                    if (this.counter % typeGlitch == 0) {
                        if (this.currentChar < this.totalCharCount) {
                            this.currentChar++;
                            this.holdCounter = 20;


                            if (this.statementIndex == this._heroStatements.length) {
                                this.holdCounter = 100;
                                //console.log("holding for 100 at last statement");
                            } else {
                                this.holdCounter = 20;
                            }


                        } else {
                            this.holdCounter--;
                            if (this.holdCounter <= 0) {

                                this.currentChar = 0;
                                this.maskWidthM1 = 0;
                                this.maskWidthM2 = 0;

                                newLine = false;

                                this.pickStatement();
                            }
                        }
                    }

                    this.animateCursor();

                    p5.noStroke();
                    p5.fill(255);
                    p5.textSize(fontSize);

                    p5.textFont(helvetica);
                    introWidth = p5.textWidth(introString);
                    p5.text(introString, 0, this.textPosY);

                    for (let i = 0; i < this.currentChar; i++) {
                        this.nextCharPos = 0;

                        // new line boolean to adjust the mask
                        if (i > 7) {
                            newLine = true;
                        } else {
                            newLine = false;
                        }

                        for (let j = 0; j < i; j++) {
                            this.nextCharPos += this.typeWidth[j]; // find the cumulative typeWidths to position the next character!
                        }

                        //determine which font your want to use using the typePattern
                        if (this.statementIndex == this._heroStatements.length) {
                            p5.textFont(neue);
                        } else {
                            if (this.typePattern[i] == true) {
                                p5.textFont(neue);
                            } else {
                                p5.textFont(helvetica);
                            }
                        }

                        p5.text(this.chars[i], this.nextCharPos, this.textPosY + fontSize);

                    }

                    this.counter++;
                }

                pickStatement() {

                    if (this.statementIndex >= this._heroStatements.length) {
                        this.statementIndex = 0;
                        this.shuffleStatements();
                    }

                    if (this.statementIndex < this._heroStatements.length) {
                        this.currentStatement = this._heroStatements[this.statementIndex];
                        this.totalCharCount = this.currentStatement.length;
                        this.processChars();
                        this.statementIndex++;
                    }
                }

                processChars() {
                    //reset all the char arrays
                    this.chars = [];
                    this.typePattern = [];
                    this.typeWidth = [];

                    for (let i = 0; i < this.totalCharCount; i++) {
                        this.chars.push(this.currentStatement[i]);//push the character into the array
                        let rand = p5.random(0, 100);
                        p5.textSize(fontSize);

                        if (rand > 65) {
                            this.typePattern.push(true); // randomise the type pattern - if true then use Nue or else use Helvetica
                            p5.textFont(neue);
                            this.typeWidth.push(p5.textWidth(this.currentStatement[i])); //calculate the character width for nue;
                        } else {
                            this.typePattern.push(false);
                            p5.textFont(helvetica);
                            this.typeWidth.push(p5.textWidth(this.currentStatement[i])); //calculate the character width for helvetica;
                        }
                    }
                }

                drawChars() {

                }

                shuffleStatements() {
                    this._heroStatements = p5.shuffle(this._statementCollection);
                    this._heroStatements.push("DIFFERENTIAL");
                    this._heroStatements.unshift("architects"); // add architects to the start of the array
                }

                animateCursor() {

                    p5.stroke(255);
                    p5.noFill();
                    p5.strokeWeight(fontSize * 0.08);
                    p5.strokeCap(p5.SQUARE);
                    if (this.counter % 30 == 0) {
                        this.drawCursor = !this.drawCursor;
                    }

                    if (this.drawCursor == true) {
                        this.maskWidthModule = this.nextCharPos + (fontSize * 0.75);
                        p5.line(this.maskWidthModule, (this.textPosY + (fontSize * 0.2)), this.maskWidthModule, (this.textPosY + (fontSize * 1.2)));
                    }

                }
            }

        }, hostDiv);
    }
}

new heroDiv("vectorField");