//frontend/src/dropdownMap/3Act1b_dropdownFieldMapping.js

export const dropdownFieldsByIdx = {
    13: "Gender",
    15: "DNCPApproval",
    17: "EquipmentSupported",
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

    DNCPApproval: {
        internal: ["no", "yes"],
        LA: { "no": "No", "yes": "Yes" },
        EN: { "no": "No", "yes": "Yes" }
    },

    EquipmentSupported: {
        internal: ["no", "yes"],
        LA: { "no": "No", "yes": "Yes" },
        EN: { "no": "No", "yes": "Yes" }
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
