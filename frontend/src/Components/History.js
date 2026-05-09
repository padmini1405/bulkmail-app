import { useEffect, useState } from "react";
import axios from "axios";

function History() {
    const [history, setHistory] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:5000/history")
            .then((res) => {
                setHistory(res.data);
            });
    }, []);
    return (
        <div>
            <h1>Email History</h1>
            {
                history.map((item, index) => (
                    <div key={index}>
                        <h3>{item.subject}</h3>
                        <p>{item.body}</p>
                        <p>Total Recipients: {item.recipients.length}</p>
                        <hr />
                    </div>
                ))
            }
        </div>
    )
}

export default History;