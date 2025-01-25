import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [mockTests, setMockTests] = useState([]);
    const navigate = useNavigate();
    const user= useSelector((state)=>state)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get('/api/v1/user');
                const facultyResponse = await axios.get('/api/admin/faculties');
                const mockTestsResponse = await axios.get('/api/mock-tests');

                setUsers(userResponse.data);
                setFaculties(facultyResponse.data);
                setMockTests(mockTestsResponse.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, []);

    const styles = {
        container: {
            fontFamily: 'Arial, sans-serif',
            padding: '20px',
            backgroundColor: '#f5f5f5',
        },
        header: {
            textAlign: 'center',
            color: '#333',
            marginBottom: '20px',
        },
        adminCard: {
            // display: 'flex',
            // justifyContent: '',
            alignItems: 'center',
            background: '#fff',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
        },
        button: {
            padding: '10px 20px',
            fontSize: '14px',
            color: '#fff',
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        buttonHover: {
            backgroundColor: '#0056b3',
        },
        dashboardColumns: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
        },
        section: {
            background: '#fff',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
        },
        sectionHeader: {
            fontSize: '16px',
            color: '#333',
            marginBottom: '10px',
        },
        list: {
            listStyle: 'none',
            padding: 0,
            margin: 0,
        },
        listItem: {
            padding: '8px 0',
            borderBottom: '1px solid #ddd',
        },
        lastItem: {
            borderBottom: 'none',
        },
    };

    return (
       
        <div style={styles.container}>
            <h1 style={styles.header}>Admin Dashboard</h1>

            <div className='flex justify-around bg-blue-650' style={styles.adminCard}>
               <div> <h2>Admin Actions</h2></div>
               <div className=' flex gap-3'> <button
                    style={styles.button}
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
                    onClick={() => navigate('/work')}
                >
                    Add Mock Test
                </button>
                <button
                    style={styles.button}
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
                    onClick={() => navigate('/work')} //not set routing
                >
                    Add Aptitude Questrions
                </button>
                <button
                    style={styles.button}
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
                    onClick={() => navigate('/work')}  //not set routing
                >
                    Update  Mock Test   
                </button>
                </div>
            </div>

            {/* <div style={styles.adminCard}>
                <h2>Admin Actions</h2>
               
            </div> */}
            <div style={styles.dashboardColumns}>
                <section style={styles.section}>
                    <h2 style={styles.sectionHeader}>Users ({users.count || 0})</h2>
                    <ul style={styles.list}>
                        {users.users && users.users.map((user) => (
                            <li style={styles.listItem} key={user.id}>
                                {user.name} - {user.email}
                            </li>
                        ))}
                    </ul>
                </section>
                <section style={styles.section}>
                    <h2 style={styles.sectionHeader}>Faculties</h2>
                    <ul style={styles.list}>
                        {Array.isArray(faculties) &&
                            faculties.map((faculty, index) => (
                                <li
                                    style={{
                                        ...styles.listItem,
                                        ...(index === faculties.length - 1
                                            ? styles.lastItem
                                            : {}),
                                    }}
                                    key={faculty.id}
                                >
                                    {faculty.name} - {faculty.department}
                                </li>
                            ))}
                    </ul>
                </section>
                <section style={styles.section}>
                    <h2 style={styles.sectionHeader}>Mock Tests</h2>
                    <ul style={styles.list}>
                        {Array.isArray(mockTests) &&
                            mockTests.map((test, index) => (
                                <li
                                    style={{
                                        ...styles.listItem,
                                        ...(index === mockTests.length - 1
                                            ? styles.lastItem
                                            : {}),
                                    }}
                                    key={test.id}
                                >
                                    {test.title} - {test.date}
                                </li>
                            ))}
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;