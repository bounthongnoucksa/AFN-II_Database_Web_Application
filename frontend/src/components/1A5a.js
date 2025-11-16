// frontend/src/components/1A5a.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Spinner, Button } from 'react-bootstrap'; // Import React Bootstrap components for modal message and buttons
import '../App.css'; // Import custom CSS for sticky header
import { APP_API_URL } from '../constants/appURLConstrants';
import FilterPanel from '../searchPannel/FilterPanel';



export default function Form1A5a({ refreshTrigger }) {
    const [data, setData] = useState([]);
    const [language, setLanguage] = useState('LA'); // default language
    const [loading, setLoading] = useState(false);
    const [pageSize, setpageSize] = useState(100); // limit the result to 200 records by default. if want to change this value then need to change on refresh button below as well.
    const [total, setTotal] = useState(0);        // total records
    const [page, setPage] = useState(1);          // current page
    const totalPages = Math.ceil(total / pageSize);

    const [filters, setFilters] = useState([]); //for filter function
    const [showFilterPanel, setShowFilterPanel] = useState(false); //for filter function



    // add new
    const [submissionID, setSubmissionID] = useState('');
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });

    const [showModal, setShowModal] = useState(false); // Modal state for data examination
    const [modalData, setModalData] = useState([]); //modal data to display in the popup for examine and edit page

    const [selectedRow, setSelectedRow] = useState({});
    const [selectedUUID, setSelectedUUID] = useState(''); // UUID of submission for the current selected row

    // modal message box state
    const [loadingModalMessage, setLoadingModalMessage] = useState(false);
    const [loadingModalExcelExportMessage, setloadingModalExcelExportMessage] = useState(false); // for modal loading pop state during excel export
    const [modalMessage, setModalMessage] = useState(''); // Message to display in the modal message box as a pop up showing
    const [showSuccessModalMessage, setShowSuccessModalMessage] = useState(false);

    // Fetch main table data
    const fetchData = async (lang, pageNumber = page, limit = pageSize, filters = []) => {
        setLoading(true);
        try {
            //const res = await axios.get(APP_API_URL + `/api/form1A5a/getParticipantData?lang=${lang}`);
            // Convert filters to JSON string for query param
            const filtersParam = JSON.stringify(filters);

            const res = await axios.get(`${APP_API_URL}/api/form1A5a/getParticipantData`, {
                params: {
                    lang,
                    page: pageNumber,
                    limit,
                    filters: filtersParam
                }
            });
            if (res.data.success) {
                setData(res.data.data.data);
                setTotal(res.data.data.total);
                setPage(res.data.data.page);
            } else {
                setData([]);
                setTotal(0);
                setPage(1);
            }
        } catch (error) {
            console.error('Error fetching form 1A5a data:', error);
            setData([]);
        }
        setLoading(false);

    };


    // Fetch modal data for the selected submission
    const fetchModalData = async () => {
        try {
            const res = await axios.get(APP_API_URL + `/api/form1A5a/getParticipantDataBySID?submissionId=${submissionID}&lang=${language}`);
            if (res.data.success) {
                const modalRows = res.data.data;
                setModalData(modalRows);

                // ✅ Automatically select the first row (if any)
                if (modalRows.length > 0) {
                    setSelectedRow(modalRows[0]);
                } else {
                    setSelectedRow({});
                }
            } else {
                setModalData([]);
                setSelectedRow({});
            }
        } catch (error) {
            console.error('Error fetching modal data:', error);
            setModalData([]);
            setSelectedRow({});
        }
    };






    // Load data on mount and when language changes
    // useEffect(() => {
    //     fetchData(language, page, pageSize, filters);
    // }, [language, refreshTrigger, page, pageSize, filters]);
    useEffect(() => {
        // If filters are active, show all data (disable pagination)
        if (filters && filters.length > 0) {
            // Always reset page to 1
            setPage(1);
            // Pass a very large limit or empty string to fetch all
            fetchData(language, 1, 9999999, filters);
        } else {
            // Normal paginated mode
            fetchData(language, page, pageSize, []);
        }
    }, [language, refreshTrigger, page, pageSize, filters]);

    //Langauge toggle function
    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'LA' ? 'EN' : 'LA'));
    };

    //     // // Handle delete submission from KoboToolbox
    //     // const handleDeleteSubmission = async () => {
    //     //     if (!submissionID) {
    //     //         alert('Please select a submission to delete.');
    //     //         return;
    //     //     }

    //     //     if (window.confirm(`Are you sure you want to delete submission ID: ${submissionID}? This will remove all associated data.`)) {
    //     //         try {
    //     //             setLoadingModalMessage(true);
    //     //             const response = await axios.delete(APP_API_URL + `/api/form1A5a/deleteSubmission?submissionId=${submissionID}`);
    //     //             if (response.data.success) {
    //     //                 setModalMessage('✅ Submission deleted successfully');
    //     //                 setShowSuccessModalMessage(true);
    //     //                 fetchData(language); // Refresh data after deletion
    //     //                 closeModal(); // Close the modal after deletion completed
    //     //             } else {
    //     //                 setModalMessage('❌ Failed to delete submission');
    //     //                 setShowSuccessModalMessage(true);
    //     //             }
    //     //         } catch (error) {
    //     //             console.error('Error deleting submission:', error);
    //     //             // ✅ extract meaningful message from KoboToolbox error response
    //     //             const errorMsg =
    //     //                 error.response?.data?.error || // from backend
    //     //                 error.response?.data?.message || // fallback from backend
    //     //                 error.message || // network error
    //     //                 'Unknown error';
    //     //             setModalMessage(`❌ Error deleting submission: ${errorMsg}`);
    //     //             setShowSuccessModalMessage(true);
    //     //         } finally {
    //     //             setLoadingModalMessage(false);
    //     //         }
    //     //     }
    //     // }

    const handleSubmissionUUID = async () => {
        if (!submissionID) {
            alert('Please select a submission to get UUID.');
            return;
        }

        try {
            const response = await axios.get(APP_API_URL + `/api/form1A5a/getUUID?submissionId=${submissionID}`);
            if (response.data.success) {
                const uuid = response.data.uuid;
                setSelectedUUID(uuid);
                return uuid; // ✅ Return the UUID
            } else {
                alert('Failed to fetch UUID');
                return null;
            }
        } catch (error) {
            console.error('Error fetching UUID:', error);
            alert('Error fetching UUID');
            return null;
        }

    }


    // Cell click/right-click handlers for data table
    const handleCellClick = (row) => {
        setSubmissionID(row[Object.keys(row)[1]]);

    };

    const handleContextMenu = (e, row) => {
        e.preventDefault();
        setSubmissionID(row[Object.keys(row)[1]]);
        setContextMenuPos({ x: e.pageX, y: e.pageY });
        setShowContextMenu(true);
    };

    // Context menu Examine item click handlers
    const handleExamine = () => {
        setShowContextMenu(false);
        handleSubmissionUUID(submissionID); // Get UUID for the selected submission
        fetchModalData();
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalData([]);
        setSelectedRow({});
    };

    //cb for staff export to Excel
    const handleExcelExport = async () => {
        try {
            setloadingModalExcelExportMessage(true); //for modal Exporting pop state
            const response = await axios.get(APP_API_URL + `/api/form1A5a/exportToExcel?lang=${language}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Form_1A5a_Exported_Report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Export failed', error);
            alert('Form 1A5a Export to Excel failed');
        }finally {
            setloadingModalExcelExportMessage(false); //for modal Exporting pop state
        }
    };


    //Download data from KoboToolbox to local database
    const handleDownloadForm1A5aDataFromKobo = async () => {
        try {
            setLoadingModalMessage(true); //for modal loading pop state
            const response = await axios.get('http://localhost:3001/api/form1A5a/downloadFromKoboToolbox');
            if (response.data.success) {
                //alert('Data downloaded successfully from KoboToolbox');
                setModalMessage('✅ Operation completed successfully!');
                setShowSuccessModalMessage(true); // Show the modal loading completed with the message

                fetchData(language); // Refresh data after download

            } else {
                //alert('Failed to download data from KoboToolbox');
                setModalMessage('❌ Failed to download Form 1A5a data from KoboToolbox');
                setShowSuccessModalMessage(true); // Show the modal loading completed with the message
            }
        } catch (error) {
            console.error('Error downloading Form 1A5a data from KoboToolbox:', error);
            //alert('Error downloading Form 1A5a data from KoboToolbox');
            setModalMessage('❌ Error downloading Form 1A5a data from KoboToolbox');
            setShowSuccessModalMessage(true); // Show the modal loading completed with the message
        } finally {
            setLoadingModalMessage(false); //for modal loading pop state
            //setShowModalMessage(true); // Show the modal with the message
        }
    }



    // ✅ Helper: get new submissionId by UUID and refresh modal data
    const refreshModalWithNewSubmission = async (uuid, language) => {
        if (!uuid) {
            alert("UUID is empty.");
            return;
        }

        try {
            // Step 1: get the new submissionId
            const response = await axios.get(APP_API_URL + `/api/form1A5a/getNewSubmissionID?Uuid=${uuid}`);


            if (response.data.success) {
                const newSubmissionId = response.data.newSubmissionId;
                setSubmissionID(newSubmissionId);
                //alert(`New submission ID: ${newSubmissionId}`);

                // Step 2: fetch modal data for this new submissionId
                const res = await axios.get(
                    APP_API_URL + `/api/form1A5a/getParticipantDataBySID?submissionId=${newSubmissionId}&lang=${language}`
                );

                if (res.data.success) {
                    const modalRows = res.data.data;
                    setModalData(modalRows);

                    // Auto-select first row
                    if (modalRows.length > 0) {
                        setSelectedRow(modalRows[0]);
                    } else {
                        setSelectedRow({});
                    }
                } else {
                    setModalData([]);
                    setSelectedRow({});
                }

                return true;



            } else {
                alert("Failed to fetch new submission ID");
                return false;
            }
        } catch (error) {
            console.error("Error refreshing modal:", error);
            setModalData([]);
            setSelectedRow({});

            return false;
        }
    };


    //     // // Handle delete a participant and update the submission in KoboToolbox
    //     // // Add a small delay to allow React to re-render before refreshing the modal
    //     // // This is necessary because the modal might still be showing the old submission ID when the deletion is completed
    //     // //const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    //     // const handleDeleteParticipant = async (participantId, submissionId) => {
    //     //     if (!participantId || !submissionId) {
    //     //         alert('Please select a participant and submission to delete.');
    //     //         return;
    //     //     }

    //     //     const confirmDelete = window.confirm(
    //     //         `Are you sure you want to delete participant ID: ${participantId} from submission ID: ${submissionId}?`
    //     //     );

    //     //     if (!confirmDelete) return;

    //     //     // ✅ Get updated UUID before refreshing the modal before the current submissionID got deleted
    //     //     const uuid = await handleSubmissionUUID(); // This should return the UUID now

    //     //     try {
    //     //         setLoadingModalMessage(true);

    //     //         const response = await axios.post('http://localhost:3001/api/form1A5a/deleteParticipant', { participantId, submissionId });

    //     //         if (response.data.success) {
    //     //             setModalMessage('✅ Participant deleted successfully');
    //     //             setShowSuccessModalMessage(true);

    //     //             // 🔄 Reload main data and refresh main table
    //     //             await handleDownloadCBStaffDataFromKobo();
    //     //             await fetchData(language);

    //     //             // 🔄 Refresh modal with new submission ID

    //     //             if (uuid) {
    //     //                 //alert(`UUID: ${uuid} is available, refreshing modal...`);
    //     //                 // <-- Add a small delay here before returning
    //     //                 //await delay(2000);  // 100ms delay to let React re-render;

    //     //                 const refreshed = await refreshModalWithNewSubmission(uuid, language);
    //     //                 if (!refreshed) {
    //     //                     console.warn("⚠️ Modal refresh failed after deletion.");
    //     //                 } else {
    //     //                     console.warn("⚠️ UUID not available, skipping modal refresh.");
    //     //                 }

    //     //             } else {
    //     //                 console.warn("⚠️ Could not refresh modal: UUID not available.");
    //     //             }

    //     //         } else {
    //     //             setModalMessage('❌ Failed to delete participant');
    //     //             setShowSuccessModalMessage(true);
    //     //         }
    //     //     } catch (error) {
    //     //         console.error('Error deleting participant:', error);

    //     //         const errorMsg =
    //     //             error.response?.data?.error ||
    //     //             error.response?.data?.message ||
    //     //             error.message ||
    //     //             'Unknown error';

    //     //         setModalMessage(`❌ Error deleting participant: ${errorMsg}`);
    //     //         setShowSuccessModalMessage(true);
    //     //     } finally {
    //     //         setLoadingModalMessage(false);
    //     //     }
    //     // }

    //     // // Edit submission and participant data in local database and KoboToolbox
    //     // const handleEditSubmissionAndParticipants = async () => {
    //     //     //console.log("Selected row to update:", selectedRow);
    //     //     const confirmEdit = window.confirm(`Are you sure you want to edit the selected participant?`);

    //     //     if (!confirmEdit) return;
    //     //     // ✅ Get updated UUID before refreshing the modal before the current submissionID got deleted from KoboToolbox
    //     //     const uuid = await handleSubmissionUUID(); // This should return the UUID now


    //     //     try {
    //     //         //for modal loading pop state
    //     //         setLoadingModalMessage(true); 

    //     //         const response = await axios.post('http://localhost:3001/api/form1A5a/updateParticipantAndSubmissionData', selectedRow); // Send the edited data object

    //     //         if (response.data.success) {
    //     //             //alert('✅ Record updated successfully');
    //     //             setModalMessage('✅ Participant data updated successfully');
    //     //             setShowSuccessModalMessage(true);

    //     //             // 🔄 Reload main data and refresh main table
    //     //             await handleDownloadCBStaffDataFromKobo();
    //     //             await fetchData(language);

    //     //             if (uuid) {
    //     //                 //alert(`UUID: ${uuid} is available, refreshing modal...`);
    //     //                 // <-- Add a small delay here before returning
    //     //                 //await delay(5000);  // 100ms delay to let React re-render;

    //     //                 const refreshed = await refreshModalWithNewSubmission(uuid, language);
    //     //                 if (!refreshed) {
    //     //                     console.warn("⚠️ Modal refresh failed after deletion.");
    //     //                 } else {
    //     //                     console.warn("⚠️ UUID not available, skipping modal refresh.");
    //     //                 }

    //     //             } else {
    //     //                 console.warn("⚠️ Could not refresh modal: UUID not available.");
    //     //             }

    //     //             // Refresh table and modal if needed
    //     //             fetchData(language);
    //     //             await refreshModalWithNewSubmission(selectedUUID, language);
    //     //         } else {
    //     //             alert('❌ Failed to update record');
    //     //         }
    //     //     } catch (err) {
    //     //         console.error('Error updating record:', err);
    //     //         alert('❌ Error occurred while updating');
    //     //     } finally{
    //     //         setLoadingModalMessage(false); //for modal loading pop state
    //     //     }


    //     // }

    //function to validate datetime to a valid ISO date string like "2025-08-20"
    function isValidDate(dateString) {
        return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
    }






    // ########################################## Main return function ##########################################
    return (
        <div onClick={() => setShowContextMenu(false)}>

            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="text-center w-100">
                    <div className="fw-bold fs-5">1A.5a: ການສື່ສານການປ່ຽນແປງພຶດຕິກຳດ້ານບົດບາດຍິງ-ຊາຍ ແລະ ໂພຊະນາການໃນຊຸມຊົນ</div>
                    <div>Community Nutrition and Gender SBCC Activities</div>
                </div>

                {/* Language switchig button between LA and EN */}
                <div className="position-absolute end-0 me-4">
                    <button className="btn btn-warning btn-sm" onClick={toggleLanguage}> {language === 'LA' ? 'EN' : 'LA'}</button>
                </div>
            </div>


            {/* Buttons */}
            <div className="d-flex justify-content-between mb-2">
                <div className="d-flex align-items-center flex-wrap">
                    {/* <button className='btn btn-primary btn-sm me-2 ' style={{ width: '120px' }} onClick={() => fetchData(language)} title='To reload data from application database'>Refresh</button> */}
                    <button className='btn btn-primary btn-sm me-2' style={{ width: '120px' }} onClick={() => { setpageSize(''); }} title='Show all records of existing data for this activity (can be slow)'>Show all data</button>
                    <button className='btn btn-primary btn-sm me-2' style={{ width: '120px' }} onClick={handleDownloadForm1A5aDataFromKobo} title='To cleanup application database and reload new data from KoboToolbox online database'>Load new data</button>
                    <button className='btn btn-primary btn-sm me-2' style={{ width: '120px' }} onClick={handleExcelExport} title='To export the data to Excel template file' >Export</button>
                    <button className='btn btn-primary btn-sm' style={{ width: '120px' }} onClick={() => setShowFilterPanel(!showFilterPanel)} title='To show or hide filter for the search result' >Filter</button>
                    {showFilterPanel && (
                        <div className="ms-2">
                            <FilterPanel filters={filters} setFilters={setFilters} />
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden input */}
            <input type="hidden" id="txt_submissionID" value={submissionID} readOnly />
            <input type="hidden" id="txt_selectedUUID" value={selectedUUID} readOnly />




            {/* Modal Message for loading wait progresss with spinner*/}
            <Modal show={loadingModalMessage} centered backdrop="static">
                <Modal.Body className="text-center">
                    <Spinner animation="border" role="status" className="mb-2">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <div>Loading new data from KoboToolbox...</div>
                </Modal.Body>
            </Modal>
            {/* Modal Message for loading Success*/}
            <Modal show={showSuccessModalMessage} onHide={() => setShowSuccessModalMessage(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Transaction status:</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowSuccessModalMessage(false)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Message for exporting excel file wait progresss with spinner*/}
            <Modal show={loadingModalExcelExportMessage} centered backdrop="static">
                <Modal.Body className="text-center">
                    <Spinner animation="border" role="status" className="mb-2">
                        <span className="visually-hidden">Exporting...</span>
                    </Spinner>
                    <div>Exporting data to Excel file...</div>
                </Modal.Body>
            </Modal>




            {/* Main Table */}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <div className="table-responsive" style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '616px' }}>
                        <table className="table table-bordered table-hover table-sm text-nowrap">
                            <thead className="table-success sticky-header">
                                {data.length > 0 && (
                                    <tr>
                                        {Object.keys(data[0]).map((col) => (
                                            <th key={col}>{col}</th>
                                        ))}
                                    </tr>
                                )}
                            </thead>
                            <tbody>
                                {data.map((row, rowIdx) => (
                                    <tr
                                        key={rowIdx}
                                        className={row === selectedRow ? 'table-warning' : ''}
                                        onClick={() => {
                                            setSelectedRow(row);
                                            handleCellClick(row);
                                        }}
                                        onContextMenu={(e) => handleContextMenu(e, row)}
                                    >
                                        {Object.entries(row).map(([col, value], colIdx) => (
                                            <td key={col}>
                                                {(colIdx >= 18 && colIdx <= 23 && value != null && value != '' && !isNaN(value))
                                                    ? Number(value).toLocaleString()
                                                    : value ?? ''}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        {total > 0 && filters.length === 0 && (
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <div>
                                    Showing page {Number.isInteger(page) ? page : 1} of {Number.isFinite(totalPages) ? totalPages : 1} ({total} records)
                                </div>

                                <div className="btn-group">
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        disabled={page <= 1 || page === undefined}
                                        onClick={() => {
                                            const newPage = page - 1;
                                            setPage(newPage);
                                            fetchData(language, newPage, pageSize);

                                        }}
                                    >
                                        Previous
                                    </button>

                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        disabled={page >= totalPages || page === undefined}
                                        onClick={() => {
                                            const newPage = page + 1;
                                            setPage(newPage);
                                            fetchData(language, newPage, pageSize);

                                        }}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            )}


            {/* Context Menu */}
            {showContextMenu && (
                <ul
                    className="custom-context-menu"
                    style={{
                        top: contextMenuPos.y,
                        left: contextMenuPos.x,
                        position: 'absolute',
                        zIndex: 1000,
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        padding: '5px',
                        listStyle: 'none'
                    }}
                    onMouseLeave={() => setShowContextMenu(false)}
                >
                    <li style={{ cursor: 'pointer' }} onClick={handleExamine}>Examine</li>
                </ul>
            )}



            {/* Main Modal for data edition popup*/}
            {showModal && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                    <div className="mmodal-dialog modal-dialog-scrollable modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header" style={{ backgroundColor: '#7de2d1' }}>
                                <h5 className="modal-title">Submission ID: {submissionID}</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body" >


                                {/* Modal Textboxes for data edit with textbox size customized and make new line starting from textbox index 14*/}
                                {selectedRow && Object.keys(selectedRow).length > 0 && (
                                    <div className="row">
                                        {Object.entries(selectedRow).map(([key, value], idx) => {
                                            let colClass = 'col-lg-2'; // default column size

                                            if ((idx >= 0 && idx <= 7) || idx === 10 || idx === 12 || (idx >= 14 && idx <= 18)) {
                                                colClass = 'col-lg-1';
                                            } //else if ( idx === 13) {
                                            //colClass = 'col-lg-3';
                                            //}

                                            const needsNewLine = idx === 29;

                                            const isDateField = idx >= 3 && idx <= 5;
                                            //const isEditableText = (idx >= 11 && idx <= 7) || (idx >= 13 && idx <= 18);
                                            const isEditableText = (idx === 9);
                                            const isNumericField = (idx >= 19 && idx <= 24) || (idx === 14);

                                            return (
                                                <React.Fragment key={idx}>
                                                    {needsNewLine && <div className="w-100"></div>}

                                                    <div className={`${colClass} mb-3`}>
                                                        <label className="form-label text-start w-100 fw-bold fs-6" style={{ color: '#001d3d' }}> {key + ":"}</label>

                                                        {isDateField ? (
                                                            <input
                                                                type="date"
                                                                className="form-control form-control-sm"
                                                                value={isValidDate(value) ? value.slice(0, 10) : ''}
                                                                onChange={(e) =>
                                                                    setSelectedRow((prev) => ({
                                                                        ...prev,
                                                                        [key]: e.target.value,
                                                                    }))
                                                                }
                                                            />
                                                        ) : isNumericField ? (
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-sm"
                                                                value={value ?? ''}
                                                                onChange={(e) =>
                                                                    setSelectedRow((prev) => ({
                                                                        ...prev,
                                                                        [key]: e.target.value,
                                                                    }))
                                                                }
                                                            />
                                                        ) : isEditableText ? (
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm"
                                                                value={value ?? ''}
                                                                onChange={(e) =>
                                                                    setSelectedRow((prev) => ({
                                                                        ...prev,
                                                                        [key]: e.target.value,
                                                                    }))
                                                                }
                                                            />
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm"
                                                                value={value ?? ''}
                                                                readOnly
                                                            />
                                                        )}
                                                    </div>
                                                </React.Fragment>
                                            );
                                        })}
                                    </div>
                                )}


                                {/* Modal action buttons */}

                                <div className="modal-footer d-flex justify-content-start ">
                                    <button className="btn btn-warning" style={{ width: '160px' }} title="To edit the selected record of data">Edit Record</button>
                                    <button className="btn btn-danger" style={{ width: '160px' }} title="To delete only the selected record of data">Delete Participant</button>
                                    <button className="btn btn-danger" style={{ width: '160px' }} title="To delete all records of data for this submission">Delete Submission</button>
                                    <button className="btn btn-secondary" style={{ width: '160px' }} onClick={closeModal} >Close</button>
                                </div>

                                {/* Modal Table */}
                                <div className="table-responsive mb-3" style={{ maxHeight: '430px', overflowY: 'auto' }}>
                                    <table className="table table-bordered table-hover table-sm text-nowrap">
                                        <thead className="table-info">
                                            {modalData.length > 0 && (
                                                <tr>
                                                    {Object.keys(modalData[0]).map((col) => (
                                                        <th key={col}>{col}</th>
                                                    ))}
                                                </tr>
                                            )}
                                        </thead>
                                        <tbody>
                                            {modalData.map((row, idx) => (
                                                <tr
                                                    key={idx}
                                                    onClick={() => setSelectedRow(row)}
                                                    className={row === selectedRow ? 'table-warning' : ''}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {Object.entries(row).map(([col, value], colIdx) => (
                                                        <td key={col}>
                                                            {(colIdx >= 19 && colIdx <= 24 && value != null && value != '' && !isNaN(value))
                                                                ? Number(value).toLocaleString()
                                                                : value ?? ''}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* End of Modal */}


        </div>

        //End of return
    );

    //End of default function
}