//frontend/src/dropdownMap/1BAct6_dropdownFieldMapping.js

export const dropdownFieldsByIdx = {
    
    15: "Gender",
    17: "PovertyLevel",
    18: "PWDStatus",
    19: "PositionInGroup",
    20: "MSME",
    26: "ACRegistered",
    27: "GrantReceived",
};

export const dropdownOptions = {
    //internal values should match database stored values
    //LA and EN values are for display purpose


    Gender: {
        internal: ["Male", "Female"],
        LA: { "Male": "ຊາຍ", "Female": "ຍິງ" },
        EN: { "Male": "Male", "Female": "Female" }
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
    PositionInGroup: {
        internal: ["g_head", "g_deputy", "g_member"],
        LA: { "g_head": "ຫົວໜ້າກຸ່ມ", "g_deputy": "ຮອງຫົວໜ້າກຸ່ມ", "g_member": "ສະມາຊິກກຸ່ມ"  },
        EN: { "g_head": "Group head", "g_deputy": "Deputy group head" , "g_member": "Group member" }
    },
    MSME: {
        internal: ["no", "yes"],
        LA: { "no": "No", "yes": "Yes" },
        EN: { "no": "No", "yes": "Yes" }
    },
    ACRegistered: {
        internal: ["ac_no", "ac_yes"],
        LA: { "ac_no": "No", "ac_yes": "Yes" },
        EN: { "ac_no": "No", "ac_yes": "Yes" }
    },
    GrantReceived: {
        internal: ["grant_no", "grant_yes"],
        LA: { "grant_no": "No", "grant_yes": "Yes" },
        EN: { "grant_no": "No", "grant_yes": "Yes" }
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
