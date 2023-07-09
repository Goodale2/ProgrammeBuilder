export type nullable = undefined|null;

export interface Programme {
    announcements: string|nullable; // The person givng the announcments
    chorister: string;
    conducting: string;
    date: string|nullable;
    invocation: string|nullable; // The person giving the invocation
    musicalNumber1: string|nullable; // Optional but not nullable?
    musicalNumber2: string|nullable;
    musicalNumber3: string|nullable;
    musicalNumber4: string|nullable;
    owner_uid: string;
    pianist: string;
    presiding: string;
    speaker1: string|nullable;
    speaker2: string|nullable;
    speaker3: string|nullable;
    wardName: string;
}