import * as XLSX from "xlsx";
import { useState } from 'react';
import axios from "axios";

function BulkMail() {
    const [msg, setmsg] = useState("");
    const [status, setStatus] = useState(false);
    const [emailList, setEmailList] = useState([]);
    const [subject, setSubject] = useState("");


    function handlemsg(evt) {
        setmsg(evt.target.value)
    }

    function handleSubject(evt) {
        setSubject(evt.target.value)
    }

    function send() {
        if (subject === "" || msg === "") {
            alert("Please fill all fields");
            return;
        }

        if (emailList.length === 0) {
            alert("Please upload email file");
            return;
        }
        setStatus(true);
        axios.post("http://localhost:5000/sendmail", { subject: subject, msg: msg, emailList: emailList })
            .then(function (data) {
                if (data.data === true) {
                    alert("Email Sent Successfully");
                    setStatus(false);
                } else {
                    alert("Failed");
                }
            }).catch(function (error) {
                console.log(error);
                alert("Server Error");
                setStatus(false);
            })
    }

    function handleFile(event) {
        const file = event.target.files[0];
        console.log(file);
        const reader = new FileReader();

        reader.onload = function (event) {
            const data = event.target.result;
            const workBook = XLSX.read(data, { type: "binary" });
            const sheetName = workBook.SheetNames[0];
            const workSheet = workBook.Sheets[sheetName];
            console.log(workSheet);
            const emailData = XLSX.utils.sheet_to_json(workSheet, { header: 'A' });
            console.log(emailData);
            const totalemail = emailData.map(function (item) {
                return item.A;
            })
            setEmailList(totalemail);
        }
        reader.readAsBinaryString(file);
    }

    return (
        <div className='container'>
            <h1 className='title'>Bulk Mail Application</h1>
            <input
                type="text"
                placeholder="Enter Subject"
                className='input'
                value={subject}
                onChange={handleSubject}
            />
            <textarea
                placeholder='Enter Email Body'
                className='textarea'
                value={msg}
                onChange={handlemsg}
            />
            <input
                type='file'
                onChange={handleFile}
                className='file'
            />
            <p>Total Emails: {emailList.length}</p>
            <button onClick={send} className='btn'>
                {status ? "Sending..." : "Send Emails"}
            </button>
        </div>
    );
}
export default BulkMail