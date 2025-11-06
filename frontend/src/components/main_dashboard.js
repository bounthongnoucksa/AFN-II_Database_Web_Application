// frontend/src/components/main_dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import { APP_API_URL } from '../constants/appURLConstrants';


export default function MainDashboard({ refreshTrigger }) {

    const [chartDataCBForStaff, setChartDataCBForStaff] = useState([]);
    const [chartDataVillagers, setChartDataVillagers] = useState([]);
    const [chartDataForm1A1, setChartDataForm1A1] = useState([]);
    const [chartDataForm1A1_2, setChartDataForm1A1_2] = useState([]);
    const [chartDataForm1A2, setchartDataForm1A2] = useState([]);
    const [chartDataForm1A3a, setchartDataForm1A3a] = useState([]);
    const [chartDataForm1A3b, setchartDataForm1A3b] = useState([]);
    const [chartDataForm1A3b_2, setchartDataForm1A3b_2] = useState([]);
    const [chartDataForm1A4, setchartDataForm1A4] = useState([]);
    const [chartDataForm1A5a, setchartDataForm1A5a] = useState([]);
    const [chartDataForm1A5b, setchartDataForm1A5b] = useState([]);
    const [chartDataForm1BAct6, setchartDataForm1BAct6] = useState([]);
    const [chartDataForm1BAct6_2, setchartDataForm1BAct6_2] = useState([]);
    const [chartDataForm1BAct7, setchartDataForm1BAct7] = useState([]);
    const [chartDataForm1BAct8, setchartDataForm1BAct8] = useState([]);
    const [chartDataForm1BAct8_2, setchartDataForm1BAct8_2] = useState([]);


    const [chartDataForm3Act1a, setchartDataForm3Act1a] = useState([]);
    const [chartDataForm3Act1b, setchartDataForm3Act1b] = useState([]);
    const [loading, setLoading] = useState(false);

    /**
     * Reusable function to load chart data
     * @param {string} url - API endpoint
     * @param {function} setState - React state setter
     * @param {function} formatter - optional function to format the response data
     */
    const loadChartData = async (url, setState, formatter) => {
        try {
            const response = await axios.get(url);
            const rawData = response.data;
            const formatted = formatter ? formatter(rawData) : rawData;
            setState(formatted);
        } catch (err) {
            console.error(`Error loading chart data from ${url}:`, err);
        }
    };

    // Formatter function for CB staff data
    const formatStaffChartData = (d) => [
        { name: '#Total subjects trained', value: d.TotalSubjectsTrained, fill: '#089477' },
        { name: '#Total staff trained', value: d.TotalStaffTrained, fill: '#089477' },
        { name: '#Women staff', value: d.WomenStaffParticipants, fill: '#089477' },
        { name: '#Men staff', value: d.MenStaffParticipants, fill: '#089477' },
        { name: "#Gov't staff", value: d.GovStaffTrained, fill: '#089477' },
        { name: '#Contracted staff', value: d.ContractedStaffTrained, fill: '#089477' }
    ];

    // Formatter function for CB Villagers data
    const formatVillagersChartData = (d) => [
        { name: '#Total Farmer', value: d.Total_Farmers_Participants, fill: '#1f257d' },
        { name: '#Ethnic Farmer', value: d.Ethnic_Farmer_Participants, fill: '#1f257d' },
        { name: '#Women Farmer', value: d.Women_Farmers_Participants, fill: '#1f257d' },
        { name: '#Men Farmer', value: d.Men_Farmer_Participants, fill: '#1f257d' },
        { name: '#Youth Farmer', value: d.Youth_Farmer_Participants, fill: '#1f257d' },
        { name: '#PWD', value: d.PWD_Participants, fill: '#1f257d' },
        { name: '#APG Member', value: d.APG_Member_Trained, fill: '#1f257d' }
    ];

    // Formatter function for Form 1A1 data
    const formatForm1A1ChartData1 = (d) => [
        { name: '#VNC', value: d.Total_VNC, fill: '#07beb8' },
        { name: '#New construction', value: d.New_Construction, fill: '#07beb8' },
        { name: '#Renovation', value: d.Renovation, fill: '#07beb8' },
        { name: '#VF', value: d.VF_Total, fill: '#07beb8' },
        { name: '#Female VF', value: d.VF_Female, fill: '#07beb8' }
    ];
    // Formatter function for Form 1A1 data
    const formatForm1A1ChartData2 = (d) => [
        { name: '#Total participant', value: d.Total_Participants, fill: '#5e4046' },
        { name: '#Ethnic participant', value: d.Ethnic_Participants, fill: '#5e4046' },
        { name: '#Women participant', value: d.Women_Participants, fill: '#5e4046' },
        { name: '#Youth participant', value: d.Youth_Participants, fill: '#5e4046' },
        { name: '#PW participant', value: d.Pregnant_Women, fill: '#5e4046' },
        { name: '#BW participant', value: d.Breastfeeding_Women, fill: '#5e4046' },
        { name: '#PBW participant', value: d.PBW_Women, fill: '#5e4046' },
    ];
    // Formatter function for Form 1A2 data
    const formatForm1A2ChartData1 = (d) => [
        { name: '#Grant recipient', value: d.Grant_Recipients, fill: '#ff6b00' },
        { name: '#youth recipient', value: d.Youth_Grant_Recipients, fill: '#ff6b00' },
        { name: '#PW', value: d.Pregnant_Women, fill: '#ff6b00' },
        { name: '#BW', value: d.Breastfeeding_Women, fill: '#ff6b00' },
        { name: '#PBW', value: d.Pregnant_Breastfeeding_Women, fill: '#ff6b00' }
    ];
    // Formatter function for Form 1A3a data
    const formatForm1A3aChartData = (d) => [
        { name: "#Village rec'd eqpt.", value: d.Villages_Received_Equipment, fill: '#070847ff' },
        { name: '#Total farmer', value: d.Total_Farmers, fill: '#070847ff' },
        { name: '% women farmer', value: d.Percent_Women_Farmers, fill: '#070847ff' },
        { name: '% of youth farmer', value: d.Percent_Youth_Farmers, fill: '#070847ff' },
        { name: '% of ethnic farmer', value: d.Percent_Ethnic_Minority_Farmers, fill: '#070847ff' }
    ];
    // Formatter function for Form 1A3b data
    const formatForm1A3bChartData = (d) => [
        { name: "#Rice storages built", value: d.Num_Storages_Built, fill: '#301d38ff' },
        { name: "#Rice Bank Committee", value: d.Num_RiceBank_Committees, fill: '#301d38ff' },
        { name: "Cum. No. Borrower HHs", value: d.Cumulative_Borrower_HHs, fill: '#301d38ff' },
        { name: "Init. amt. rice (Tons)", value: d.Total_Initial_Rice_Tons, fill: '#301d38ff' }
    ];
    // Formatter function for Form 1A3b data
    const formatForm1A3b_2ChartData = (d) => [        
        { name: '#Total farmer', value: d.Total_Farmers, fill: '#ff4a4aff' },
        { name: "% of women farmer", value: d.Percent_Women, fill: '#ff4a4aff' },
        { name: "% of youth farmer", value: d.Percent_Youth, fill: '#ff4a4aff' },
        { name: "% of ethnic farmer", value: d.Percent_Ethnic, fill: '#ff4a4aff' }
    ];
    // Formatter function for Form 1A4 data
    const formatForm1A4ChartData = (d) => [
        { name: "#The Cons. Area", value: d.Num_Identified_Cons_Areas, fill: '#247ba0' },
        { name: '#Wild plan Cons. area', value: d.Num_Wild_Plan_Cons_Area, fill: '#247ba0' },
        { name: '#Aquatic Cons. area', value: d.Num_Aquatic_Cons_Area, fill: '#247ba0' },
        { name: '#Total farmers ', value: d.Total_Farmers, fill: '#247ba0' },
        { name: '#Women farmers', value: d.Num_Women_Farmers, fill: '#247ba0' },
        { name: '#Youth farmers', value: d.Num_Youth_Farmers, fill: '#247ba0' },
        { name: '#Ethnic farmer', value: d.Num_Ethnic_Farmers, fill: '#247ba0' }
    ];
    // Formatter function for Form 1A5a data
    const formatForm1A5aChartData = (d) => [
        { name: "#SBCC events Cond.", value: d.Num_SBCC_Events, fill: '#00e65e' },
        { name: '#Total participants', value: d.Total_Participants, fill: '#00e65e' },
        { name: '#Women participants', value: d.Num_Women_Participants, fill: '#00e65e' },
        { name: '#Youth participants', value: d.Num_Youth_Participants, fill: '#00e65e' },
        { name: '#Ethnic farmers', value: d.Num_Ethnic_Participants, fill: '#00e65e' }
    ];
    // Formatter function for Form 1A5b data
    const formatForm1A5bChartData = (d) => [
        { name: "#School impl. HGSF Act.", value: d.Num_Schools_HGSF, fill: '#06bcc1' },
        { name: '#Male students', value: d.Total_Male_Students, fill: '#06bcc1' },
        { name: '#Female students', value: d.Total_Female_Students, fill: '#06bcc1' }
    ];
    // Formatter function for Form 1BAct6 data
    const formatForm1BAct6ChartData = (d) => [
        { name: '#APG formulated', value: d.Num_APG_Formulated, fill: '#3f37c9' },
        { name: '#APG received funds', value: d.Num_APG_Received_Funds, fill: '#3f37c9' },
        { name: '#Poor HHs (HH)', value: d.Num_Poor_HHs, fill: '#3f37c9' },
        { name: '#HHs engaged MSMEs', value: d.HHs_Engaged_MSME, fill: '#3f37c9' }
    ];
    // Formatter function for Form 1BAct6 data (Continued)
    const formatForm1BAct6_2ChartData = (d) => [
        { name: '#Total participants', value: d.Total_Farmers, fill: '#f8aa00ff' },
        { name: '#Women', value: d.Women_Farmers, fill: '#f8aa00ff' },
        { name: '#Youth participants', value: d.Youth_Farmers, fill: '#f8aa00ff' },
        { name: '#Ethnic participants', value: d.Ethnic_Farmers, fill: '#f8aa00ff' },
    ];
    // Formatter function for Form 1BAct7 data
    const formatForm1BAct7ChartData = (d) => [
        { name: '#Total SP.', value: d.Num_Service_Providers, fill: '#36f1cd' },
        { name: '#Women SP.', value: d.Women_Service_Providers, fill: '#36f1cd' },
        { name: '#Youth SP.', value: d.Youth_Service_Providers, fill: '#36f1cd' },
        { name: '#Ethnic SP.', value: d.Ethnic_Service_Providers, fill: '#36f1cd' },
        { name: '#LF', value: d.Lead_Farmers, fill: '#36f1cd' },
        { name: '#VVW', value: d.Village_Veterinary_Workers, fill: '#36f1cd' },
        { name: '#VF (Certified LF)', value: d.Village_Facilitators, fill: '#36f1cd' }
    ];
    // Formatter function for Form 1BAct8 data
    const formatForm1BAct8ChartData = (d) => [
        { name: '#Total MUS', value: d.Total_MUS, fill: '#082d0f' },
        { name: '#New MUS', value: d.New_MUS, fill: '#082d0f' },
        { name: '#Renovated MUS', value: d.Renovated_MUS, fill: '#082d0f' },
        { name: '#O&M Committee', value: d.OM_Committee_Assigned_MUS, fill: '#082d0f' },
        { name: '#O&M Fund collected', value: d.OM_Fund_Collected_MUS, fill: '#082d0f' },
        { name: '#Total participant', value: d.Total_Participants_MUS, fill: '#082d0f' },
        { name: '#Women participant', value: d.Women_Participants_MUS, fill: '#082d0f' }
    ];
    // Formatter function for Form 1BAct8 data
    const formatForm1BAct8_2ChartData = (d) => [
        { name: '#Total Irrigation', value: d.Total_Irrigation, fill: '#00a14b' },
        { name: '#New Irrigation', value: d.New_Irrigation, fill: '#00a14b' },
        { name: '#Renovated Irrigation', value: d.Renovated_Irrigation, fill: '#00a14b' },
        { name: '#O&M Committee', value: d.OM_Committee_Assigned_Irrigation, fill: '#00a14b' },
        { name: '#O&M Fund collected', value: d.OM_Fund_Collected_Irrigation, fill: '#00a14b' },
        { name: '#Total participant', value: d.Total_Participants_Irrigation, fill: '#00a14b' },
        { name: '#Women participant', value: d.Women_Participants_Irrigation, fill: '#00a14b' }
    ];
    // Formatter function for Form 2Act1 data
    // Formatter function for Form 2Act2 data
    // Formatter function for Form 2Act3 data

    // Formatter function for Form 3Act1a data
    const formatForm3Act1aChartData = (d) => [
        { name: '#Meeting conducted', value: d.Num_Meetings_Conducted, fill: '#ce2900ff' },
        { name: '#Total participant', value: d.Total_Participants, fill: '#ce2900ff' },
        { name: '#Female participant', value: d.Female_Participants, fill: '#ce2900ff' },
        { name: '#Youth participant', value: d.Youth_Participants, fill: '#ce2900ff' },
        { name: '#Ethnic participant', value: d.Ethnic_Participants, fill: '#ce2900ff' },
        { name: '#VDP Approved/endorsed', value: d.VDP_Approved_Endorsed, fill: '#ce2900ff' }
    ];
    // Formatter function for Form 3Act1b data
    const formatForm3Act1bChartData = (d) => [
        { name: '#Meeting conducted', value: d.Num_Meetings_Conducted, fill: '#ece800ff' },
        { name: '#Total participant', value: d.Total_Participants, fill: '#ece800ff' },
        { name: '#Female participant', value: d.Female_Participants, fill: '#ece800ff' }
    ];










    // Fetch all charts
    const fetchAllCharts = useCallback(async () => {
        setLoading(true);
        await Promise.all([
            loadChartData(APP_API_URL + '/api/cbForStaff/getDashboardData', setChartDataCBForStaff, formatStaffChartData),
            loadChartData(APP_API_URL + '/api/cbForVillagers/getDashboardData', setChartDataVillagers, formatVillagersChartData),
            loadChartData(APP_API_URL + '/api/form1A1/getDashboardData', setChartDataForm1A1, formatForm1A1ChartData1),
            loadChartData(APP_API_URL + '/api/form1A1/getDashboardData', setChartDataForm1A1_2, formatForm1A1ChartData2),
            loadChartData(APP_API_URL + '/api/form1A2/getDashboardData', setchartDataForm1A2, formatForm1A2ChartData1),
            loadChartData(APP_API_URL + '/api/form1A3a/getDashboardData', setchartDataForm1A3a, formatForm1A3aChartData),
            loadChartData(APP_API_URL + '/api/form1A3b/getDashboardData', setchartDataForm1A3b, formatForm1A3bChartData),
            loadChartData(APP_API_URL + '/api/form1A3b/getDashboardData', setchartDataForm1A3b_2, formatForm1A3b_2ChartData),
            loadChartData(APP_API_URL + '/api/form1A4/getDashboardData', setchartDataForm1A4, formatForm1A4ChartData),
            loadChartData(APP_API_URL + '/api/form1A5a/getDashboardData', setchartDataForm1A5a, formatForm1A5aChartData),
            loadChartData(APP_API_URL + '/api/form1A5b/getDashboardData', setchartDataForm1A5b, formatForm1A5bChartData),
            loadChartData(APP_API_URL + '/api/form1BAct6/getDashboardData', setchartDataForm1BAct6, formatForm1BAct6ChartData),
            loadChartData(APP_API_URL + '/api/form1BAct6/getDashboardData', setchartDataForm1BAct6_2, formatForm1BAct6_2ChartData),
            loadChartData(APP_API_URL + '/api/form1BAct7/getDashboardData', setchartDataForm1BAct7, formatForm1BAct7ChartData),
            loadChartData(APP_API_URL + '/api/form1BAct8/getDashboardData', setchartDataForm1BAct8, formatForm1BAct8ChartData),
            loadChartData(APP_API_URL + '/api/form1BAct8/getDashboardData', setchartDataForm1BAct8_2, formatForm1BAct8_2ChartData),


            loadChartData(APP_API_URL + '/api/form3Act1a/getDashboardData', setchartDataForm3Act1a, formatForm3Act1aChartData),
            loadChartData(APP_API_URL + '/api/form3Act1b/getDashboardData', setchartDataForm3Act1b, formatForm3Act1bChartData)
        ]);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAllCharts();
    }, [refreshTrigger, fetchAllCharts]);

    const charts = [
        { title: '(CB1) Staff Capacity Building Dashboard', data: chartDataCBForStaff },
        { title: '(CB2) Farmers / Villagers Capacity Building', data: chartDataVillagers },
        { title: '(1A.1: FNSs) Farmer Nutrition School / VNC Overview', data: chartDataForm1A1 },
        { title: '(1A.1: FNSs) Farmer Nutrition School / Participants', data: chartDataForm1A1_2 },
        { title: '(1A.2) IHHG', data: chartDataForm1A2 },
        { title: '(1A.3a) Domestic Food Processing', data: chartDataForm1A3a },
        { title: '(1A.3b) Rice Bank', data: chartDataForm1A3b },
        { title: '(1A.3b) Rice Bank (Continue)', data: chartDataForm1A3b_2 },
        { title: '(1A.4) Local food sources and wild food management', data: chartDataForm1A4 },
        { title: '(1A.5a) Community Nutrition and Gender SBCC Activities', data: chartDataForm1A5a },
        { title: '(1A.5b) HGSF', data: chartDataForm1A5b },
        { title: '(1B.Act6) CBOs Strengthening', data: chartDataForm1BAct6 },
        { title: '(1B.Act6) CBOs Strengthening (Continue)', data: chartDataForm1BAct6_2 },
        { title: '(1B.Act7) Agriculture/Rural Advisory Service Improved', data: chartDataForm1BAct7 },
        { title: '(1B.Act8) Climate Change Adaptation Infrastructures (MUS)', data: chartDataForm1BAct8 },
        { title: '(1B.Act8) Climate Change Adaptation Infrastructures (Irrigation)', data: chartDataForm1BAct8_2 },


        { title: '(3Act1a) Village Development Planning', data: chartDataForm3Act1a },
        { title: '(3Act1b) DNC Supports', data: chartDataForm3Act1b },
        // Add more charts if needed
    ];


    // Customs tick for chart to make the label more space as Rechert by default not given
    const CustomYAxisTick = ({ x, y, payload }) => {
        return (
            <text
                x={x}
                y={y}
                textAnchor="end"
                fill="#666"
                fontSize={11}
                fontStyle="normal" //fontStyle="italic"
                fontWeight={560} //fontWeight="bold"
                dy={4}
                dx={-10}
            >
                {payload.value}
            </text>
        );
    };

    //Custom label for bar value to have thousand separator
    const CustomLabel = ({ x, y, width, value }) => {
        const displayValue = value != null ? value.toLocaleString() : '-'; // fallback if null
        return (
            <text
                x={x + width + 3} // move 3px to the right of the bar
                y={y + 20}         // adjust vertically to center
                fill="#3a0ca3"
                fontSize={15}
                textAnchor="start"
            >
                {displayValue}
            </text>
        );
    };




    // ########################################## Main return function ##########################################
    return (
        <div className="container-fluid mt-3">

            {/* Header with button aligned right */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Main Dashboard</h3>
                <button
                    className="btn btn-primary"
                    onClick={fetchAllCharts}
                    disabled={loading}
                >
                    {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </div>

            {/* Grid of charts */}
            <div className="row">
                {charts.map((chart, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                        <div className="card shadow-sm p-3 h-100">
                            <h5 className="text-center text-primary mb-3">{chart.title}</h5>

                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart
                                    data={chart.data}
                                    layout="vertical"
                                    margin={{ top: 10, right: 50, left: 80, bottom: 10 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis type="category" dataKey="name" tick={<CustomYAxisTick />} />
                                    <Tooltip formatter={(value) => value.toLocaleString()} />
                                    <Bar dataKey="value">
                                        {/* <LabelList dataKey="value" position="right" /> */}
                                        <LabelList dataKey="value" content={CustomLabel} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );



    //End of function    
}