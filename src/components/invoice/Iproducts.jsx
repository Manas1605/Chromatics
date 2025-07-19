import React, { useState } from 'react';
import './iproducts.css';


const initialData = [
    { category: 'Lighting', items: [{ name: 'Motion Sensor', quantity: 0, unitPrice: 1500 }] },
    {
        category: 'Blinds',
        items: [
            { name: 'Blind Track', quantity: 0, unitPrice: 300 },
            { name: 'Blind Motor', quantity: 0, unitPrice: 10000 },
        ]
    },
    {
        category: 'Curtains',
        items: [
            { name: 'Curtain Track', quantity: 0, unitPrice: 800 },
            { name: 'Curtain Motor', quantity: 0, unitPrice: 10000 },
        ]
    },
    { category: 'VDP Door System', items: [{ name: 'VDP Door System', quantity: 0, unitPrice: 20000 }] },
    { category: 'Gate Automation System', items: [{ name: 'Gate Automation Motor one side opening', quantity: 0, unitPrice: 77800 }] },
    {
        category: 'Drivers',
        items: [
            { name: 'Tunable + Dimmable LED Driver', quantity: 0, unitPrice: 2240 },
            { name: 'RGB LED Strip Controller', quantity: 0, unitPrice: 4116 },
        ]
    },
    {
        category: 'Networking & CCTV',
        items: [
            { name: '16 Port POE Hikvision', quantity: 0, unitPrice: 9000 },
            { name: '4MP Bullet Cam Hikvision Colour', quantity: 0, unitPrice: 6700 },
            { name: '6MP Panoramic COLORVU Bullet Cam', quantity: 0, unitPrice: 15000 },
            { name: 'Access Point (TP-Link)', quantity: 0, unitPrice: 7500 },
            { name: 'RJ-45 Connectors', quantity: 0, unitPrice: 10 },
            { name: 'PVC Boxes', quantity: 0, unitPrice: 50 },
            { name: 'Hard Disk 2TB', quantity: 0, unitPrice: 5500 },
            { name: 'NVR Hikvision 16 Channel', quantity: 0, unitPrice: 15000 },
        ]
    },
    {
        category: 'Cables',
        items: [
            { name: 'Speaker Cable (90M)', quantity: 0, unitPrice: 17000 },
            { name: 'HDMI Cable (10M)', quantity: 0, unitPrice: 6000 },
            { name: 'Subwoofer Cable (5M)', quantity: 0, unitPrice: 2500 },
        ]
    },
    {
        category: 'Additional Items',
        items: [
            { name: 'Alexa', quantity: 0, unitPrice: 6000 },
            { name: 'Star Point ratio : 75mm 50:1mm 30:1.5mm', quantity: 0, unitPrice: 100 },
            { name: 'Light Engine RGB colour Twinkle effect', quantity: 0, unitPrice: 10000 },
        ]
    },
];

const Iproducts = ({ onSubmit, totalProjectCost  }) => {
    const [data, setData] = useState(initialData);
    const [installationPercent, setInstallationPercent] = useState(0);
    const [additionalInstallationPercent, setAdditionalInstallationPercent] = useState(0);

    const handleChange = (catIndex, itemIndex, field, value) => {
        const updatedData = [...data];
        updatedData[catIndex].items[itemIndex][field] = parseFloat(value) || 0;
        setData(updatedData);
    };

    const calculateItemTotal = (item) => item.quantity * item.unitPrice;

    const calculateCategorySubtotal = (category) =>
        category.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

    const additionalItemsCategory = data.find(cat => cat.category === 'Additional Items');
    const additionalItemsSubtotal = additionalItemsCategory
        ? calculateCategorySubtotal(additionalItemsCategory)
        : 0;

    const totalWithoutInstallation = data.reduce((sum, cat) => {
        if (cat.category !== 'Additional Items') {
            return sum + calculateCategorySubtotal(cat);
        }
        return sum;
    }, 0);

    const totalProductsCost = totalWithoutInstallation + additionalItemsSubtotal;
    const allTotalWithoutCharges = totalProductsCost + totalProjectCost;
    const additionalInstallationCharge = (additionalItemsSubtotal * additionalInstallationPercent) / 100;
    const installationCharge = (allTotalWithoutCharges * installationPercent) / 100;
    const grandTotal = allTotalWithoutCharges + installationCharge + additionalInstallationCharge ;

    const handleSubmit = () => {
        const categoryTotals = {};
        let totalWithoutInstallation = 0;
        let additionalItemsSubtotal = 0;

        const selectedItems = {};

        data.forEach(category => {
            const subtotal = calculateCategorySubtotal(category);
            const catKeyBase = category.category.toLowerCase().replace(/\s+/g, '');
            categoryTotals[`total${category.category.replace(/\s+/g, '')}Cost`] = subtotal;

            category.items.forEach(item => {
                if (item.quantity > 0) {
                    const itemKey = item.name
                        .replace(/[^a-zA-Z0-9]/g, ' ') // remove special characters
                        .split(' ')
                        .filter(Boolean)
                        .map((word, i) =>
                            i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        )
                        .join('');

                    const prefix = `${catKeyBase}${itemKey}`;

                    selectedItems[`${prefix}Quantity`] = item.quantity;
                    selectedItems[`${prefix}UnitPrice`] = item.unitPrice;
                    selectedItems[`total${prefix.charAt(0).toUpperCase() + prefix.slice(1)}`] = calculateItemTotal(item);
                }
            });

            if (category.category === 'Additional Items') {
                additionalItemsSubtotal = subtotal;
            } else {
                totalWithoutInstallation += subtotal;
            }
        });

        const submissionData = {
            ...selectedItems,
            ...categoryTotals,
            additionalInstallationCharges: additionalInstallationCharge,
            totalProductsCost: totalProductsCost,
            totalBeforeInstallation: allTotalWithoutCharges,
            generalInstallationCharges: installationCharge,
            grandTotal: grandTotal,
        };

        onSubmit(submissionData);

        const resetData = data.map(category => ({
            ...category,
            items: category.items.map(item => ({
                ...item,
                quantity: 0
            }))
        }));
        setData(resetData);
       

    };

    return (
        <div className="quotation-container">
            
            {data.map((category, catIndex) => {
                const subtotal = calculateCategorySubtotal(category);
                const isAdditional = category.category === 'Additional Items';

                return (
                    <div key={category.category} className="category-block">
                        <h3>{category.category}</h3>
                        <table className="quotation-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Unit Price (₹)</th>
                                    <th>Total (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {category.items.map((item, itemIndex) => (
                                    <tr key={item.name}>
                                        <td>{item.name}</td>
                                        <td>
                                            <input
                                                type="number"
                                                min={0}
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleChange(catIndex, itemIndex, 'quantity', e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>₹ {item.unitPrice.toFixed(2)}</td>
                                        <td>₹ {calculateItemTotal(item).toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr className="category-total">
                                    <td colSpan="3"><strong>Total {category.category} Cost</strong></td>
                                    <td><strong>₹ {subtotal.toFixed(2)}</strong></td>
                                </tr>

                                {isAdditional && (
                                    <tr>
                                        <td colSpan="4">
                                            <div className="additionalItem-installation">
                                                <label>
                                                    Additional Items Installation Charges (%):{" "}
                                                    <select
                                                        value={additionalInstallationPercent}
                                                        onChange={(e) =>
                                                            setAdditionalInstallationPercent(Number(e.target.value))
                                                        }
                                                    >
                                                        <option value={0}>0%</option>
                                                        <option value={2}>2%</option>
                                                        <option value={4}>4%</option>
                                                        <option value={6}>6%</option>
                                                        <option value={8}>8%</option>
                                                        <option value={10}>10%</option>
                                                    </select>
                                                </label>
                                                <p><strong>Additional Installation Charges: ₹ {additionalInstallationCharge.toFixed(2)}</strong></p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>
                );
            })}

            <div className="summary-section">
            <h3>Total Products Cost: ₹ {totalProductsCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                <h3>Total (Before Installation Charges): ₹ {allTotalWithoutCharges.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>

                <div className="installation-dropdown">
                    <label>
                        General Installation Charges (%):{" "}
                        <select
                            value={installationPercent}
                            onChange={(e) => setInstallationPercent(Number(e.target.value))}
                        >
                            <option value={0}>0%</option>
                            <option value={2}>2%</option>
                            <option value={4}>4%</option>
                            <option value={6}>6%</option>
                            <option value={8}>8%</option>
                            <option value={10}>10%</option>
                        </select>
                    </label>
                </div>

                <h3>General Installation Charges: ₹ {installationCharge.toFixed(2)}</h3>
                
                <h2>
                    Grand Total: ₹ {(grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                <button
                    onClick={handleSubmit}
                    className='submit'
                    type='submit'
                    disabled={grandTotal === 0.00}

                >
                    Submit Quotation
                </button>

            </div>
        </div>
    );
};

export default Iproducts;
