import { useEffect, useState } from "react";
import axios from "axios";

function History() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/history")
            .then((res) => {
                setHistory(res.data);
            })
            .catch(err => console.error("Error fetching history:", err));
    }, []);

    return (
        <div className="campaign-page">
            <div className="campaign-card history-wrapper">
                <h1 className="page-title">Mail History</h1>

                <div className="history-table-wrapper">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th className="history-th">DATE</th>
                                <th className="history-th">MAIL SUBJECT</th>
                                <th className="history-th">RECIPIENTS</th>
                                <th className="history-th">STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? (
                                history.map((item, index) => (
                                    <tr key={index} className="history-tr">
                                        <td className="history-td">
                                            {new Date(item.createdAt).toLocaleDateString()} <br />
                                            <span className="history-time">
                                                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </td>
                                        <td className="history-td">
                                            <strong className="history-subject">{item.subject}</strong>
                                        </td>
                                        <td className="history-td">{item.recipients?.length || 0}</td>
                                        <td className="history-td">
                                            <span
                                                className={`status-badge ${(item.status || "Sent") === "Sent"
                                                        ? "status-sent"
                                                        : "status-failed"
                                                    }`}
                                            >
                                                ● {item.status || 'Sent'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="no-history">
                                        No history found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default History;