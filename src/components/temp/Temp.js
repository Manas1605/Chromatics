import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
const CreateQuotationForm = () => {

    const defaultRoom = {
        MAPRoom: '',
        MAPLights: 0,
        MAPSwitchBoard: 0,
        MAPModule: 0,
        MAPType: 'Glass',
        powerSupply: 0,
        ON_OFF: 0,
        sixteen_A: 0,
        zemoteDimming: 0,
        triacDimming: 0,
        fanDimming: 0,
        curtain: 0,
        twoWaySwitchInput: 0,
        lightFanModule: 0,
        lightModule_2_ZemoteDimming: 0,
        lightModule_2_TriacDimming: 0,
        lightModule_2_NonDimming: 0,
        lightModule_4_NonDimming: 0,
        smartUniversalRemote: 0,
        smartUniversalRemoteMini: 0,
        smartUniversalRemoteWired: 0,
        smartUniversalRemotePlus: 0,
        smartUniversalRemotePro: 0,
        powerModule: 0,
        curtainController2: 0,
        curtainController4: 0,
        tunable_DimmableLEDDriver: 0,
        RGB_LEDstripController: 0,
        tewlve_V_LEDStripDimmer: 0,
        dryContact_NONCModule: 0,
        customizedText: 'no',
        customizedIcon_2_perPlate: 'no',
        customizedIcon_11_perPlate: 'no',
        border_ColorCustomizationPerPlate: 'no',
        CustomizedVeneer: 'no'
    };

    const fieldLabels = [
        'Rooms', 'Lights', 'Switch Boards', 'Module', 'Type', 'Color/Pattern',
        'Power Supply', 'ON/OFF', '16A', 'ZIMOTE DIMMING', 'TRIAC DIMMING',
        'FAN DIMMING', 'CURTAIN', '2 WAY SWITCH INPUT', 'Light Fan Module (with Light Dimming)',
        'Light Module (2 Channel with Zemote Dimming)', 'Light Module (2 Channel with Triac Dimming)',
        'Light Module (2 Channel Non Dimming)', 'Light Module (4 Channel Non Dimming)',
        'Smart Universal Remote', 'Smart Universal Remote Mini', 'Smart Universal Remote Wired',
        'Smart Universal Remote Plus', 'Smart Universal Remote Pro', 'Power Module',
        'Curtain controller 2 channel', 'Curtain controller4 channel', 'Tunable + Dimmable LED Driver',
        'RGB LED Strip Controller', '12V LED Strip Dimmer', 'Dry Contact / NONC Module',
        'Customized Text', 'Customized Icon ( Upto 2 per plate )', 'Customized Icon ( Upto 11 per plate )',
        'Border / Colour Customization per plate', 'Customized Veneer/stone/marble',
        'Back Module', 'Front plate Selected', 'Total'
    ];

    const fieldNames = [
        'rooms', 'lights', 'switchBoards', 'module', 'type', 'colorPattern',
        'powerSupply', 'onOff', 'sixteenA', 'zemoteDimming', 'triacDimming',
        'fanDimming', 'curtain', 'twoWaySwitch', 'lightFanModule',
        'zemoteModule', 'triacModule', 'nonDim2', 'nonDim4',
        'remote', 'remoteMini', 'remoteWired',
        'remotePlus', 'remotePro', 'powerModule',
        'curtain2', 'curtain4', 'tunableDriver',
        'rgbController', 'ledStrip', 'dryContact',
        'customText', 'customIcon2', 'customIcon11',
        'borderColor', 'customMaterial',
        'backModule', 'frontPlate'
    ];

    const defaultPrices = {

        lights: 1000, powerSupply: 2207, onOff: 1103,
        sixteenA: 2207, zemoteDimming: 1428, triacDimming: 1817, fanDimming: 2142,
        curtain: 1817, twoWaySwitch: 649, lightFanModule: 11151, zemoteModule: 8113,
        triacModule: 8113, nonDim2: 4956, nonDim4: 7434, remote: 8054, remoteMini: 3098,
        remoteWired: 6195, remotePlus: 7434, remotePro: 12390, powerModule: 6600, curtain2: 8437,
        curtain4: 12980, tunableDriver: 2240, rgbController: 4116, ledStrip: 3528,
        dryContact: 7080,

        // ... define prices for each product
    };

    const textFields = new Set(['rooms', 'colorPattern', 'switchBoards', 'module', 'type']); // add as needed



    const calculateColumnTotals = () => {
        const totals = {};
        fieldNames.forEach((field) => {
            totals[field] = items.reduce((sum, item) => {
                const qty = parseFloat(item[field]) || 0;
                const price = defaultPrices[field] || 0;
                return sum + qty * price;
            }, 0);
        });
        return totals;
    };

    const calculateRowTotal = (item) => {
        return Object.keys(defaultPrices).reduce((sum, key) => {
            return sum + (parseFloat(item[key]) || 0) * (defaultPrices[key] || 0);
        }, 0);
    };

    const calculateGrandTotal = () => {
        return items.reduce((sum, item) => sum + calculateRowTotal(item), 0);
    };

    const addItem = () => {
        setItems([...items, Object.fromEntries(fieldNames.map(name => [name, '']))]);
    };





    const quotationRef = useRef();
    const [formData, setFormData] = useState({
        propertyType: '',
        client: '',
        mobile: '',
        address: '',
        quotationDate: '',
        lightingMotionSensor: 0,
        lightingMotionSensorUnit: 0,
        lightingMotionSensorCost: 0,

        blindTrack: 0,
        blindTrackUnit: 0,
        blindTrackCost: 0,

        blindMotorUnit: 0,
        blindMotorCost: 0,
        blindMotor: 0,

        curtainTrackUnit: 0,
        curtainTrackCost: 0,
        curtainTrack: 0,

        curtainMotorUnit: 0,
        curtainMotorCost: 0,
        curtainMotor: 0,

        vdpDoorSystemUnit: 0,
        vdpDoorSystemCost: 0,
        vdpDoorSystem: 0,

        gateAutomation: 0,
        gateAutomationUnit: 0,
        gateAutomationCost: 0,

        sixteenPortPoeHikvisionUnit: 0,
        sixteenPortPoeHikvisionCost: 0,
        sixteenPortPoeHikvision: 0,


        fourMPCamaraBulletHikvisionColourUnit: 0,
        fourMPCamaraBulletHikvisionColourCost: 0,
        fourMPCamaraBulletHikvisionColour: 0,

        sixMPPanaromicCOLORVUFixedBulletnetworkcamaraUnit: 0,
        sixMPPanaromicCOLORVUFixedBulletnetworkcamaraCost: 0,
        sixMPPanaromicCOLORVUFixedBulletnetworkcamara: 0,

        accessPointTPlinkUnit: 0,
        accessPointTPlinkCost: 0,
        accessPointTPlink: 0,

        RJ_45: 0,
        RJ_45Cost: 0,
        RJ_45Unit: 0,

        PVCBoxes: 0,
        PVCBoxesUnit: 0,
        PVCBoxesCost: 0,

        hardDisk_2_TB: 0,
        hardDisk_2_TBUnit: 0,
        hardDisk_2_TBCost: 0,

        NVRHikvision_16_channel: 0,
        NVRHikvision_16_channelCost: 0,
        NVRHikvision_16_channelUnit: 0,

        speakerCable_90_MUnit: 0,
        speakerCable_90_MCost: 0,
        speakerCable_90_M: 0,

        HDMICable_10_MUnit: 0,
        HDMICable_10_MCost: 0,
        HDMICable_10_M: 0,

        subwooferCable_5_MUnit: 0,
        subwooferCable_5_MCost: 0,
        subwooferCable_5_M: 0,

        alexaUnit: 0,
        alexaCost: 0,
        alexa: 0,

        starPointUnit: 0,
        starPointCost: 0,
        starPoint: 0,
        lightEngineRGBUnit: 0,
        lightEngineRGBCost: 0,
        lightEngineRGB: 0,

        installation: 0,
        totalProductCost: 0,
        totalInstallationCost: 0,
        grandTotal: 0,
        totalNetworkingAndCCTV: 0,
        totalCablesCost: 0,
        MAPRooms: [defaultRoom]
    });

    const [items, setItems] = useState([
        { rooms: "", lights: 0, module: 0 } // quantities only
    ]);

    const handleRoomChange = (index, field, value) => {
        const updatedRooms = [...formData.MAPRooms];
        updatedRooms[index][field] = value;
        setFormData({ ...formData, MAPRooms: updatedRooms });
    };

    const addRoom = () => {
        setFormData({ ...formData, MAPRooms: [...formData.MAPRooms, { ...defaultRoom }] });
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(formData)
            //   const res = await axios.post('/api/quotation', formData);
            //   alert(res.data.message);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Submission failed');
        }
    };

    const calculateRoomCost = (room) => {
        const backModel =
            (2207 * room.powerSupply) +
            (1103 * room.ON_OFF) +
            (2207 * room.sixteen_A) +
            (1428 * room.zemoteDimming) +
            (1817 * room.triacDimming) +
            (2142 * room.fanDimming) +
            (1817 * room.curtain) +
            (649 * room.twoWaySwitchInput) +
            (11151 * room.lightFanModule) +
            (8113 * room.lightModule_2_ZemoteDimming) +
            (8113 * room.lightModule_2_TriacDimming) +
            (4956 * room.lightModule_2_NonDimming) +
            (7434 * room.lightModule_4_NonDimming) +
            (8054 * room.smartUniversalRemote) +
            (3098 * room.smartUniversalRemoteMini) +
            (6195 * room.smartUniversalRemoteWired) +
            (7434 * room.smartUniversalRemotePlus) +
            (12390 * room.smartUniversalRemotePro) +
            (6600 * room.powerModule) +
            (8437 * room.curtainController2) +
            (12980 * room.curtainController4) +
            (3528 * room.tewlve_V_LEDStripDimmer) +
            (7080 * room.dryContact_NONCModule) +
            (room.MAPType === "Glass" && room.customizedText === "yes" ? 500 : 0) +
            (room.MAPType === "Veneer" && room.customizedText === "yes" ? 750 : 0) +
            (room.MAPType === "stone" && room.customizedText === "yes" ? 750 : 0) +
            (room.MAPType === "Glass" && room.customizedIcon_2_perPlate === "yes" ? 1000 : 0) +
            (room.MAPType === "Polycarbonate" && room.customizedIcon_2_perPlate === "yes" ? 1000 : 0) +
            (room.MAPType === "Polycarbonate" && room.customizedIcon_11_perPlate === "yes" ? 2000 : 0) +
            (room.MAPType === "Glass" && room.customizedIcon_11_perPlate === "yes" ? 2000 : 0) +
            (room.border_ColorCustomizationPerPlate === "yes" ? 5000 : 0) +
            (room.CustomizedVeneer === "yes" ? 1500 : 0);

        const frontPlate = getFrontPlateCost(room.MAPModule, room.MAPType); // Now defined or imported
        return backModel + frontPlate;
    };

    const getFrontPlateCost = (MAPModule, MAPType) => {
        // Example logic for calculating front plate cost
        if (MAPType === "Glass") {
            return MAPModule * 500; // Example cost per module for Glass
        } else if (MAPType === "Veneer") {
            return MAPModule * 750; // Example cost per module for Veneer
        } else if (MAPType === "stone") {
            return MAPModule * 1000; // Example cost per module for Stone
        } else if (MAPType === "Polycarbonate") {
            return MAPModule * 300; // Example cost per module for Polycarbonate
        }
        return 0; // Default cost if no type matches
    };

    useEffect(() => {

        // product
        const calculateLightingMotionSensor = () => {
            return (formData.lightingMotionSensorUnit) * (formData.lightingMotionSensorCost);
        };

        const calculateBlindTrack = () => {
            return (formData.blindTrackUnit) * (formData.blindTrackCost);
        };

        const calculateBlindMotor = () => {
            return (formData.blindMotorUnit) * (formData.blindMotorCost);
        };

        const calculateCurtainTrack = () => {
            return (formData.curtainTrackUnit) * (formData.curtainTrackCost);
        };
        const calculateCurtainMotor = () => {
            return (formData.curtainMotorUnit) * (formData.curtainMotorCost);
        };


        // network and cctv
        const calculateGateAutomation = () => {
            return (formData.gateAutomationUnit) * (formData.gateAutomationCost)
        }
        const calculateSixteenPortPoeHikvision = () => {
            return (formData.sixteenPortPoeHikvisionUnit) * (formData.sixteenPortPoeHikvisionCost)
        }
        const calculateFourMPCamaraBulletHikvisionColour = () => {
            return (formData.fourMPCamaraBulletHikvisionColourUnit) * (formData.fourMPCamaraBulletHikvisionColourCost)
        }
        const calculateSixMPPanaromicCOLORVUFixedBulletnetworkcamara = () => {
            return (formData.sixMPPanaromicCOLORVUFixedBulletnetworkcamaraUnit) * (formData.sixMPPanaromicCOLORVUFixedBulletnetworkcamaraCost)
        }
        const calculateAccessPointTPlink = () => {
            return (formData.accessPointTPlinkUnit) * (formData.accessPointTPlinkCost)
        }
        const calculateRJ_45 = () => {
            return (formData.RJ_45Unit) * (formData.RJ_45Cost)
        }
        const calculatePVCBoxes = () => {
            return (formData.PVCBoxesUnit) * (formData.PVCBoxesCost)
        }
        const calculateHardDisk_2_TB = () => {
            return (formData.hardDisk_2_TBUnit) * (formData.hardDisk_2_TBCost)
        }
        const calculateNVRHikvision_16_channel = () => {
            return (formData.NVRHikvision_16_channelUnit) * (formData.NVRHikvision_16_channelCost)
        }

        // cable
        const calculateSpeakerCable_90M = () => {
            return (formData.speakerCable_90_MUnit) * (formData.speakerCable_90_MCost)
        }
        const calculateHDMICable_10_M = () => {
            return (formData.HDMICable_10_MUnit) * (formData.HDMICable_10_MCost)
        }
        const calculateSubwooferCable_5_M = () => {
            return (formData.subwooferCable_5_MUnit) * (formData.subwooferCable_5_MCost)
        }


        // product
        const calculateTotalProductCost = () => {
            return (
                calculateLightingMotionSensor() +
                calculateBlindTrack() +
                calculateBlindMotor() +
                calculateCurtainTrack() +
                calculateCurtainMotor()
            );
        };

        // Networking and CCTV Sectio
        const calculateNetAndCCtv = () => {
            return (
                calculateGateAutomation() +
                calculateSixteenPortPoeHikvision() +
                calculateFourMPCamaraBulletHikvisionColour() +
                calculateSixMPPanaromicCOLORVUFixedBulletnetworkcamara() +
                calculateAccessPointTPlink() +
                calculateRJ_45() +
                calculatePVCBoxes() +
                calculateHardDisk_2_TB() +
                calculateNVRHikvision_16_channel()
            )
        }

        // cable
        const calculateTotalCablesCost = () => {
            return (
                calculateSpeakerCable_90M() +
                calculateHDMICable_10_M() +
                calculateSubwooferCable_5_M()
            )
        }



        // product
        const lightingMotionSensor = calculateLightingMotionSensor();
        const blindTrack = calculateBlindTrack();
        const blindMotor = calculateBlindMotor()
        const curtainTrack = calculateCurtainTrack()
        const curtainMotor = calculateCurtainMotor()
        const totalProductCost = calculateTotalProductCost();

        // vdp
        const totalVdp = (formData.vdpDoorSystemUnit) * (formData.vdpDoorSystemCost)

        // networking and cctv
        const gateAutomation = calculateGateAutomation()
        const sixteenPortPoeHikvision = calculateSixteenPortPoeHikvision()
        const fourMPCamaraBulletHikvisionColour = calculateFourMPCamaraBulletHikvisionColour()
        const sixMPPanaromicCOLORVUFixedBulletnetworkcamara = calculateSixMPPanaromicCOLORVUFixedBulletnetworkcamara()
        const accessPointTPlink = calculateAccessPointTPlink()
        const RJ_45 = calculateRJ_45()
        const PVCBoxes = calculatePVCBoxes()
        const hardDisk_2_TB = calculateHardDisk_2_TB()
        const NVRHikvision_16_channel = calculateNVRHikvision_16_channel()
        const totalNetworkingAndCCTV = calculateNetAndCCtv()

        // cable
        const speakerCable_90_M = calculateSpeakerCable_90M()
        const hDMICable_10_M = calculateHDMICable_10_M()
        const subwooferCable_5_M = calculateSubwooferCable_5_M()
        const totalCablesCost = calculateTotalCablesCost()


        const totalRoomCost = formData.MAPRooms.reduce((total, room) => {
            return total + calculateRoomCost(room);
        }, 0);

        handleChange('totalRoomCost', totalRoomCost); // Update the total room cost in formData

        // product
        handleChange('lightingMotionSensor', lightingMotionSensor);
        handleChange('blindTrack', blindTrack);
        handleChange('blindMotor', blindMotor);
        handleChange('curtainTrack', curtainTrack);
        handleChange('curtainMotor', curtainMotor);
        handleChange('totalProductCost', totalProductCost);

        // vdp
        handleChange('vdpDoorSystem', totalVdp);

        // networking and cctv
        handleChange('gateAutomation', gateAutomation)
        handleChange('sixteenPortPoeHikvision', sixteenPortPoeHikvision)
        handleChange('fourMPCamaraBulletHikvisionColour', fourMPCamaraBulletHikvisionColour)
        handleChange('sixMPPanaromicCOLORVUFixedBulletnetworkcamara', sixMPPanaromicCOLORVUFixedBulletnetworkcamara)
        handleChange('accessPointTPlink', accessPointTPlink)
        handleChange('RJ_45', RJ_45)
        handleChange('PVCBoxes', PVCBoxes)
        handleChange('hardDisk_2_TB', hardDisk_2_TB)
        handleChange('NVRHikvision_16_channel', NVRHikvision_16_channel)
        handleChange('totalNetworkingAndCCTV', totalNetworkingAndCCTV)

        // cable
        handleChange('speakerCable_90_M', speakerCable_90_M)
        handleChange('HDMICable_10_M', hDMICable_10_M)
        handleChange('subwooferCable_5_M', subwooferCable_5_M)
        handleChange('totalCablesCost', totalCablesCost)


    }, [

        formData.lightingMotionSensorUnit,
        formData.lightingMotionSensorCost,
        formData.blindTrackUnit,
        formData.blindTrackCost,
        formData.blindMotorUnit,
        formData.blindMotorCost,
        formData.blindMotor,
        formData.curtainTrackUnit,
        formData.curtainTrackCost,
        formData.curtainTrack,
        formData.curtainMotorUnit,
        formData.curtainMotorCost,
        formData.curtainMotor,

        // vdp
        formData.vdpDoorSystemUnit,
        formData.vdpDoorSystemCost,

        // networking and cctv
        formData.totalNetworkingAndCCTV,


        // cable
        formData.speakerCable_90_MUnit,
        formData.speakerCable_90_MCost,
        formData.HDMICable_10_MUnit,
        formData.HDMICable_10_MCost,
        formData.subwooferCable_5_MUnit,
        formData.subwooferCable_5_MCost,
        // formData.totalCablesCost,

        formData.MAPRooms

    ]);



    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <input type="text" placeholder="Property Type" value={formData.propertyType} onChange={e => handleChange('propertyType', e.target.value)} />
            <input type="text" placeholder="Client Name" value={formData.client} onChange={e => handleChange('client', e.target.value)} />
            <input type="text" placeholder="Mobile" value={formData.mobile} onChange={e => handleChange('mobile', e.target.value)} />
            <input type="text" placeholder="Address" value={formData.address} onChange={e => handleChange('address', e.target.value)} />
            <input type="date" value={formData.quotationDate} onChange={e => handleChange('quotationDate', e.target.value)} />


            <h3 className="text-lg font-bold mt-4">Rooms</h3>
            <div className="quotation-container" ref={quotationRef}>

                <button className="download-btn" onClick={() => {
                    setItems([
                        Object.fromEntries(fieldNames.map(name => [name, '']))
                    ])
                }}>
                    RESET TABLE
                </button>
                <button className="add-btn" onClick={addItem}>+ Add Item</button>
                <div className="quotation-table-wrapper">
                    <div className="table-scroll-vertical">
                        <table className='table'>
                            <thead>
                                <tr className='tableHeadings'>
                                    {fieldLabels.map((label, i) => (
                                        <th key={i}>{label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Row 1: Prices */}
                                <tr className='prodPrice'>
                                    {fieldNames.map((field, i) => (
                                        <td key={i}><strong>{defaultPrices[field] || ''}</strong></td>
                                    ))}
                                </tr>

                                {/* Rest of the table */}
                                {items.map((item, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {fieldNames.map((field, i) => (
                                            <td key={i}>
                                                <input
                                                    type={textFields.has(field) ? 'text' : 'number'}
                                                    value={item[field] || ''}
                                                    onChange={(e) => {
                                                        const newItems = [...items];
                                                        newItems[rowIndex][field] = textFields.has(field)
                                                            ? e.target.value
                                                            : parseFloat(e.target.value) || 0;
                                                        setItems(newItems);
                                                    }}
                                                />
                                            </td>
                                        ))}
                                        <td><strong>₹ {calculateRowTotal(item).toFixed(2)}</strong></td>
                                    </tr>
                                ))}

                                {/* Totals */}
                                <tr className='prodPrice'>
                                    {fieldNames.map((field, i) =>
                                        textFields.has(field) ? (
                                            <td key={i}></td>
                                        ) : (
                                            <td key={i}>
                                                <strong>₹ {calculateColumnTotals()[field]?.toFixed(2) || '0.00'}</strong>
                                            </td>
                                        )
                                    )}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="summary">
                    <p><strong>Grand Total:</strong> ₹ {calculateGrandTotal().toFixed(2)}</p>
                </div>
            </div>

            {/* Back Module	Front,  plate Selected  calculate kr k grand total me add krvana  niche vale invoice ka grand total aur thode calculations kr k muj backend me bej dena maine jo format me beja vaisa 
               Tunable + Dimmable LED Driver,	RGB LED Strip Controller ye alag se invoice me add hore rooms me koi calculation nhi hai inka
            */}



            <h3 className="text-lg font-bold mt-4">invoice</h3>
            <div className="p-6 border rounded bg-white shadow-sm space-y-4">
                {/* Product Selection Section */}
                <div>
                    <label className="block mb-1">Lighting Motion Sensor</label>
                    <input type="number" placeholder='unit' value={formData.lightingMotionSensorUnit} onChange={e => handleChange('lightingMotionSensorUnit', parseInt(e.target.value))} />
                    <input type="number" placeholder="per unit cost" value={formData.lightingMotionSensorCost} onChange={e => handleChange('lightingMotionSensorCost', parseInt(e.target.value))} />
                    <label value={formData.lightingMotionSensor} > total : {formData?.lightingMotionSensorUnit * formData?.lightingMotionSensorCost}</label>

                </div>

                <div>
                    <label className="block mb-1">Blind Track</label>
                    <input type="number" placeholder='unit' value={formData.blindTrackUnit} onChange={e => handleChange('blindTrackUnit', parseInt(e.target.value))} />
                    <input type="number" placeholder="per unit cost" value={formData.blindTrackCost} onChange={e => handleChange('blindTrackCost', parseInt(e.target.value))} />
                    <label value={formData.blindTrack}> total : {formData?.blindTrackUnit * formData.blindTrackCost} </label>
                </div>

                <div>
                    <label className="block mb-1">Blind Motor</label>
                    <input type="number" value={formData.blindMotorUnit} onChange={e => handleChange('blindMotorUnit', parseInt(e.target.value))} />
                    <input type="number" value={formData.blindMotorCost} onChange={e => handleChange('blindMotorCost', parseInt(e.target.value))} />
                    <label value={formData.blindMotor} > total : {formData?.blindMotorUnit * formData.blindMotorCost}</label>
                </div>

                <div>
                    <label className="block mb-1">Curtain Track</label>
                    <input type="number" value={formData.curtainTrackUnit} onChange={e => handleChange('curtainTrackUnit', parseInt(e.target.value))} />
                    <input type="number" value={formData.curtainTrackCost} onChange={e => handleChange('curtainTrackCost', parseInt(e.target.value))} />
                    <label value={formData.curtainTrack} > total : {formData?.curtainTrackUnit * formData?.curtainTrackCost}</label>
                </div>

                <div>
                    <label className="block mb-1">Curtain Motor</label>
                    <input type="number" value={formData.curtainMotorUnit} onChange={e => handleChange('curtainMotorUnit', parseInt(e.target.value))} />
                    <input type="number" value={formData.curtainMotorCost} onChange={e => handleChange('curtainMotorCost', parseInt(e.target.value))} />
                    <label value={formData.curtainMotor} > total : {formData?.curtainMotorUnit * formData?.curtainMotorCost}</label>
                </div>

                <div>
                    <label className="block mb-1">Total Product Cost</label>
                    <input type="number" value={formData.totalProductCost} disabled />
                </div>


                <h3 className="text-lg font-bold mt-4">VDP Door System</h3>
                {/* VDP door system */}
                <div>
                    <label className="block mb-1">VDP Door System</label>
                    <input type="number" value={formData.vdpDoorSystemUnit} onChange={e => handleChange('vdpDoorSystemUnit', parseInt(e.target.value))} />
                    <input type="number" value={formData.vdpDoorSystemCost} onChange={e => handleChange('vdpDoorSystemCost', parseInt(e.target.value))} />
                    <label value={formData.vdpDoorSystem}> total : {formData.vdpDoorSystemUnit * formData.vdpDoorSystemCost}</label>
                </div>

                {/* gate automation */}
                <div>
                    <label className="block mb-1">Gate Automation</label>
                    <input type="number" value={formData.gateAutomationUnit} onChange={e => handleChange('gateAutomationUnit', parseInt(e.target.value))} />
                    <input type="number" value={formData.gateAutomationCost} onChange={e => handleChange('gateAutomationCost', parseInt(e.target.value))} />
                    <label value={formData.gateAutomation} > total : {formData?.gateAutomationUnit * formData?.gateAutomationCost}</label>
                </div>


                {/* Tunable + Dimmable LED Driver,RGB LED Strip   TODO*/}




                {/* Networking and CCTV Section */}
                <h3 className="font-semibold text-lg mt-6">Networking & CCTV</h3>


                <div>
                    <label className="block mb-1">16 Port POE Hikvision</label>
                    <input type="number" value={formData.sixteenPortPoeHikvisionUnit} onChange={e => handleChange('sixteenPortPoeHikvisionUnit', parseInt(e.target.value))} />
                    <input type="number" value={formData.sixteenPortPoeHikvisionCost} onChange={e => handleChange('sixteenPortPoeHikvisionCost', parseInt(e.target.value))} />
                    <label value={formData.sixteenPortPoeHikvision} > total : {formData?.sixteenPortPoeHikvisionUnit * formData?.sixteenPortPoeHikvisionCost}</label>
                </div>

                <div>
                    <label className="block mb-1">4MP Bullet Cam Hikvision Colour</label>
                    <input type="number" value={formData.fourMPCamaraBulletHikvisionColourUnit} onChange={e => handleChange('fourMPCamaraBulletHikvisionColourUnit', parseInt(e.target.value))} />
                    <input type="number" value={formData.fourMPCamaraBulletHikvisionColourCost} onChange={e => handleChange('fourMPCamaraBulletHikvisionColourCost', parseInt(e.target.value))} />
                    <label value={formData.fourMPCamaraBulletHikvisionColour} > total : {formData?.fourMPCamaraBulletHikvisionColourUnit * formData?.fourMPCamaraBulletHikvisionColourCost}</label>
                </div>

                <div>
                    <label className="block mb-1">6MP Panoramic COLORVU Bullet Cam</label>
                    <input type="number" value={formData.sixMPPanaromicCOLORVUFixedBulletnetworkcamaraUnit} onChange={e => handleChange('sixMPPanaromicCOLORVUFixedBulletnetworkcamaraUnit', parseInt(e.target.value))} />
                    <input type="number" value={formData.sixMPPanaromicCOLORVUFixedBulletnetworkcamaraCost} onChange={e => handleChange('sixMPPanaromicCOLORVUFixedBulletnetworkcamaraCost', parseInt(e.target.value))} />
                    <label value={formData.sixMPPanaromicCOLORVUFixedBulletnetworkcamara} > total : {formData.sixMPPanaromicCOLORVUFixedBulletnetworkcamaraUnit * formData.sixMPPanaromicCOLORVUFixedBulletnetworkcamaraCost}</label>
                </div>

                <div>
                    <label className="block mb-1">Access Point (TP-Link)</label>
                    <input type="number" value={formData.accessPointTPlinkUnit} onChange={e => handleChange('accessPointTPlinkUnit', parseInt(e.target.value))} />
                    <input type="number" value={formData.accessPointTPlinkCost} onChange={e => handleChange('accessPointTPlinkCost', parseInt(e.target.value))} />
                    <label value={formData.accessPointTPlink} > total : {formData.accessPointTPlinkUnit * formData.accessPointTPlinkCost}</label>
                </div>

                <div>
                    <label className="block mb-1">RJ-45 Connectors</label>
                    <input type="number" value={formData.RJ_45Unit} onChange={e => handleChange('RJ_45Unit', parseInt(e.target.value))} />
                    <input type="number" value={formData.RJ_45Cost} onChange={e => handleChange('RJ_45Cost', parseInt(e.target.value))} />
                    <label value={formData.RJ_45}> total : {formData.RJ_45Unit * formData.RJ_45Cost}</label>
                </div>

                <div>
                    <label className="block mb-1">PVC Boxes</label>
                    <input type="number" value={formData.PVCBoxesUnit} onChange={e => handleChange('PVCBoxesUnit', parseInt(e.target.value))} />
                    <input type="number" value={formData.PVCBoxesCost} onChange={e => handleChange('PVCBoxesCost', parseInt(e.target.value))} />
                    <label value={formData.PVCBoxes} > total : {formData.PVCBoxesUnit * formData.PVCBoxesCost}</label>
                </div>

                <div>
                    <label className="block mb-1">Hard Disk 2TB</label>
                    <input type="number" value={formData.hardDisk_2_TBUnit} onChange={e => handleChange('hardDisk_2_TBUnit', parseInt(e.target.value))} />
                    <input type="number" value={formData.hardDisk_2_TBCost} onChange={e => handleChange('hardDisk_2_TBCost', parseInt(e.target.value))} />
                    <label type="number" value={formData.hardDisk_2_TB} > total : {formData.hardDisk_2_TBUnit * formData.hardDisk_2_TBCost}</label>
                </div>

                <div>
                    <label className="block mb-1">NVR Hikvision 16 Channel</label>
                    <input type="number" value={formData.NVRHikvision_16_channelUnit} onChange={e => handleChange('NVRHikvision_16_channelUnit', parseInt(e.target.value))} />
                    <input type="number" value={formData.NVRHikvision_16_channelCost} onChange={e => handleChange('NVRHikvision_16_channelCost', parseInt(e.target.value))} />
                    <label value={formData.NVRHikvision_16_channel}> total : {formData.NVRHikvision_16_channelUnit * formData.NVRHikvision_16_channelCost}</label>
                    {/* <input type="number" value={formData.NVRHikvision_16_channel} onChange={e => handleChange('NVRHikvision_16_channel', parseInt(e.target.value))}  /> */}
                </div>

                <div>
                    <label className="block mb-1">Total Networking & CCTV Cost</label>
                    <input type="number" value={formData.totalNetworkingAndCCTV} disabled />
                    {/* <input type="number" value={formData.totalNetworkingAndCCTV} onChange={e => handleChange('totalNetworkingAndCCTV', parseFloat(e.target.value))} /> */}
                </div>

                {/* Cables Section */}
                <h3 className="font-semibold text-lg mt-6">Cables</h3>

                <div>
                    <label className="block mb-1">Speaker Cable (90M)</label>
                    <input type="number" value={formData.speakerCable_90_MUnit} onChange={e => handleChange('speakerCable_90_MUnit', parseInt(e.target.value))} />
                    <input type="number" value={formData.speakerCable_90_MCost} onChange={e => handleChange('speakerCable_90_MCost', parseInt(e.target.value))} />
                    <label value={formData.speakerCable_90_M} > total : {formData.speakerCable_90_MUnit * formData.speakerCable_90_MCost}</label>
                </div>

                <div>
                    <label className="block mb-1">HDMI Cable (10M)</label>
                    <input type="number" value={formData.HDMICable_10_MUnit} onChange={e => handleChange('HDMICable_10_MUnit', parseInt(e.target.value))} />
                    <input type="number" value={formData.HDMICable_10_MCost} onChange={e => handleChange('HDMICable_10_MCost', parseInt(e.target.value))} />
                    <label value={formData.HDMICable_10_M} > total : {formData.HDMICable_10_MUnit * formData.HDMICable_10_MCost}</label>
                </div>

                <div>
                    <label className="block mb-1">Subwoofer Cable (5M)</label>
                    <input type="number" value={formData.subwooferCable_5_MUnit} onChange={e => handleChange('subwooferCable_5_MUnit', parseInt(e.target.value))} />
                    <input type="number" value={formData.subwooferCable_5_MCost} onChange={e => handleChange('subwooferCable_5_MCost', parseInt(e.target.value))} />
                    <label value={formData.subwooferCable_5_M} > total : {formData.subwooferCable_5_MUnit * formData.subwooferCable_5_MCost}</label>
                </div>

                <div>
                    <label className="block mb-1">Total Cables Cost</label>
                    <input type="number" value={formData.totalCablesCost} disabled />
                </div>

                {/* Others */}
                <h3 className="font-semibold text-lg mt-6">Additional Items</h3>

                <div>
                    <label className="block mb-1">Alexa</label>
                    <input type="number" value={formData.alexa} onChange={e => handleChange('alexa', parseInt(e.target.value))} />
                </div>

                <div>
                    <label className="block mb-1">Star Point</label>
                    <input type="number" value={formData.starPoint} onChange={e => handleChange('starPoint', parseInt(e.target.value))} />
                </div>

                <div>
                    <label className="block mb-1">Light Engine RGB</label>
                    <input type="number" value={formData.lightEngineRGB} onChange={e => handleChange('lightEngineRGB', parseInt(e.target.value))} />
                </div>

                {/* Installation Section */}
                <h3 className="font-semibold text-lg mt-6">Installation</h3>

                <div>
                    <label className="block mb-1">Installation Cost</label>
                    <input type="number" value={formData.installation} onChange={e => handleChange('installation', parseFloat(e.target.value))} />
                </div>

                <div>
                    <label className="block mb-1">Total Installation Cost</label>
                    <input type="number" value={formData.totalInstallationCost} onChange={e => handleChange('totalInstallationCost', parseFloat(e.target.value))} />
                </div>

                {/* Grand Total */}
                <div>
                    <label className="block mb-1 font-semibold">Grand Total</label>
                    <input type="number" value={formData.grandTotal} onChange={e => handleChange('grandTotal', parseFloat(e.target.value))} />
                </div>
            </div>



            {/* Add other fields like lightingMotionSensor, totalProductCost, etc., similarly */}

            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded mt-4">Submit Quotation</button>
        </form>
    );
};

export default CreateQuotationForm;
