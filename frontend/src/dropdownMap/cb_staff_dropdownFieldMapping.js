//frontend/src/dropdownMap/cb_staff_dropdownFieldMapping.js

export const dropdownFieldsByIdx = {
    8: "Gender",
    10: "Office",
    11: "StaffType",
};

export const dropdownOptions = {
    //internal values should match database stored values
    //LA and EN values are for display purpose

    Gender: {
        internal: ["_male", "_female"],
        LA: { "_male": "ຊາຍ", "_female": "ຍິງ" },
        EN: { "_male": "Male", "_female": "Female" }
    },
    Office: {
        internal: [
            "npco", "wfp", "daec", "pafo", "dafo", "nafri", "donre", "dpwt",
            "dlwo", "dico", "pico", "dpi", "dfnc", "deso", "dho", "doic",
            "dfo", "others"
        ],

        LA: {
            "npco": "ຫ້ອງການປະສານງານສູນກາງ",
            "wfp": "ອົງການອາຫານໂລກ",
            "daec": "ກົມສົ່ງເສີມກະສິກຳ ແລະ ສະຫະກອນ",
            "pafo": "ພະແນກ ກປ ແຂວງ",
            "dafo": "ຫ້ອງການ ກປ  ເມືອງ",
            "nafri": "ສະຖາບັນຄົ້ນຄວ້າ ກປ ແລະ ພັດທະນາຊົນນະບົດ",
            "donre": "ຊັບພະຍາກອນທຳມະຊາດແລະສິ່ງແວດລ້ອມເມືອງ",
            "dpwt": "ໂຍທາທິການ ແລະ ຂົນສົ່ງ ເມືອງ",
            "dlwo": "ຫ້ອງການສະຫະພັນແມ່ຍິງເມືອງ",
            "dico": "ຫ້ອງການອຸດສະຫະກຳ ແລະ ການຄ້າເມືອງ",
            "pico": "ຫ້ອງການອຸດສະຫະກຳ ແລະ ການຄ້າແຂວງ",
            "dpi": "ຫ້ອງການແຜນການ ແລະ ການລົງທຶນເມືອງ",
            "dfnc": "ແນວລາວສ້າງຊາດເມືອງ",
            "deso": "ຫ້ອງການສຶກສາ ແລະ ກິລາເມືອງ",
            "dho": "ຫ້ອງການສາທາລະນະສຸກ ເມືອງ",
            "doic": "ຖະແຫຼງຂ່າວ, ວັດທະນະທຳ ແລະ ທ່ອງທ່ຽວ ເມືອງ",
            "dfo": "ຫ້ອງການ ການເງິນ ເມືອງ",
            "others": "ອື່ນໆ"
        },

        EN: {
            "npco": "NPCO",
            "wfp": "WFP",
            "daec": "DAEC",
            "pafo": "PAFO",
            "dafo": "DAFO",
            "nafri": "NAFRI",
            "donre": "DONRE",
            "dpwt": "DPWT",
            "dlwo": "DLWO",
            "dico": "DICO",
            "pico": "PICO",
            "dpi": "DPI",
            "dfnc": "DFNC",
            "deso": "DESO",
            "dho": "DHO",
            "doic": "DOIC",
            "dfo": "DFO",
            "others": "Others"
        }
    },
    StaffType: {
        internal: [
            "afn_ii_staff",
            "gol_staff",
            "wfp_staff",
            "nafri_staff",
            "daec_staff"
        ],

        LA: {
            "afn_ii_staff": "ພະນັກງານໂຄງການ AFN2",
            "gol_staff": "ພະນັກງານລັດ",
            "wfp_staff": "ພະນັກງານອົງການອາຫານໂລກ",
            "nafri_staff": "ພະນັກງານສະຖາບັນ ກປ",
            "daec_staff": "ພະນັກງານກົມສົ່ງເສີມ"
        },

        EN: {
            "afn_ii_staff": "AFN-II staff",
            "gol_staff": "GoL staff",
            "wfp_staff": "WFP staff",
            "nafri_staff": "NAFRI staff",
            "daec_staff": "DAEC staff"
        }
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
