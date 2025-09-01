// cbforstaffmain.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

//Import all related components
import MainDashboard from './main_dashboard';
import CBForStaff from './cb_for_staff'; // Import the CBForStaff component
import CBForVillagers from './cb_for_villagers'; //Import the CBForVillagers component
import Form1A1 from './1A1'; //Import the form 1A1 component
import Form1A2 from './1A2' //Import the form 1A2 component
import Form1A3a from './1A3a' //Import the form 1A3a component
import Form1A3b from './1A3b'; //Import the form 1A3a component
import Form1A4 from './1A4'; //Import the form 1A4 component
import Form1A5a from './1A5a'; //Import the form 1A5a component
import Form1A5b from './1A5b';
import Form1BAct6 from './1BAct6';
import Form1BAct7 from './1BAct7';
import Form1BAct8 from './1BAct8';
import Form2Act1 from './2Act1';
import Form2Act2 from './2Act2';
import Form2Act3 from './2Act3';
import Form3Act1a from './3Act1a';
import Form3Act1b from './3Act1b';
import Form3Act2 from './3Act2';

export default function MainPortalForm() {
    const [activeTab, setActiveTab] = useState('tab3');
    //const [refreshTrigger, setRefreshTrigger] = useState(0);

    const switchTab = (tabId) => {
        setActiveTab(tabId);
    };

    const theme = {
        headerBg: '#006e90',
        headerColor: '#ffffff',
        subHeaderBg: '#94d1be',
        subHeaderColor: '#0e00ca',
        contentBg: '#F8F9FA',
    };

    const tabColors = {
        tab1: '#0D6EFD', tab2: '#6610F2', tab3: '#6f42c1', tab4: '#198754', tab5: '#fd7e14',
        tab6: '#20c997', tab7: '#0dcaf0', tab8: '#ffc107', tab9: '#dc3545', tab10: '#0d6efd',
        tab11: '#6f42c1', tab12: '#6610f2', tab13: '#198754', tab14: '#fd7e14', tab15: '#20c997',
        tab16: '#0dcaf0', tab17: '#ffc107', tab18: '#dc3545', tab19: '#0d6efd', tab20: '#6f42c1', tab21: '#6610f2',
    };

    const tabButtonStyle = (tabId) => ({
        backgroundColor: activeTab === tabId ? tabColors[tabId] : '#e0e0e0',
        color: activeTab === tabId ? '#ffffff' : '#333',
        fontWeight: activeTab === tabId ? '600' : '500',
        boxShadow: activeTab === tabId ? '0 4px 8px rgba(0,0,0,0.15)' : 'none',
        transition: 'all 0.3s ease',
        minWidth: '80px',
        padding: '4px 8px', // slightly smaller padding
        fontSize: '12px',
        textAlign: 'center',
        borderRadius: '6px', // less round
        marginRight: '2px', // reduce space between buttons
        marginBottom: '2px',
    });

    const tabs = [

        { id: 'tab1', label: 'Outreach Cal' },
        { id: 'tab2', label: 'Logframe Update' },
        { id: 'tab3', label: 'Main Dashboard' },
        { id: 'tab4', label: 'CB for Staff' },
        { id: 'tab5', label: 'CB for Villagers' },
        { id: 'tab6', label: '1A1' },
        { id: 'tab7', label: '1A2' },
        { id: 'tab8', label: '1A3a' },
        { id: 'tab9', label: '1A3b' },
        { id: 'tab10', label: '1A4' },
        { id: 'tab11', label: '1A5a' },
        { id: 'tab12', label: '1A5b' },
        { id: 'tab13', label: '1BAct6' },
        { id: 'tab14', label: '1BAct7' },
        { id: 'tab15', label: '1BAct8' },
        { id: 'tab16', label: '2Act1' },
        { id: 'tab17', label: '2Act2' },
        { id: 'tab18', label: '2Act3' },
        { id: 'tab19', label: '3Act1a' },
        { id: 'tab20', label: '3Act1b' },
        { id: 'tab21', label: '3Act2' },
    ];



    return (
        <div style={{ fontFamily: "'Phetsarath OT', sans-serif", backgroundColor: theme.contentBg, color: '#333', minHeight: '100vh' }}>

            <div className="p-1 position-relative" style={{
                backgroundColor: theme.headerBg,
                color: theme.headerColor,
                minHeight: '140px'
            }}>
                <img src="/AFN2.png" alt="AFN-II Logo" width="220" height="138" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }}></img>
                <br />
                <div style={{ textAlign: 'center', margin: '0 auto', maxWidth: '1000px', fontSize: "30px" }}>ຖານຂໍ້ມູນການຕິດຕາມ ແລະ ປະເມີນຜົນ ໂຄງການກະສິກຳເພື່ອໂພຊະນາການໄລຍະ 2</div>
                <div style={{ textAlign: 'center', margin: '0 auto', maxWidth: '1000px', fontFamily: "'Times New Roman', sans-serif", fontSize: "25px" }}>M & E Database</div>
            </div>

            <div className="text-center py-2 font-weight-bold" style={{ backgroundColor: theme.subHeaderBg, color: theme.subHeaderColor, fontSize: "20px", fontFamily: "'Times New Roman', sans-serif" }}>
                Agriculture for Nutrition Project Phase II
            </div>




            {/* Tab Contents */}


            <div className="d-flex flex-wrap p-2 shadow-sm" style={{ borderBottom: '1px solid #ccc', overflowX: 'auto' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`btn border`}
                        style={tabButtonStyle(tab.id)}
                        onClick={() => switchTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="p-3 rounded shadow m-3" style={{ backgroundColor: '#ffffff', overflowX: 'auto' }}>

                {/* Tab 4 content - stays mounted */}
                <div style={{ display: activeTab === 'tab3' ? 'block' : 'none' }}>
                    <MainDashboard />
                </div>

                <div style={{ display: activeTab === 'tab4' ? 'block' : 'none' }}>
                    <CBForStaff />
                </div>

                <div style={{ display: activeTab === 'tab5' ? 'block' : 'none' }}>
                    <CBForVillagers />
                </div>

                <div style={{ display: activeTab === 'tab6' ? 'block' : 'none' }}>
                    <Form1A1 />
                </div>

                <div style={{ display: activeTab === 'tab7' ? 'block' : 'none' }}>
                    <Form1A2 />
                </div>

                <div style={{ display: activeTab === 'tab8' ? 'block' : 'none' }}>
                    <Form1A3a />
                </div>

                <div style={{ display: activeTab === 'tab9' ? 'block' : 'none' }}>
                    <Form1A3b />
                </div>

                <div style={{ display: activeTab === 'tab10' ? 'block' : 'none' }}>
                    <Form1A4 />
                </div>

                <div style={{ display: activeTab === 'tab11' ? 'block' : 'none' }}>
                    <Form1A5a />
                </div>

                <div style={{ display: activeTab === 'tab12' ? 'block' : 'none' }}>
                    <Form1A5b />
                </div>

                <div style={{ display: activeTab === 'tab13' ? 'block' : 'none' }}>
                    <Form1BAct6 />
                </div>

                <div style={{ display: activeTab === 'tab14' ? 'block' : 'none' }}>
                    <Form1BAct7 />
                </div>

                <div style={{ display: activeTab === 'tab15' ? 'block' : 'none' }}>
                    <Form1BAct8 />
                </div>

                <div style={{ display: activeTab === 'tab16' ? 'block' : 'none' }}>
                    <Form2Act1 />
                </div>

                <div style={{ display: activeTab === 'tab17' ? 'block' : 'none' }}>
                    <Form2Act2 />
                </div>

                <div style={{ display: activeTab === 'tab18' ? 'block' : 'none' }}>
                    <Form2Act3 />
                </div>

                <div style={{ display: activeTab === 'tab19' ? 'block' : 'none' }}>
                    <Form3Act1a />
                </div>

                <div style={{ display: activeTab === 'tab20' ? 'block' : 'none' }}>
                    <Form3Act1b />
                </div>

                <div style={{ display: activeTab === 'tab21' ? 'block' : 'none' }}>
                    <Form3Act2 />
                </div>








                {/* Other tabs - also mounted but hidden */}
                {tabs
                    .filter(tab => tab.id !== 'tab3' && tab.id !== 'tab4' && tab.id !== 'tab5'
                        && tab.id !== 'tab6' && tab.id !== 'tab7' && tab.id !== 'tab8' && tab.id !== 'tab9'
                        && tab.id !== 'tab10' && tab.id !== 'tab11' && tab.id !== 'tab12' && tab.id !== 'tab13'
                        && tab.id !== 'tab14' && tab.id !== 'tab15' && tab.id !== 'tab16' && tab.id !== 'tab17'
                        && tab.id !== 'tab18' && tab.id !== 'tab19' && tab.id !== 'tab20' && tab.id !== 'tab21')
                    .map(tab => (
                        <div key={tab.id} style={{ display: activeTab === tab.id ? 'block' : 'none' }}>
                            {tab.label} Content
                        </div>
                    ))}
            </div>
        </div>
    );
}
