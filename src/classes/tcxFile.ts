import { EventEmitter } from 'events';
import * as fs from 'fs';
import {Author} from "./author";
import {Creator} from "./creator";
import * as pstring from 'xml2js';
import * as consts from "./consts";
import { iXmlData, iXmlAuthor, iXmlCreator } from './iFaces';
import {Lap} from './lap';
import {Activity} from './activity';

const pString = pstring.parseString;
/**
 * Το κεντρικό αντικείμενο που διαχειρίζεται το TCX αρχείο
 */
export class TcxFile extends EventEmitter {
    /**Όλα τα δεδομένα του αρχείου σε ΧΜL μορφή */
    data: iXmlData = null;
    /**Κρατάει την τιμή του λάθους, αν υπάρχει, στην ανάγωνση του TCX αρχείου */
    isError = consts.ERROR_STRING_VALUE;
    /**Ετοιμότητα του αντικειμένου */
    isReady = false;


    /**
     * Δημιουργία του αντικειμένου που διαβάζει τα δεδομένα από TCX  αρχείο
     * 
     * @param {string} filename το όνομα του αρχείου TCX
     * @param {function} callback η συνάρτηση που καλείται όταν διαβάσει το αρχείο. Αν 
     * υπάρχει λάθος, τότε η callback(err:string) επιστρέφει το λάθος στην err
     */
    //constructor(filename:string, callback:(err:string)=>void){
    constructor() {
        super();
        // this.read(filename,(err)=>{
        //     if (err){
        //         this.isError = err;
        //         this.emit('endReading',err);
        //         callback(err);
        //     }else {
        //         this.emit('endReading',null)
        //         this.isReady = true;
        //         callback(undefined);
        //     }
        // });
    }

    /**Διαβάζει την ιδότητα Id του ΤCX αρχείου
     * @return {string} id η τσυτότητα της δραστηριότητας
    */
    getId(): string {
        let id: string = "";
        let self = this;
        if (self.isReady) {
            id = self.data.TrainingCenterDatabase.Activities[0].Activity[0].Id[0];
        }
        return id;
    };

    /**Διαβάσει το τύπο του Sport από το TCX αρχείο
     * @returns {string} sport το άθλημα της δραστηριότητας
      */
    getSport(): string {
        let sport;
        let self = this;
        if (self.isReady) {
            sport = self.data.TrainingCenterDatabase.Activities[0].Activity[0].$.Sport;
        }
        return sport;
    };

    /**
     * Συμπληρώνει ένα αντικείμενο Author με τα στοχεία (αν υπάρχουν) στο TCX αρχείο
     * 
     * @returns {Author} author αντικείμενο Author η null
     */
    getAuthor(): Author | null {
        let author: Author = null;
        let self = this;
        //runtastic does not have author record
        if (self.isReady && self.data.TrainingCenterDatabase.Author !== undefined) {
            author = new Author(self.data.TrainingCenterDatabase.Author[0]);
        }
        return author;
    };

    /**
     * Ελέγχει αν το αρχείο έχει στοιχεία Creator
     * @return {boolean} true ή false
     */
    hasCreator(): boolean {
        let self = this;
        if (self.isReady) {
            return self.data.TrainingCenterDatabase.$.creator !== undefined || self.data.TrainingCenterDatabase.Activities[0].Activity[0].Creator !== undefined;
        }
        return false;
    };

    /**
    * Συμπληρώνει ένα αντικείμενο Creator με τα στοχεία (αν υπάρχουν) στο TCX αρχείο
    * 
    * @returns {Creator} creator αντικείμενο Creator η null
    */
    getCreator(): Creator | null {
        let creator: Creator = null;
        let self = this;
        if (self.isReady && self.hasCreator()) {
            if (self.data.TrainingCenterDatabase.$.creator !== undefined) {
                creator = new Creator();
                creator.name = self.data.TrainingCenterDatabase.$.creator;
                creator.isRuntastic = true;
            } else {
                creator = new Creator(self.data.TrainingCenterDatabase.Activities[0].Activity[0].Creator[0]);
                creator.isRuntastic = false;
            }
        }
        return creator;
    };
    /**
     * Συμπληρώνει ένα πίνακα με όλα τα Laps του αρχείου TCX
     * 
     * @return τον πίνακα σε μορφή Array<Lap>
     */
    getLaps(): Array<Lap> | Array<null> {
        let laps = Array<Lap>();
        let self = this;
        if (self.isReady) {
            let lapCount = self.data.TrainingCenterDatabase.Activities[0].Activity[0].Lap.length;
            for (let i = 0; i != lapCount; ++i) {
                laps.push(new Lap(self.data.TrainingCenterDatabase.Activities[0].Activity[0].Lap[i]));
            }
        }
        return laps;
    };

    /**
     * Ανάγνωση αρχείου TCX και απόδοση των στοιχείων του στο obj αντικείμενο TcxFile
     * 
     * @param {TcxFile} obj το αντικείμενο που θα διαβάσουμε
     * @param {string} filename το όνομα του αρχείου
     * @param callback η συνάρτηση που επιστρέφει (err, data). Όπου data σε μορφή iXmlData 
     * το σύνολο των δεδομένων του TCX αρχείου (filename)
     */
    read(filename: string, callback: (err: string, data: iXmlData) => void) {
        let self = this;
        fs.readFile(filename, 'utf8', (err, data) => {
            if (!err) {
                //το αρχείο υπάρχει τότε το string πάει για parsing
                pString(data, function (err, result) {
                    if (!err) {
                        self.data = result;
                        self.isError = consts.ERROR_STRING_VALUE;
                        self.isReady = true;
                        self.emit('endReading', null);
                        callback(null, result);
                    } else {
                        self.isError = err.message;
                        self.data = null;
                        self.isReady = false;
                        self.emit('endReading', err);
                        callback(err, null);
                    }
                });
            } else {
                //το αρχείο δεν υπάρχει
                self.data = null;
                self.isError = err.message;
                self.isReady = false;
                self.emit('endReading', err);
                callback(err.message, null);
            }
        });
    }


    readFromString(source: string, callback: (err: string, data: iXmlData) => void) {
        let self = this;
        pString(source, function (err, result) {
            if (!err) {
                self.data = result;
                self.isError = consts.ERROR_STRING_VALUE;
                self.isReady = true;
                self.emit('endReading', null);
                callback(null, result);
            } else {
                self.isError = err.message;
                self.data = null;
                self.isReady = false;
                self.emit('endReading', err);
                callback(err, null);
            }
        });
    }

    save(filename: string, athleteId: number, zones: [number, number, number, number] | null, callback: (err: string) => void) {
        let self = this;
        self.emit('Proccessing', 'starting...');
        let act = new Activity();
        act.on('Process', (val) => {
            self.emit('Process', val);
        })
        act.on('progress', (val) => {
            self.emit('progress', val);
        })
        act.read(athleteId, this, zones);
        self.emit('Proccessing', '...end');
        fs.writeFile(filename, JSON.stringify(act.proccessElements), (err) => {
            if (err) {
                self.emit('endWriting', err);
                callback(err.message);
            } else {
                self.emit('endWriting', null);
                callback(undefined);
            }
        });
    }
}