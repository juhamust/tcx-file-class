import Author from "./author";
import Creator from "./creator";
import { iXmlData } from './iFaces';
import Lap from './lap';
/**
 * Το κεντρικό αντικείμενο που διαχειρίζεται το TCX αρχείο
 */
export default class TcxFile {
    /**Όλα τα δεδομένα του αρχείου σε ΧΜL μορφή */
    data: iXmlData;
    /**Κρατάει την τιμή του λάθους, αν υπάρχει, στην ανάγωνση του TCX αρχείου */
    isError: string;
    /**Ετοιμότητα του αντικειμένου */
    isReady: boolean;
    /**
     * Δημιουργία του αντικειμένου που διαβάζει τα δεδομένα από TCX  αρχείο
     *
     * @param {string} filename το όνομα του αρχείου TCX
     * @param {function} callback η συνάρτηση που καλείται όταν διαβάσει το αρχείο. Αν
     * υπάρχει λάθος, τότε η callback(err:string) επιστρέφει το λάθος στην err
     */
    constructor(filename: string, callback: (err: string) => void);
    /**Διαβάζει την ιδότητα Id του ΤCX αρχείου
     * @return {string} id η τσυτότητα της δραστηριότητας
    */
    getId(): string;
    /**Διαβάσει το τύπο του Sport από το TCX αρχείο
     * @returns {string} sport το άθλημα της δραστηριότητας
      */
    getSport(): string;
    /**
     * Συμπληρώνει ένα αντικείμενο Author με τα στοχεία (αν υπάρχουν) στο TCX αρχείο
     *
     * @returns {Author} author αντικείμενο Author η null
     */
    getAuthor(): Author | null;
    /**
     * Ελέγχει αν το αρχείο έχει στοιχεία Creator
     * @return {boolean} true ή false
     */
    hasCreator(): boolean;
    /**
    * Συμπληρώνει ένα αντικείμενο Creator με τα στοχεία (αν υπάρχουν) στο TCX αρχείο
    *
    * @returns {Creator} creator αντικείμενο Creator η null
    */
    getCreator(): Creator | null;
    /**
     * Συμπληρώνει ένα πίνακα με όλα τα Laps του αρχείου TCX
     *
     * @return τον πίνακα σε μορφή Array<Lap>
     */
    getLaps(): Array<Lap> | Array<null>;
}