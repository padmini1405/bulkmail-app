import * as XLSX from "xlsx";
import { useState } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";

function BulkMail() {
    const [msg, setmsg] = useState("");
    const [status, setStatus] = useState(false);
    const [emailList, setEmailList] = useState([]);
    const [subject, setSubject] = useState("");
    const [subjectError, setSubjectError] = useState("");
    const [messageError, setMessageError] = useState("");
    const [fileError, setFileError] = useState("");


    function handlemsg(evt) {
        setmsg(evt.target.value)
    }

    function handleSubject(evt) {
        setSubject(evt.target.value)
    }

    function send() {
        setSubjectError("");
        setMessageError("");
        setFileError("");

        let hasError = false;

        // Subject validation
        if (subject.trim() === "") {
            setSubjectError("Subject is required");
            hasError = true;
        }

        // Message validation
        if (msg.trim() === "") {
            setMessageError("Message body is required");
            hasError = true;
        }

        // File validation
        if (emailList.length === 0) {
            setFileError("Please upload email file");
            hasError = true;
        }

        if (hasError) return;

        setStatus(true);
        axios.post("http://localhost:5000/sendmail", { subject: subject, msg: msg, emailList: emailList })
            .then(function (data) {
                if (data.data === true) {
                    alert("Email Sent Successfully");
                    setStatus(false);
                } else {
                    alert("Failed");
                    setStatus(false);
                }
            }).catch(function (error) {
                console.log(error);
                alert("Server Error");
                setStatus(false);
            })
    }

    function handleFile(event) {
        setFileError("");

        const file = event.target.files[0];
        if (!file) {
            setFileError("Please choose a file");
            return;
        }
        // File size validation (5MB)
        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            setFileError("File size should be less than 5MB");
            return;
        }

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
        <div className="campaign-page">
            <div className="topbar">
                <div className="logo-section">
                    <h2 className="bulkmail-logo">SpreadLink</h2>
                    <p className="logo-subtitle">Enterprise Email</p>
                </div>
                <div className="top-actions">
                    <button className="history-btn">
                       <Link to={"/history"}>History</Link>
                    </button>
                </div>
            </div>
            <div className="campaign-container">
                <div className="campaign-card">
                    <h1 className="page-title">
                        Messaging Hub
                    </h1>
                    <div className="field-group">
                        <label>Subject Line</label>
                        <input
                            type="text"
                            placeholder="Enter your email subject..."
                            className="subject-input"
                            value={subject}
                            onChange={handleSubject}
                        />
                        {subjectError && (
                            <p className="error-text">{subjectError}</p>
                        )}
                    </div>
                    <div className="field-group">
                        <label>Message Body</label>
                        <textarea
                            placeholder="Start writing your campaign message here..."
                            className="message-box"
                            value={msg}
                            onChange={handlemsg}
                        />
                        {messageError && (
                            <p className="error-text">{messageError}</p>
                        )}
                    </div>
                    <div className=" field-group upload-mail">
                        <label>Recipients</label>
                        <label className="upload-mail-text">Upload your mailing list in Excel format.</label>
                        <input
                            type='file'
                            onChange={handleFile}
                            className='file'
                        />
                        <p>Total Emails: {emailList.length}</p>
                        {fileError && (
                            <p className="error-text">{fileError}</p>
                        )}
                    </div>
                    <div className="desktop-send-wrapper">
                        <button
                            onClick={send}
                            className="send-btn"
                        >
                            {status ? "Sending..." : "Send Mail"}
                        </button>
                    </div>
                </div>
                <div className="upload-card">
                    <h3 className="upload-title">
                        Recipients
                    </h3>
                    <p className="upload-text">
                        Upload your mailing list in Excel format.
                    </p>
                    <div className="upload-box">
                        <p className="upload-heading">
                            Upload .xlsx File
                        </p>
                        <p className="upload-limit">
                            Max size: 25MB
                        </p>
                        <input
                            type="file"
                            onChange={handleFile}
                            className="file-input"
                        />
                        <p className="email-count">
                            Total Emails: {emailList.length}
                        </p>
                        {fileError && (
                            <p className="error-text">{fileError}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default BulkMail