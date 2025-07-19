import React from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import './invoiceDetails.css';

const InvoiceDetails = () => {

    const { id } = useParams();

    const Allinvoice = [
        {
            id: "QTN-001",
            clientName: "John Doe",
            date: "2025-05-15",
            amount: "$1,250",
            status: "Pending"
        },
        {
            id: "QTN-002",
            clientName: "Jane Smith",
            date: "2025-05-12",
            amount: "$2,800",
            status: "Approved"
        },
        {
            id: "QTN-003",
            clientName: "Acme Corp.",
            date: "2025-05-10",
            amount: "$5,600",
            status: "Rejected"
        },
        {
            id: "QTN-004",
            clientName: "Olivia Brown",
            date: "2025-05-17",
            amount: "$750",
            status: "Approved"
        },
        {
            id: "QTN-005",
            clientName: "Michael Green",
            date: "2025-05-14",
            amount: "$3,200",
            status: "Pending"
        },
        {
            id: "QTN-006",
            clientName: "QuickFix Ltd.",
            date: "2025-05-11",
            amount: "$4,100",
            status: "Approved"
        },
        {
            id: "QTN-007",
            clientName: "Lisa Turner",
            date: "2025-05-13",
            amount: "$980",
            status: "Rejected"
        },
        {
            id: "QTN-008",
            clientName: "Urban Homes",
            date: "2025-05-16",
            amount: "$2,150",
            status: "Pending"
        },
        {
            id: "QTN-009",
            clientName: "David Wilson",
            date: "2025-05-18",
            amount: "$3,700",
            status: "Approved"
        },
        {
            id: "QTN-010",
            clientName: "PrimeTech LLC",
            date: "2025-05-19",
            amount: "$6,250",
            status: "Pending"
        }
    ];

    const invoice = Allinvoice.find((q) => q.id === id);

    const navigate = useNavigate();

    const handleGoClick = () => {
        navigate('/invoice');
    };

    if (!invoice) {
        return <div>Quotation not found.</div>;
    }
    return (
        <div>
            <div>
                <button onClick={handleGoClick} className='submit'>Go To All Invoice</button>
            </div>
            <div className="quotation-details animate-fade-in">
                <h2>Invoice Details: {invoice.id}</h2>
                <p><strong>Client Name:</strong> {invoice.clientName}</p>
                <p><strong>Date:</strong> {invoice.date}</p>
                <p><strong>Status:</strong> {invoice.status}</p>
                <p><strong>Total Amount:</strong> {invoice.amount}</p>
            </div>
        </div>
    )
}

export default InvoiceDetails
