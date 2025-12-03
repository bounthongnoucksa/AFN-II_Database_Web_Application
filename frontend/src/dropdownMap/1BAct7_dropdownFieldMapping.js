//frontend/src/dropdownMap/1BAct7_dropdownFieldMapping.js

export const dropdownFieldsByIdx = {
    
    12: "Responsibility",
    14: "Gender",
    16: "PovertyLevel",
    17: "PWDStatus",
    18: "StarterKitReceived",
    19: "Certified",
    20: "EngagedInCommercial",
};

export const dropdownOptions = {
    //internal values should match database stored values
    //LA and EN values are for display purpose


    Responsibility: {
        internal: ["lf", "lf_l", "vvw","vf","villager","apg_member"],
        LA: { "lf": "ກະສິກອນຕົວແບບດ້ານປູກຝັງ", "lf_l": "ກະສິກອນຕົວແບບດ້ານລ້ຽງສັດ", "vvw": "ສັດຕະວະແພດບ້ານ" , "vf": "ຜູ້ອຳນວຍຄວາມສະດວກໂພຊະນາການຂັ້ນບ້ານ", "villager": "ຊາວບ້ານ", "apg_member": "ສະມາຊິກກຸ່ມ" },
        EN: { "lf": "LF-C", "lf_l": "LF-L" , "vvw": "VVW", "vf": "VF", "villager": "Villager", "apg_member": "APG Member" }
    },
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
    StarterKitReceived: {
        internal: ["0", "1"],
        LA: { "0": "No", "1": "Yes" },
        EN: { "0": "No", "1": "Yes" }
    },
    Certified: {
        internal: ["c_no", "c_yes"],
        LA: { "c_no": "No", "c_yes": "Yes" },
        EN: { "c_no": "No", "c_yes": "Yes" }
    },
    EngagedInCommercial: {
        internal: ["engage_no", "engage_yes"],
        LA: { "engage_no": "No", "engage_yes": "Yes" },
        EN: { "engage_no": "No", "engage_yes": "Yes" }
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
