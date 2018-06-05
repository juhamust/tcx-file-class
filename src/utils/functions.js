"use strict";
exports.__esModule = true;
var geoPoint_1 = require("../classes/geoPoint");
var consts = require("../classes/consts");
/**
 * Υπολογίζει την απόσταση σε ΜΕΤΡΑ από το σημείο FromPoint στο σημείο ToPoint
 *
 * @param {GeoPoint} FromPoint οι συντεταγμένες του αρχικού σημείου σε ΜΟΙΡΕΣ
 * @param {GeoPoint} ToPoint οι συντεταγμένες του τελικού σημείου σε ΜΟΙΡΕΣ
 * @returns {number} η απόσταση ανάμεσα στα σημεία σε ΜΕΤΡΑ
*/
//test οκ
var apostasi = function (FromPoint, ToPoint) {
    var lat2 = ToPoint.latitudeDegrees;
    var lon2 = ToPoint.longitudeDegrees;
    var lat1 = FromPoint.latitudeDegrees;
    var lon1 = FromPoint.longitudeDegrees;
    //console.log(`${lat2}\n${lon2}\n${lat1}\n${lon1}\n `)
    var φ1 = degToRads(lat1);
    var φ2 = degToRads(lat2);
    var λ1 = degToRads(lon1);
    var λ2 = degToRads(lon2);
    var Δλ = degToRads(lon2 - lon1);
    var Δφ = degToRads(lat2 - lat1);
    var R = 6371e3;
    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
exports.apostasi = apostasi;
/**
* Μετατρέπει τις Μοίρες σε Ακτίνια
*
* @param {number} Degrees οι μοίρες
* @returns {number} τις degrees μοίρες σε ακτίνια
*/
//test ok
var degToRads = function (Degrees) {
    return Degrees * (Math.PI / 180);
};
exports.degToRads = degToRads;
/**
* Μετατρέπει τα ακτίνια σε μοίρες
*
* @param {number} η γωνία angle σε ακτίνια
* @returns {number} τα ακτίνια angle σε μοίρες
*/
//test ok
var radToDegrees = function (angle) {
    return angle * (180 / Math.PI);
};
exports.radToDegrees = radToDegrees;
/**
 * H secsToTime μετατρέπει τα δευτερόλεπτα value σε χρόνο της μορφής
 * [ΩΩ:]ΛΛ:ΔΔ.ΕΕ.
 *
 * <p>Οι ώρες δεν εμφανίζονται αν τεθεί η τιμή showHours σε false (εξ ορισμού
 * εμφανίζονται οι ώρες)</p>
 * @param {number} value ο χρόνος σε secs
 * @param {boolean} showHours αν θα εμφανίζεται το πεδίο ΩΩ:
 * @returns {string} o χρόνος σε μορφή ΩΩ:ΛΛ:ΔΔ.ΕΕ
 *
 */
//τεστ οκ
var secsToTime = function (value, showHours) {
    showHours === undefined ? (showHours = true) : (showHours = showHours);
    var result;
    showHours && value < consts.SECONDS_IN_DAY && value < consts.SECONDS_IN_HOUR ? (result = "00:") : (result = "");
    if (value <= 0) {
        return result + "00:00.00";
    }
    else {
        //βρίσκω τις ημέρες
        if (value > consts.SECONDS_IN_DAY) {
            var days = Math.trunc(value / consts.SECONDS_IN_DAY);
            value -= days * consts.SECONDS_IN_DAY;
            result = days + "d ";
            value < 3600 ? result += "00:" : result = result;
        }
        //βρίσκω τις ώρες
        var hrs = Math.floor(value / consts.SECONDS_IN_HOUR);
        if (hrs > 0) {
            value -= hrs * consts.SECONDS_IN_HOUR;
            hrs > 9
                ? (result += hrs.toString() + ":")
                : (result = "0" + hrs.toString() + ":");
        }
        //μιν -> λεπτά
        var min = Math.floor(value / 60);
        value -= min * 60;
        min > 9
            ? (result += min.toString() + ":")
            : (result += "0" + min.toString() + ":");
        //sec -> δευτερόλεπτα
        var secs = Math.floor(value);
        secs > 9 ? (result += secs.toString()) : (result += "0" + secs.toString());
        value -= secs;
        if (value === 0) {
            return result + ".00";
        }
        //mil -> εκατοστά
        var mil = Math.round(value * 100);
        mil > 9
            ? (result += "." + mil.toString())
            : (result += ".0" + mil.toString());
        return result;
    }
};
exports.secsToTime = secsToTime;
/**
 * Υπολογίζει τις συντεταγμένες του σημείου που βρίσκεται σε δεδομένα απόσταση και αζιμούθιο από το σημείο που στεκόμαστε
 *
 * @param {GeoPoint} FromPoint το αρχικό σημείο
 * @param {number} distance η απόσταση σε μέτρα προς το επόμενο σημείο
 * @param {number} Bearing το αζιμούθιο προς το τελικό σημείο σε ΜΟΙΡΕΣ
 * @returns {GeoPoint} αντικείμενο Cordinates
 */
//test ok
var getNextPointCordinatesFromDistanceBearing = function (FromPoint, distance, Bearing) {
    var brng = degToRads(Bearing);
    var lat1 = FromPoint.latitudeDegrees;
    var lon1 = FromPoint.longitudeDegrees;
    var d = distance;
    var R = 6371e3;
    var φ1 = degToRads(lat1);
    var λ1 = degToRads(lon1);
    var temp = new geoPoint_1.GeoPoint();
    temp.latitudeDegrees = Math.asin(Math.sin(φ1) * Math.cos(d / R) +
        Math.cos(φ1) * Math.sin(d / R) * Math.cos(brng));
    var φ2 = temp.latitudeDegrees;
    temp.longitudeDegrees =
        λ1 +
            Math.atan2(Math.sin(brng) * Math.sin(d / R) * Math.cos(φ1), Math.cos(d / R) - Math.sin(φ1) * Math.sin(φ2));
    temp.latitudeDegrees = radToDegrees(temp.latitudeDegrees);
    temp.longitudeDegrees = radToDegrees(temp.longitudeDegrees);
    temp.altitudeMeters = FromPoint.altitudeMeters;
    return temp;
};
exports.getNextPointCordinatesFromDistanceBearing = getNextPointCordinatesFromDistanceBearing;
/**
 * Mετατρέπει την ταχύτητα από m/s σε δεκαδικό ρυθμό min/km
 * @param {number} value η ταχύτητα σε m/s
 * @returns string το ρυθμό σε λεπτά το χιλιόμετρο με τη μορφή Λ,Δ
 * @example decimalPaceFromSpeedMpS(2.77) = 6 (06:00.00)
 */
var decimalPaceFromSpeedMpS = function (value) {
    //test ok
    return 50 / (value * 3);
};
exports.decimalPaceFromSpeedMpS = decimalPaceFromSpeedMpS;
/**
 * Mετατρέπει την ταχύτητα από m/s σε ρυθμό της μορφής ΛΛ:ΔΔ.ΕΕ
 * @param  {number} value η ταχύτητα σε m/s
 * @returns string ο ρυθμός σε μορφή ΛΛ:ΔΔ.ΕΕ
 */
var TimePaceFromSpeedMpS = function (value) {
    //test ok
    return decimalPaceToTimePace(decimalPaceFromSpeedMpS(value));
};
exports.TimePaceFromSpeedMpS = TimePaceFromSpeedMpS;
/**
 * Mετατρέπει τον ρυθμο από την δεκαδική του μορφή στη μορφή ΛΛ:ΔΔ.ΕΕ
 * @param  {number} value
 * @returns string: ο ρυθμός σε μορφή ΛΛ:ΔΔ.ΕΕ
 */
var decimalPaceToTimePace = function (value) {
    return secsToTime(value * 60, false);
};
exports.decimalPaceToTimePace = decimalPaceToTimePace;
function addTuples(arg, arg1) {
    var res = arg;
    for (var i = 0; i !== arg.length; ++i) {
        //console.log(typeof arg[i]);
        if (arg[i] instanceof Array) {
            for (var j = 0; j !== arg[i].length; ++j) {
                for (var k = 0; k !== arg1[i].length; ++k) {
                    if (res[i][j].zone === arg1[i][k].zone) {
                        res[i][j].time += arg1[i][k].time;
                    }
                }
            }
        }
        else {
            if (!isNaN(arg1[i])) {
                res[i] = arg[i] + arg1[i];
            }
        }
    }
    return arg;
}
exports.addTuples = addTuples;
/**
 * Βρίσκει τον μέσο όρο από τον πίνακα με αριθμούς
 *
 * @param ar πίνακας με αριθμούς
 */
function avgArray(ar) {
    var avg = 0;
    if (ar.length != 0) {
        avg = ar.reduce((function (a, b) { return a + b; }));
        return avg / ar.length;
    }
    else {
        return consts.ERROR_NUMBER_VALUE;
    }
}
exports.avgArray = avgArray;
function movingAvg(ar, period) {
    //κενός πίνακας => επιστρέφει []
    if (ar.length === 0) {
        return ar;
    }
    var per;
    if (period !== undefined) {
        per = period;
    }
    else {
        per = 0;
    }
    //δεν υπάρχει moving με 1!!!! επιστρέφει ο ίδιος πίνακας
    if (per === 1 || per < 0) {
        return ar;
    }
    if (per === 0 || per > ar.length) {
        var subSum = ar.reduce(function (a, b) { return a + b; });
        return [subSum / ar.length];
    }
    var result = [];
    for (var i = 0; i != ar.length; ++i) {
        if (i + 1 >= per) {
            var sum = null;
            for (var j = 0; j != per; ++j) {
                if (sum === null && ar[i - j] === null) {
                    sum = null;
                }
                else {
                    sum += ar[i - j];
                }
            }
            if (sum === null) {
                result.push(null);
            }
            else {
                result.push(sum / per);
            }
        }
        else {
            result.push(null);
        }
    }
    return result;
}
exports.movingAvg = movingAvg;
