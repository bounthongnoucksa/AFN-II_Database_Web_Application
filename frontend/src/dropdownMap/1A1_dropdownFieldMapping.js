//frontend/src/dropdownMap/1A1_dropdownFieldMapping.js

export const dropdownFieldsByIdx = {
    15: "Gender",
    16: "WomanHead",
    20: "PovertyLevel",
    21: "PWDStatus",
    22: "APGMember",
    23: "VNCAvailable",
};

export const dropdownOptions = {
    // Gender: {
    //     internal: ["_male", "_female"],
    //     LA: { "_male": "ຊາຍ", "_female": "ຍິງ" },
    //     EN: { "_male": "Male", "_female": "Female" }
    // },

    //internal values should match database stored values
    //LA and EN values are for display purpose


    Gender: {
        internal: ["Male", "Female"],
        LA: { "Male": "ຊາຍ", "Female": "ຍິງ" },
        EN: { "Male": "Male", "Female": "Female" }
    },

    WomanHead: {
        internal: ["h_no", "h_yes"],
        LA: { "h_no": "No", "h_yes": "Yes" },
        EN: { "h_no": "No", "h_yes": "Yes" }
    },

    PovertyLevel: {
        internal: ["p", "np"],
        LA: { "p": "P", "np": "NP" },
        EN: { "p": "P", "np": "NP" }
    },

    PWDStatus: {
        internal: ["no", "yes"],
        LA: { "no": "No", "yes": "Yes" },
        EN: { "no": "No", "yes": "Yes" }
    },

    APGMember: {
        internal: ["no", "yes"],
        LA: { "no": "No", "yes": "Yes" },
        EN: { "no": "No", "yes": "Yes" }
    },

    VNCAvailable: {
        internal: ["0", "1"],
        LA: { "0": "No", "1": "Yes" },
        EN: { "0": "No", "1": "Yes" }
    }
};

// Reverse mapping: LA → _male etc.
// export const dropdownReverseMap = {};
// Object.keys(dropdownOptions).forEach(field => {
//     dropdownReverseMap[field] = { LA: {}, EN: {} };
//     const opts = dropdownOptions[field];
//     opts.internal.forEach(intVal => {
//         dropdownReverseMap[field].LA[opts.LA[intVal]] = intVal;
//         dropdownReverseMap[field].EN[opts.EN[intVal]] = intVal;
//     });
// });
export const dropdownReverseMap = {};
Object.keys(dropdownOptions).forEach(field => {
    dropdownReverseMap[field] = { LA: {}, EN: {} };
    const opts = dropdownOptions[field];
    opts.internal.forEach(intVal => {
        const strVal = String(intVal); // force string
        dropdownReverseMap[field].LA[opts.LA[strVal]] = strVal;
        dropdownReverseMap[field].EN[opts.EN[strVal]] = strVal;
    });
});
