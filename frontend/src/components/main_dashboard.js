// frontend/src/components/main_dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function MainDashboard({ refreshTrigger }) {

    const [chartDataCBForStaff, setChartDataCBForStaff] = useState([]);
    const [chartDataVillagers, setChartDataVillagers] = useState([]);
    const [chartDataForm1A1, setChartDataForm1A1] = useState([]);
    const [chartDataForm1A1_2, setChartDataForm1A1_2] = useState([]);
    const [chartDataForm1A2, setchartDataForm1A2] = useState([]);
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
        { name: 'Total subjects trained', value: d.TotalSubjectsTrained, fill: '#089477' },
        { name: 'Total staff trained', value: d.TotalStaffTrained, fill: '#089477' },
        { name: 'Women staff participants', value: d.WomenStaffParticipants, fill: '#089477' },
        { name: 'Men staff participants', value: d.MenStaffParticipants, fill: '#089477' },
        { name: "Gov't staff trained", value: d.GovStaffTrained, fill: '#089477' },
        { name: 'Contracted staff trained', value: d.ContractedStaffTrained, fill: '#089477' }
    ];

    // Formatter function for CB Villagers data
    const formatVillagersChartData = (d) => [
        { name: 'Total Farmers', value: d.Total_Farmers_Participants, fill: '#1f257d' },
        { name: 'Ethnic Farmers', value: d.Ethnic_Farmer_Participants, fill: '#1f257d' },
        { name: 'Women Farmers', value: d.Women_Farmers_Participants, fill: '#1f257d' },
        { name: 'Men Farmers', value: d.Men_Farmer_Participants, fill: '#1f257d' },
        { name: 'Youth Farmers', value: d.Youth_Farmer_Participants, fill: '#1f257d' },
        { name: 'PWD', value: d.PWD_Participants, fill: '#1f257d' },
        { name: 'APG Member', value: d.APG_Member_Trained, fill: '#1f257d' }
    ];

    // Formatter function for Form 1A1 data
    const formatForm1A1ChartData1 = (d) => [
        { name: '# of VNC', value: d.Total_VNC, fill: '#ff6b00' },
        { name: '# New construction', value: d.New_Construction, fill: '#ff6b00' },
        { name: '# Renovation', value: d.Renovation, fill: '#ff6b00' },
        { name: '# of VF', value: d.VF_Total, fill: '#ff6b00' },
        { name: '# of female VF', value: d.VF_Female, fill: '#ff6b00' }
    ];
    // Formatter function for Form 1A1 data
    const formatForm1A1ChartData2 = (d) => [
        { name: 'Total participants', value: d.Total_Participants, fill: '#5e4046' },
        { name: 'Ethnic participants', value: d.Ethnic_Participants, fill: '#5e4046' },
        { name: 'Women participants', value: d.Women_Participants, fill: '#5e4046' },
        { name: 'Youth participants', value: d.Youth_Participants, fill: '#5e4046' },
        { name: '# of PW participants', value: d.Pregnant_Women, fill: '#5e4046' },
        { name: '# of BW participants', value: d.Breastfeeding_Women, fill: '#5e4046' },
        { name: '# of PBW participants', value: d.PBW_Women, fill: '#5e4046' },
    ];
    // Formatter function for Form 1A2 data
    const formatForm1A2ChartData1 = (d) => [
        { name: '# of Grant recipient', value: d.Grant_Recipients, fill: '#082d0f' },
        { name: '# of youth recipients', value: d.Youth_Grant_Recipients, fill: '#082d0f' },
        { name: '#PW', value: d.Pregnant_Women, fill: '#082d0f' },
        { name: '#BW', value: d.Breastfeeding_Women, fill: '#082d0f' },
        { name: '#PBW', value: d.Pregnant_Breastfeeding_Women, fill: '#082d0f' } 
    ];

    // Fetch all charts
    const fetchAllCharts = useCallback(async () => {
        setLoading(true);
        await Promise.all([
            loadChartData('http://localhost:3001/api/cbForStaff/getDashboardData', setChartDataCBForStaff, formatStaffChartData),
            loadChartData('http://localhost:3001/api/cbForVillagers/getDashboardData', setChartDataVillagers, formatVillagersChartData),
            loadChartData('http://localhost:3001/api/form1A1/getDashboardData', setChartDataForm1A1, formatForm1A1ChartData1),
            loadChartData('http://localhost:3001/api/form1A1/getDashboardData', setChartDataForm1A1_2, formatForm1A1ChartData2),
            loadChartData('http://localhost:3001/api/form1A2/getDashboardData', setchartDataForm1A2, formatForm1A2ChartData1)
        ]);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAllCharts();
    }, [refreshTrigger, fetchAllCharts]);

    const charts = [
        { title: '(CB1) Staff Capacity Building Dashboard', data: chartDataCBForStaff },
        { title: '(CB2) Farmers / Villagers Capacity Building', data: chartDataVillagers },
        { title: '(FNSs) Farmer Nutrition School / VNC Overview', data: chartDataForm1A1 },
        { title: '(FNSs) Farmer Nutrition School / Participants', data: chartDataForm1A1_2 },
        { title: '(1A.2) IHHG', data: chartDataForm1A2 },
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
                                    <Tooltip />
                                    <Bar dataKey="value">
                                        <LabelList dataKey="value" position="right" />
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