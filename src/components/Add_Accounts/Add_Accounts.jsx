import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Add_Accounts.css'; // Import your custom styles if needed
import decrypt from '../../utils/decryptor';
import Header from '../Header/Header';

const AddAccount = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [user_id, setUserID] = useState('');
    const [auth_key, setAuthKey] = useState('');
    const [accounts, setAccounts] = useState([]); // State to store bank accounts
    const [showForm, setShowForm] = useState(false); // State to toggle form visibility
    const [newAccount, setNewAccount] = useState({
        bank_name: '',
        account_id: '',
        balance: '0.00', // Default value for balance
        ifsc: '' // New IFSC field
    }); // State to manage new account form inputs
    const [dataFetched, setDataFetched] = useState(false); // Flag to check if data is fetched

    // Fetch accounts function
    const fetchAccounts = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/bank/get_ac`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user_id,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch accounts');
            }
            const data = await response.json();
            const masterKey = process.env.REACT_APP_MASTER_KEY
            // Decrypt balances
            const decryptedAccounts = data.map(account => {
                // Ensure `account.iv` and `account.encryptedBalance` are correctly named based on your data
                const decryptedBalance = decrypt(account.balance, masterKey, auth_key);
                return {
                    ...account,
                    balance: decryptedBalance // Replace the encrypted balance with decrypted balance
                };
            });

            setAccounts(decryptedAccounts);
            setDataFetched(true); // Set flag to indicate data has been fetched
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    }, [apiUrl, auth_key, user_id]);

    useEffect(() => {
        const fetchData = async () => {
            // Retrieve state and expiration time from localStorage
            const storedState = localStorage.getItem('authState');
            if (storedState) {
                const { user_id, username, flag, auth_key, expirationTime } = JSON.parse(storedState);
                const currentTime = new Date().getTime();

                // Check if the state has expired
                if (currentTime > expirationTime || !flag) {
                    // State has expired or flag is false; redirect to login
                    localStorage.removeItem('authState'); // Clean up expired state
                    navigate('/');
                } else {
                    // Handle valid state here
                    setUsername(username);
                    setUserID(user_id)
                    setAuthKey(auth_key);
                    if (!dataFetched) {
                        // Fetch accounts if not already fetched
                        await fetchAccounts();
                    }
                }
            } else {
                // No state found; redirect to login
                navigate('/');
            }
        };

        fetchData();
    }, [fetchAccounts, navigate, dataFetched]); // Added dataFetched to dependencies

    const handleBackClick = () => {
        navigate('/banks'); // Navigate back to the dashboard
    };

    const handleShowForm = () => {
        setShowForm(true); // Show the form to add new bank account
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAccount(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddAccount = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/bank/add_ac`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                
                body: JSON.stringify({account: newAccount, user_id:user_id, auth_key})
            });
            if (!response.ok) {
                throw new Error('Failed to add account');
            }
            // Reset form
            setNewAccount({ bank_name: '', account_id: '', balance: '0.00', ifsc: '' });
            setShowForm(false); // Hide the form
            // Refetch accounts
            setDataFetched(false); // Reset flag to refetch accounts
            await fetchAccounts();
        } catch (error) {
            console.error('Error adding account:', error);
        }
    };

    return (
        <div className="add_ac">
            <Header username={username}/>
            <main className="add_ac-main">
                {showForm ? (
                    <section>
                        <div className="box box-form">
                            <h3>Add New Bank Account</h3>
                            <form onSubmit={handleAddAccount}>
                                <label>
                                    Bank Name:
                                    <input
                                        type="text"
                                        name="bank_name"
                                        value={newAccount.bankName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Account Number:
                                    <input
                                        type="text"
                                        name="account_id"
                                        value={newAccount.accountNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </label>
                                <label>
                                    IFSC Code:
                                    <input
                                        type="text"
                                        name="ifsc"
                                        value={newAccount.ifsc}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Balance:
                                    <input
                                        type="number"
                                        name="balance"
                                        value={newAccount.balance}
                                        onChange={handleInputChange}
                                        step="0.01" // Allow decimal values
                                    />
                                </label>
                                
                                <button type="submit" className="add-account-button">Add Account</button>
                                <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>Cancel</button>
                            </form>
                        </div>
                    </section>
                ) : (
                    <section>
                        <div className="box">
                            <h3>Your Accounts</h3>
                            {accounts.length > 0 ? (
                                <ul>
                                    {accounts.map((account, index) => (
                                        <li key={index}>
                                            <p><strong>Bank Name:</strong> {account.bank_name}</p>
                                            <p><strong>Account Number:</strong> {account.account_id}</p>
                                            <p><strong>Balance:</strong> ₹ {account.balance}</p>
                                            <p><strong>IFSC Code:</strong> {account.ifsc}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No bank accounts found.</p>
                            )}
                            <button onClick={handleShowForm} className="add-account-button">Add New Bank Account</button>
                        </div>
                    </section>
                )}
            </main>
            <button className="back-button" onClick={handleBackClick}>Back to Banks</button>
        </div>
    );
};

export default AddAccount;
