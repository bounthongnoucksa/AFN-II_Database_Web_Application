import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
//import { logFrameData as localData } from '../constants/logFrameDataConstants';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'; // Import custom CSS for sticky header
import { APP_API_URL } from '../constants/appURLConstrants';

export default function LogFrame() {
    
    const [data, setData] = useState([]);

    // const fetchData = () => {
    //     setData(localData);
    // };

    const fetchData = async () => {
        try {
            const response = await fetch(APP_API_URL +'/api/all/getLogframeData'); // Updated endpoint
            setData(await response.json());
        } catch (error) {
            console.error('Error fetching logframe data:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (!data || data.length === 0) return <p>Loading...</p>;

    //const years = Object.keys(data[0]?.yearlyData ?? {}).sort(); // auto-detect years from data
    const years = ["2023", "2024-current", "2024", "2025", "2026", "2027", "2028", "2029", "2030"]; // Manually set years to match modified data structure as requested by user
    const totalColumns = 6 + years.length * 3; // 6 fixed columns + 3 per year

    // Group by indicatorGroup
    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.indicatorGroup]) {
            acc[item.indicatorGroup] = [];
        }
        acc[item.indicatorGroup].push(item);
        return acc;
    }, {});









    return (

        <div className="container-fluid p-1">
            <h4 className="mb-1">📈 Logical Framework Update</h4>
            <div>
                <Row className="mb-2">
                    <Col xs="auto">
                        <button className="btn btn-success" onClick={fetchData}>🔄 Refresh Data</button>
                    </Col>
                </Row>
            </div>

            <div>
                <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '820px' }}>
                    <table bordered hover className=" align-middle table table-sm table-bordered fs-7">
                        <thead className=" sticky-header-log-for-frame text-center align-middle">
                            <tr className='table-success'>
                                <th rowSpan="3" className='row-header-sticky-col-1'>Results Hierarchy</th>
                                <th rowSpan="3" className='row-header-sticky-col-2'>Indicator</th>
                                <th rowSpan="3" className='row-header-sticky-col-3'>Baseline</th>
                                <th rowSpan="3" className='row-header-sticky-col-4'>Mid-Term</th>
                                <th rowSpan="3" className='row-header-sticky-col-5'>End Target</th>

                                {/* Map column head by exact year*/}
                                {/* {years.map((year, index) => (
                                    <th key={`main-${year}-${index}`} colSpan="3" className="table-success" style={{ zIndex: 1 }}> Project Yr {index + 1}</th>
                                ))} */}

                                {/* Mapp column head manual as user request to have some current and new data column head to compare */}
                                {years.map((year, index) => {
                                    let label = `Project Yr ${index + 1}`;

                                    // Append custom suffixes for specific columns
                                    if (index === 1) label += ' (Current)';
                                    if (index === 2) label = 'Project Yr 2 (Updated)'; // Keep number same
                                    if (index >= 3) label = `Project Yr ${index}`; // Shift subsequent years back by 1

                                    return (
                                        <th
                                            key={`main-${year}-${index}`}
                                            colSpan="3"
                                            className="table-success"
                                            style={{ zIndex: 1 }}
                                        >
                                            {label}
                                        </th>
                                    );
                                })}


                            </tr>
                            <tr>
                                {years.map((year) => (
                                    <th key={`yr-${year}`} colSpan="3" className="table-success">{year}</th>
                                ))}
                            </tr>
                            <tr>
                                {years.map((year) => (
                                    <React.Fragment key={`sub-${year}`}>
                                        <th className="table-info">Target</th>
                                        <th className="table-primary">Result</th>
                                        <th className="table-warning">Cumulative</th>
                                    </React.Fragment>
                                ))}
                            </tr>
                        </thead>



                        <tbody>
                            {Object.entries(groupedData).map(([groupTitle, rows], groupIndex) => (
                                <React.Fragment key={`group-${groupIndex}`}>
                                    <tr className="table-secondary fw-bold text-start">
                                        <td colSpan={totalColumns}>Output: {groupTitle}</td>
                                        {/* <td colSpan= '1'>Output</td> */}
                                        {/* <td colSpan= '10'>Output: {groupTitle}</td> */}
                                    </tr>

                                    {rows.map((row, rowIndex) => (
                                        
                                        <tr key={`row-${groupIndex}-${rowIndex}`}>
                                            
                                            {/* Render the 'hierarchy' cell only for the first row in the group */}
                                            {rowIndex === 0 && (<td rowSpan={rows.length} className='row-header-sticky-col-1'>{row.hierarchy}</td>)} 
                                                                                       
                                            <td className='row-header-sticky-col-2 text-start'>{row.indicator}</td>
                                            <td className='row-header-sticky-col-3'>{row.baseline}</td>
                                            <td className='row-header-sticky-col-4'>{row.midTerm.toLocaleString()}</td>
                                            <td className='row-header-sticky-col-5'>{row.endTarget.toLocaleString()}</td>
                                            
                                            {years.map((year) => (
                                                <React.Fragment key={`data-${rowIndex}-${year}`}>
                                                    <td className="table-info">{(row.yearlyData[year]?.target.toLocaleString() ?? '-')}</td>
                                                    <td className="table-danger">{row.yearlyData[year]?.result.toLocaleString() ?? '-'}</td>
                                                    <td className="table-warning">{row.yearlyData[year]?.cumulative.toLocaleString() ?? '-'}</td>
                                                </React.Fragment>
                                            ))}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
