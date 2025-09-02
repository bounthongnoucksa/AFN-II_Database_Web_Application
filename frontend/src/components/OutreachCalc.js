// frontend/src/components/OutreachCalc.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'; // Import custom CSS for sticky header
import '../OutreachReport.css'; // optional CSS for coloring



export default function OutreachCalc() {
    const [reportingPeriod, setReportingPeriod] = useState('Whole Year');
    const [reportYear, setReportYear] = useState('2025');
    const [reportData, setReportData] = useState([]);
    const [summary, setSummary] = useState([121, '', 347, 118, '7,080,000']);

    // define reporting periods and years
    const reportingPeriods = ['Whole Year', '6-Months', 'Q1', 'Q2', 'Q3', 'Q4'];
    const currentYear = new Date().getFullYear();
    const startYear = 2023;
    const endYear = currentYear + 5;

    const reportYears = Array.from(
        { length: endYear - startYear + 1 },
        (_, i) => (startYear + i).toString()
    );

    //table columns header:
    const tableColumnHeaders = [{
        header1: '',
        header2: 'Outreach C1 - 1  Persons receiving services promoted or supported by the project',
        header3: (<>1.a  Corresponding number <br /> of households reached</>),
        header4: '1.b  Estimated corresponding total number of households members',
        header5: 'TOTAL TARGET HHs (with overlapping)',
        header6: '% not overlapping',
        header7: 'Direct beneficiaries',
        header8: 'TARGET HHs',
        header9: 'Target beneficiaries',
    }];

    //table rows headers:
    const tableRowHeaders = [{
        rowsHeader1: 'Definition',
        rowsHeader2: 'PDR End target',
        rowsHeader3: 'Outreach Formula',
        rowsHeader4: 'Component 1 / Community-driven agriculture- and natural resources-based nutrition interventions establishment (WFP and IFAD)',
        rowsHeader5: 'Sub-component 1a: Improved nutritional status of women, children, girls, and other vulnerable groups (WFP and IFAD)',
        rowsHeader6: 'Activity 1: Farmer Nutrition School and Women Empowerment',
        rowsHeader7: 'Activity 2: Integrated Home Garden establishment',
        rowsHeader8: 'Activity 3: Domestic food processing and conservation',
        rowsHeader9: 'Activity 4: Local food sources, wild foods management',
        rowsHeader10: 'Activity 5: Community nutrition and gender SBCC activities',
        rowsHeader11: 'Sub-Component 1b: Improved agriculture productivity of selected commodities (IFAD)',
        rowsHeader12: 'Activity 6: Community-Based Organizations (CBOs) Strengthening',
        rowsHeader13: 'Activity 7: Agriculture/Rural Advisory Service improved',
        rowsHeader14: 'Activity 8: Climate Change adaptation infrastructures (irrigation /MUS) built and upgraded',
        rowsHeader15: 'Component 2 - Business Partnerships and Market Access improvement (IFAD) ',
        rowsHeader16: 'Activity 1: Support to MSME in food supply chains',
        rowsHeader17: 'Activity 2: Business Multi-Stakeholder Platforms',
        rowsHeader18: 'Activity 3: Market related infrastructures',
        rowsHeader19: 'Component 3 - Enabling environment (IFAD and WFP)',
        rowsHeader20: 'Activity 1: Multisector planning and coordination (WFP)',
        rowsHeader21: 'Activity 2: Partnerships',
        rowsHeader22: 'Activity 3: Project management',

    }];

    // Fetch data from backend API
    const handleFetch = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/form1A1/getOutreachData', {
                params: {
                    reportYear,
                    reportingPeriod
                }
            });
            if (response.data.success) {
                setReportData(response.data.data);
            } else {
                setReportData([]);
            }
        } catch (error) {
            console.error('Error fetching outreach data:', error);
            setReportData([]);
        }


        setSummary([121, '', 347, 118, 708]);
    };





    return (
        <div className="container-fluid p-1">
            <h4 className="mb-4">📊 Outreach Report (Calculation Methodology)</h4>

            <div className="row mb-3 justify-content-center">
                <div className="col-md-2">
                    <label>Reporting Period</label>
                    <select
                        className="form-select"
                        value={reportingPeriod}
                        onChange={(e) => setReportingPeriod(e.target.value)}
                    >
                        {reportingPeriods.map((p) => (
                            <option key={p}>{p}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-2">
                    <label>Report Year</label>
                    <select
                        className="form-select"
                        value={reportYear}
                        onChange={(e) => setReportYear(e.target.value)}
                    >
                        {reportYears.map((y) => (
                            <option key={y}>{y}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-2 d-flex align-items-end">
                    <button className="btn btn-success w-100" onClick={handleFetch}>
                        Get Report
                    </button>
                </div>
            </div>

            <div className="table-responsive">
                <div className="table-responsive" style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '780px' }}>
                    <table className="outreach-table table table-sm table-bordered align-middle text-center fs-7 ">
                        {/* Column header */}
                        <thead className="sticky-header">
                            <tr className="table-success">
                                <th style={{ width: '15%', whiteSpace: 'nowrap' }}>{tableColumnHeaders[0].header1}</th>
                                <th style={{ width: '25%' }}>{tableColumnHeaders[0].header2}</th>
                                <th style={{ width: '20%' }}>{tableColumnHeaders[0].header3}</th>
                                <th style={{ width: '19%' }}>{tableColumnHeaders[0].header4}</th>
                                <th >{tableColumnHeaders[0].header5}</th>
                                <th >{tableColumnHeaders[0].header6}</th>
                                <th >{tableColumnHeaders[0].header7}</th>
                                <th style={{ whiteSpace: 'nowrap' }}>{tableColumnHeaders[0].header8}</th>
                                <th >{tableColumnHeaders[0].header9}</th>

                            </tr>

                        </thead>

                        {/* Rows header */}
                        <tbody >

                            {/* Definition */}
                            <tr>
                                <td className="text-end">{tableRowHeaders[0].rowsHeader1}</td>
                                <td className="text-start">"This refers to individuals who have directly participated in or received services from the project:
                                    <br />C1: Actual number of FNS attendes + WFAS Grant recipients (husband and wife i.e. 2 per HH) + APG members (husband and wife i.e. 2 per HH) + people working in and having rights over irrigated fields (husband and wife i.e. 2 per HH)
                                    <br />C2:  SMEs owner and seasonal employees beneffiting from the project + actual no of MSP meeting attendees + all HH members living in upgraded roads catchment area
                                    <br />C3: people included in CSO activities "</td>

                                <td className="text-start">For each individual receiving services, the corresponding household is counted. If more than one person in a household benefits, the household is counted only once.
                                    Eliminate overlaps if the same households are counted over multiple years.</td>
                                <td>The total number of people in the households that received services. It includes all members of the household, whether they received services or not.</td>
                                <td></td>
                                <td></td>
                                <td>Outreach 1</td>
                                <td>Outreach 1a</td>
                                <td>Outreach 1b</td>
                            </tr>

                            {/* PDR End target */}
                            <tr>
                                <td className="text-end">{tableRowHeaders[0].rowsHeader2}</td>
                                <td>168,000 - to be corrected as 75,000</td>
                                <td>28,000</td>
                                <td>168,000</td>
                                <td></td>
                                <td></td>
                                <td>75,000</td>
                                <td>28,000</td>
                                <td>168,000</td>
                            </tr>

                            {/* Outreach Formula */}
                            <tr>
                                <td className="text-end">{tableRowHeaders[0].rowsHeader3}</td>
                                <td>1+(40%×2)+(50%×3)+(40%×4)+5+(10%×6)+(60%×7)+(30%×8)</td>
                                <td>(Sum of HHs reached across activities)×(1−Average overlap percentage)</td>
                                <td>Outreach 1.a×Average Household Size (6)</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr className="table-success">
                                <td colSpan="9" className="text-start">{tableRowHeaders[0].rowsHeader4}</td>

                            </tr>
                            {/* Sub-component 1a*/}
                            <tr>
                                <td className="text-start">{tableRowHeaders[0].rowsHeader5}</td>
                                <td></td>
                                <td></td>
                                <td>6</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>HH size</td>
                            </tr>

                            {/* Component 1 Activity 1*/}
                            <tr>
                                <td className="text-start">{tableRowHeaders[0].rowsHeader6}</td>
                                <td>1. Actual number of FNS attendees </td>
                                <td>Corresponding number of actual HH by HH ID of FNS members</td>
                                <td>Target households (1.a)×Average HH size  ( 6)</td>
                                <td className="table-info" title='1A.1: Count all Participant HH-ID + Name'>{(reportData[0]?.Count_1A1_All_Participants || '0').toLocaleString()}</td>
                                <td>100%</td>
                                <td className="table-info" title='1A.1: Count all Participant HH-ID + Name'>{(reportData[0]?.Count_1A1_All_Participants || '0').toLocaleString()}</td>
                                <td className="table-info" title='1A.1: Count unique number of HH-ID'>{(reportData[0]?.Count_1A1_Unique_HH_ID || '0').toLocaleString()}</td>
                                <td className="table-info" title='1A.1: Count unique number of HH-ID * 6'>{((reportData[0]?.Count_1A1_Unique_HH_ID || '0') * 6).toLocaleString()}</td>
                            </tr>
                            {/* Component 1 Activity 2*/}
                            <tr>
                                <td className="text-start">{tableRowHeaders[0].rowsHeader7}</td>
                                <td>NOT CALCULATED IN OUTREACH DUE TO 100% OVERLAP WITH FNS</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            {/* Component 1 Activity 3*/}
                            <tr>
                                <td className="text-start">{tableRowHeaders[0].rowsHeader8}</td>
                                <td>NOT CALCULATED IN OUTREACH DUE TO 100% OVERLAP WITH FNS AND APG</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            {/* Component 1 Activity 4*/}
                            <tr>
                                <td className="text-start">{tableRowHeaders[0].rowsHeader9}</td>
                                <td className="text-start">2. Number of WFAS Grant recipients (husband and wife i.e. 2 per HH) assuming a 60% overlap with FNS and 60% overlap with APG.</td>
                                <td>/2</td>
                                <td>Target households (1.a)×Average HH size   (6)</td>
                                <td></td>
                                <td>40%</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            {/* Component 1 Activity 5*/}
                            <tr>
                                <td className="text-start">{tableRowHeaders[0].rowsHeader10}</td>
                                <td>NOT CALCULATED IN OUTREACH DUE TO 100% OVERLAP WITH FNS</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            {/* Sub-Component 1b*/}
                            <tr>
                                <td className="text-start">{tableRowHeaders[0].rowsHeader11}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            {/* Component 1 Activity 6*/}
                            <tr>
                                <td className="text-start">{tableRowHeaders[0].rowsHeader12}</td>
                                <td className="text-start">3. Actual number of APG members (husband and wife i.e. 2 per HH) estimating a 50% overlap with FNS</td>
                                <td>/2</td>
                                <td>In PDR</td>
                                <td></td>
                                <td>50%</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            {/* Component 1 Activity 7*/}
                            <tr>
                                <td className="text-start">{tableRowHeaders[0].rowsHeader13}</td>
                                <td>NOT CALCULATED IN OUTREACH DUE TO 100% OVERLAP WITH APG</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            {/* Component 1 Activity 8*/}
                            <tr>
                                <td className="text-start">{tableRowHeaders[0].rowsHeader14}</td>
                                <td className="text-start">4. Actual number of people who are actually working in (and have rights over) the irrigated fields (husband and wife i.e. 2 per HH). Estimated overlap of 60% with APG</td>
                                <td>/2</td>
                                <td>100 villages * 20 HHs</td>
                                <td></td>
                                <td>40%</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            {/* Component 2 */}
                            <tr className="table-success">
                                <td colSpan="9" className="text-start">{tableRowHeaders[0].rowsHeader15}</td>
                            </tr>
                            {/* Component 2 Activity 1*/}
                            <tr>
                                <td className="text-start">{tableRowHeaders[0].rowsHeader16}</td>
                                <td className="text-start">5. MSME size (70*3) receiving at least one of the project's services/goods. </td>
                                <td>Corresponding number of actual HH by HH ID</td>
                                <td>70 MSME * 3 HHs</td>
                                <td></td>
                                <td>100%</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            {/* Component 2 Activity 2*/}
                            <tr>
                                <td className="text-start">{tableRowHeaders[0].rowsHeader17}</td>
                                <td>employees of this </td>
                                <td>Corresponding number of actual HH by HH ID <br />(Changed HH-ID to the names of business or the owners)</td>
                                <td>90 MSP sessions * 25</td>
                                <td></td>
                                <td>10%</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            {/* Component 2 Activity 3*/}
                            <tr>
                                <td className="text-start">{tableRowHeaders[0].rowsHeader18}</td>
                                <td className="text-start">7. All HH members living in the catchment area of AFN II upgraded roads (300km*average number of HH members living along the road), estimating an overall of 40% overlap with beneficiaires from activities above </td>
                                <td>/6 (average HH size)</td>
                                <td>100 villages * 80 HHs (only access tracks)</td>
                                <td></td>
                                <td>60%</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            {/* Component 3 */}
                            <tr className="table-success">
                                <td colSpan="9" className="text-start">{tableRowHeaders[0].rowsHeader19}</td>
                            </tr>
                            {/* Component 3 Activity 1*/}
                            <tr>
                                <td className="text-start">{tableRowHeaders[0].rowsHeader20}</td>
                                <td>NOT CALCULATED IN OUTREACH DUE TO 100% OVERLAP WITH PROJECT ACTIVITIES</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            {/* Component 3 Activity 2*/}
                            <tr>
                                <td className="text-start">{tableRowHeaders[0].rowsHeader21}</td>
                                <td className="text-start">8. 2 HH members (wife and husband)  included in CSO activities (estimated overlap of 70% with other activities)</td>
                                <td>/2</td>
                                <td>Target households (1.a)×Average HH size ( 6)</td>
                                <td></td>
                                <td>30%</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            {/* Component 3 Activity 3*/}
                            <tr>
                                <td className="text-start">{tableRowHeaders[0].rowsHeader22}</td>
                                <td>NOT INCLUDED IN THE OUTREACH</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>

                        </tbody>


                        <tfoot>
                            <tr style={{ backgroundColor: '#f9caa8', fontWeight: 'bold' }}>
                                <td colSpan="4">Total</td>
                                {summary.map((num, i) => (
                                    <td key={i}>{num}</td>
                                ))}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div >
    );

};