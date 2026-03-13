//frontend/src/MapGPSdata.js
//GPS dat for visulization on map, this is dummy data for now, will be replaced by real data from database in the future
export const projects = [
  {
    id: 1,
    name: "AFN Office Building",
    address: "Vientiane, Laos",
    type: "infrastructure",
    gps: [17.9713539106405, 102.62197223376516]
  },
  {
    id: 2,
    name: "Road Construction",
    address: "Sekong province, Laos",
    length: 50, // in kilometers
    type: "road",
    gps: [
      [15.344389852599948, 107.057902397708], // start
      [15.342401707710772, 107.05853113790221],
      [15.340107368859515, 107.06033154811887],
      [15.337844009892594, 107.06087810122035],
      [15.335642637235512, 107.06496117439029],
      [15.334743478351433, 107.06827264318166]  // end
    ]
  },
  {
    id: 3,
    name: "Water Pump Station",
    address: "Salavan provice, Laos",
    type: "infrastructure",
    gps: [15.725091638246989, 106.45409327160401]
  },
  {
    id: 4,
    name: "Drying Facility",
    address: "Savanakhet Province, Laos",
    type: "infrastructure",
    gps: [16.38465918465874, 105.41973334764475]
  },
  {
    id: 5,
    name: "Cooling System",
    address: "Phouvong District, Laos",
    type: "cooling system",
    gps: [14.735526394571503, 106.86941320857434]
  },
  {
    id: 6,
    name: "Collection Center",
    address: "Dak Cheung District, Laos",
    type: "collection center",
    gps: [15.388466330938611, 107.29468573276748]
  }
  ,
  {
    id: 7,
    name: "Drying Floor",
    address: "Sanamxay District, Laos",
    type: "drying floor",
    gps: [14.782702198959681, 106.349351585875]
  }

,
  {
    id: 8,
    name: "Weighing Station",
    address: "Attapeu province, Laos",
    type: "weighing station",
    gps: [15.107129083050236, 107.42467403649799]
  }

  
];