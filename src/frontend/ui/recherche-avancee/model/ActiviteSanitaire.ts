export class ActiviteSanitaire {
    classification: string;
    ranges: string[];

    constructor(classification: string, ranges: string[]) {
        this.classification = classification;
        this.ranges = ranges;
    }
}