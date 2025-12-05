//frontend/src/dropdownMap/cb_villagers_dropdownFieldMapping.js

export const dropdownFieldsByIdx = {
    12: "ConductedBy",
    13: "ActivityCode",
    17: "Gender",
    18: "Responsibility",
    21: "PovertyLevel",
    22: "PWDStatus",
    23: "APGMember",
};

export const dropdownOptions = {
    // Gender: {
    //     internal: ["_male", "_female"],
    //     LA: { "_male": "ຊາຍ", "_female": "ຍິງ" },
    //     EN: { "_male": "Male", "_female": "Female" }
    // },

    //internal values should match database stored values
    //LA and EN values are for display purpose

    ConductedBy: {
        internal: ["npco", "wfp", "pafo", "dafo", "gst", "maf", "nafri", "daec"],
        LA: { "npco": "ຫ້ອງການປະສານງານສູນກາງ", "wfp": "ອົງການອາຫານໂລກ", "pafo": "ພະແນກ ກປ ແຂວງ", "dafo": "ຫ້ອງການ ກປ  ເມືອງ", "gst": "ທີມງານຊ່ວຍເຫຼືອກຸ່ມ", "maf": "ກະຊວງ ກປ", "nafri": "ສະຖາບັນຄົ້ນຄວ້າ ກປ ແລະ ພັດທະນາຊົນນະບົດ", "daec": "ກົມສົ່ງເສີມກະສິກຳ ແລະ ສະຫະກອນ" },
        EN: { "npco": "NPCO", "wfp": "WFP", "pafo": "PAFO", "dafo": "DAFO", "gst": "GST", "maf": "MAF", "nafri": "NAFRI", "daec": "DAEC" }
    },
    ActivityCode: {
        internal: ["1A.1", "1A.2", "1A.3a", "1A.3b", "1A.4", "1A.5a", "1A.5b", "1B.Act6", "1B.Act7", "1B.Act8", "2Act1", "2Act2", "2Act3", "3Act1a", "3Act1b", "3Act2"],
        LA: { "1A.1": "1A.1", "1A.2": "1A.2", "1A.3a": "1A.3a", "1A.3b": "1A.3b", "1A.4": "1A.4", "1A.5a": "1A.5a", "1A.5b": "1A.5b", "1B.Act6": "1B.Act6", "1B.Act7": "1B.Act7", "1B.Act8": "1B.Act8", "2Act1": "2Act1", "2Act2": "2Act2", "2Act3": "2Act3", "3Act1a": "3Act1a", "3Act1b": "3Act1b", "3Act2": "3Act2" },
        EN: { "1A.1": "1A.1", "1A.2": "1A.2", "1A.3a": "1A.3a", "1A.3b": "1A.3b", "1A.4": "1A.4", "1A.5a": "1A.5a", "1A.5b": "1A.5b", "1B.Act6": "1B.Act6", "1B.Act7": "1B.Act7", "1B.Act8": "1B.Act8", "2Act1": "2Act1", "2Act2": "2Act2", "2Act3": "2Act3", "3Act1a": "3Act1a", "3Act1b": "3Act1b", "3Act2": "3Act2" }
    },
    Gender: {
        internal: ["Male", "Female"],
        LA: { "Male": "ຊາຍ", "Female": "ຍິງ" },
        EN: { "Male": "Male", "Female": "Female" }
    },
    Responsibility: {
        internal: [
            "option_1", "option_2", "lwu", "youth", "vnf", "villager", "senior_person", "lf", "vvw", "vnc", "vrbc", "msme"
        ],

        LA: {
            "option_1": "ນາຍບ້ານ",
            "option_2": "ຮອງ ນາຍບ້ານ",
            "lwu": "ສະຫະພັນແມ່ຍິງ",
            "youth": "ຊາວໜຸ່ມ",
            "vnf": "ຜູ້ອຳນວຍຄວາມສະດວກວຽກໂພຊະນາການຂັ້ນບ້ານ",
            "villager": "ຊາວບ້ານ",
            "senior_person": "ຜູ້ອາວຸໂສ (ເຖົ້າແກ່ ແນວໂຮມ)",
            "lf": "ກະສິກອນຕົວແບບ",
            "vvw": "ສັດຕະວະແພດບ້ານ",
            "vnc": "ຄະນະໂພຊະນາການຂັ້ນບ້ານ",
            "vrbc": "ຄະນະກໍາມະການຄຸ້ມຄອງທະນາຄານເຂົ້າ",
            "msme": "ຈຸລະວິສາຫະກິດ, ວສກ ນ້ອຍ, ກາງ"
        },

        EN: {
            "option_1": "V-head",
            "option_2": "VD-head",
            "lwu": "LWU",
            "youth": "Youth",
            "vnf": "VNF",
            "villager": "Villager",
            "senior_person": "Senior person",
            "lf": "LF",
            "vvw": "VVW",
            "vnc": "VNC",
            "vrbc": "VRBC",
            "msme": "MSME"
        }
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
