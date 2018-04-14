"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts = require("./consts");
const geoPoint_1 = require("./geoPoint");
/**
 * To αντικείμενο που κρατά όλα τα στοιχεία που έχει το TCX αρχείο για κάθε ένα σημείο καταγραφής
 */
class GpsPoint {
    /**
     * Συμπληρώνει το αντικείμενο από τα στοιχεία του TCX
     *
     * @param obj η xml καταγραφή από το αρχείο TCX
     */
    constructor(obj) {
        /**Η μέχρι τώρα απόσταση */
        this.distanceMeters = consts.ERROR_NUMBER_VALUE;
        /**η τρέχουσα ταχύτητα */
        this.speed = consts.ERROR_NUMBER_VALUE;
        /**Η ταχύτητα βηματισμού */
        this.runCandence = consts.ERROR_NUMBER_VALUE;
        /**Το cadence */
        this.candence = consts.ERROR_NUMBER_VALUE;
        /**O τρέχων καρδιακός παλμός */
        this.heartRateBpm = consts.ERROR_NUMBER_VALUE;
        /**Οι συντεταγμένες του σημείου και το υψόμετρο */
        this.position = new geoPoint_1.default();
        /**Ο χρόνος καταγραφής */
        this.time = consts.ERROR_STRING_VALUE;
        if (obj !== undefined) {
            if (obj.DistanceMeters !== undefined) {
                this.distanceMeters = Number(obj.DistanceMeters[0]);
            }
            if (obj.Extensions !== undefined && obj.Extensions[0]["ns3:TPX"] !== undefined) {
                if (obj.Extensions[0]["ns3:TPX"][0]["ns3:Speed"] !== undefined) {
                    this.speed = Number(obj.Extensions[0]["ns3:TPX"][0]["ns3:Speed"][0]);
                }
                if (obj.Extensions[0]["ns3:TPX"][0]["ns3:RunCadence"] !== undefined) {
                    this.runCandence = Number(obj.Extensions[0]["ns3:TPX"][0]["ns3:RunCadence"][0]);
                }
            }
            else {
                if (obj.Extensions !== undefined && obj.Extensions[0].TPX !== undefined) {
                    //TODO na βρω ποδηλατικό πολαρ
                    this.runCandence = Number(obj.Extensions[0].TPX[0].RunCadence[0]);
                    this.speed = Number(obj.Extensions[0].TPX[0].Speed[0]);
                }
            }
            if (obj.Cadence !== undefined) {
                this.candence = Number(obj.Cadence[0]);
            }
            if (obj.HeartRateBpm !== undefined) {
                this.heartRateBpm = Number(obj.HeartRateBpm[0].Value[0]);
            }
            this.time = obj.Time[0];
            if (obj.Position !== undefined) {
                this.position.latitudeDegrees = Number(obj.Position[0].LatitudeDegrees[0]);
                this.position.longitudeDegrees = Number(obj.Position[0].LongitudeDegrees[0]);
                if (obj.AltitudeMeters !== undefined) {
                    this.position.altitudeMeters = Number(obj.AltitudeMeters[0]);
                }
                else {
                    this.position.altitudeMeters = consts.ERROR_NUMBER_VALUE;
                }
            }
        }
    }
}
exports.default = GpsPoint;
//# sourceMappingURL=GpsPoint.js.map