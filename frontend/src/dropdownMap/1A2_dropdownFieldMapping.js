//frontend/src/dropdownMap/1A2_dropdownFieldMapping.js

export const dropdownFieldsByIdx = {
    14: "Gender",
    15: "PWBWStatus",
    17: "PovertyLevel",
    18: "PWDStatus",
    19: "Module1",
    20: "Module2",
    21: "Module3",
    22: "Module4",
    23: "ReceivedGrant",
};

export const dropdownOptions = {
    //internal values should match database stored values
    //LA and EN values are for display purpose


    Gender: {
        internal: ["Male", "Female"],
        LA: { "Male": "ຊາຍ", "Female": "ຍິງ" },
        EN: { "Male": "Male", "Female": "Female" }
    },

    PWBWStatus: {
        internal: ["pw", "bw", "pw_1","vf","bb_sitter"],
        LA: { "pw":"ແມ່ຍິງຖືພາ", "bw":"ແມ່ຍິງລ້ຽງລຸກດ້ວຍນົມແມ່", "pw_1":"ແມ່ຍິງຖຶພາຍັງມິລຸກຍັງກິນນົມ","vf":"ຜອບ","bb_sitter":"ຜູ້ປົກຄອງເດັກ" },
        EN: { "pw":"PW", "bw":"BW", "pw_1":"PBW","vf":"VF","bb_sitter":"Baby sitter" }
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
    Module1: {
        internal: ["m1_no", "m1_yes"],
        LA: { "m1_no": "No", "m1_yes": "Yes" },
        EN: { "m1_no": "No", "m1_yes": "Yes" }
    },
    Module2: {
        internal: ["m2_no", "m2_yes"],
        LA: { "m2_no": "No", "m2_yes": "Yes" },
        EN: { "m2_no": "No", "m2_yes": "Yes" }
    },
    Module3: {
        internal: ["m3_no", "m3_yes"],
        LA: { "m3_no": "No", "m3_yes": "Yes" },
        EN: { "m3_no": "No", "m3_yes": "Yes" }
    },
    Module4: {
        internal: ["m4_no", "m4_yes"],
        LA: { "m4_no": "No", "m4_yes": "Yes" },
        EN: { "m4_no": "No", "m4_yes": "Yes" }
    },

    ReceivedGrant: {
        internal: ["g_no", "g_yes"],
        LA: { "g_no": "No", "g_yes": "Yes" },
        EN: { "g_no": "No", "g_yes": "Yes" }
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
