
import React, { useState, useRef, useEffect } from 'react';
import './invoice.css';
import Iproducts from './Iproducts';
import { communication } from '../../services/communication';
import { ToastContainer, toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { toWords } from 'number-to-words';

const Invoice = () => {

  const [clientData, setClientData] = useState({});
  const [quotations, setQuotations] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [ShowEntryQuotation, setShowEntryQuotation] = useState(false);




  const fieldLabels = [
    'Rooms', 'Lights', 'Switch Boards', 'Module', 'Type', 'Color/Pattern',
    'Power Supply', 'ON/OFF', '16A', 'ZIMOTE DIMMING', 'TRIAC DIMMING',
    'FAN DIMMING', 'CURTAIN', '2 WAY SWITCH INPUT', 'Light Fan Module (with Light Dimming)',
    'Light Module (2 Channel with Zemote Dimming)', 'Light Module (2 Channel with Triac Dimming)',
    'Light Module (2 Channel Non Dimming)', 'Light Module (4 Channel Non Dimming)',
    'Smart Universal Remote', 'Smart Universal Remote Mini', 'Smart Universal Remote Wired',
    'Smart Universal Remote Plus', 'Smart Universal Remote Pro', 'Power Module',
    'Curtain controller 2 channel', 'Curtain controller4 channel', '12V LED Strip Dimmer', 'Dry Contact / NONC Module',
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
    'curtain2', 'curtain4', 'ledStrip', 'dryContact',
    'customText', 'customIcon2', 'customIcon11',
    'borderColor', 'customMaterial', 'BackModule', 'FrontplateSelected', 'Total'
  ];

  const quotationRef = useRef();
  const defaultPrices = {

    powerSupply: 2207, onOff: 1103,
    sixteenA: 2207, zemoteDimming: 1428, triacDimming: 1817, fanDimming: 2142,
    curtain: 1817, twoWaySwitch: 649, lightFanModule: 11151, zemoteModule: 8113,
    triacModule: 8113, nonDim2: 4956, nonDim4: 7434, remote: 8054, remoteMini: 3098,
    remoteWired: 6195, remotePlus: 7434, remotePro: 12390, powerModule: 6600, curtain2: 8437,
    curtain4: 12980, ledStrip: 3528,
    dryContact: 7080,

    // ... define prices for each product
  };

  const textFields = new Set(['rooms', 'colorPattern', 'switchBoards', 'module', 'type', 'customText',
    'customIcon2', 'customIcon11', 'borderColor', 'customMaterial']); // add as needed


  const [MAPRooms, setMAPRooms] = useState([
    { rooms: "", lights: 0, module: 0 } // quantities only   - -> after entering remaining data/fields it all shows in items
  ]);


  const getNewItem = () => {
    const newItem = {};
    fieldNames.forEach(field => {
      newItem[field] = textFields.has(field) ? "" : 0;
    });
    return newItem;
  };

  const addItem = () => {
    setMAPRooms([...MAPRooms, getNewItem()]);
  };


  const calculateBackModule = (item) => {
    const MAPType = item.type?.toLowerCase();
    const customizedText = item.customText?.toLowerCase();
    const customizedIcon2 = item.customIcon2?.toLowerCase();
    const customizedIcon11 = item.customIcon11?.toLowerCase();
    const borderColor = item.borderColor?.toLowerCase();
    const customMaterial = item.customMaterial?.toLowerCase();



    const total =
      (2207 * (parseFloat(item.powerSupply) || 0)) +
      (1103 * (parseFloat(item.onOff) || 0)) +
      (2207 * (parseFloat(item.sixteenA) || 0)) +
      (1428 * (parseFloat(item.zemoteDimming) || 0)) +
      (1817 * (parseFloat(item.triacDimming) || 0)) +
      (2142 * (parseFloat(item.fanDimming) || 0)) +
      (1817 * (parseFloat(item.curtain) || 0)) +
      (649 * (parseFloat(item.twoWaySwitch) || 0)) +
      (11151 * (parseFloat(item.lightFanModule) || 0)) +
      (8113 * (parseFloat(item.zemoteModule) || 0)) +
      (8113 * (parseFloat(item.triacModule) || 0)) +
      (4956 * (parseFloat(item.nonDim2) || 0)) +
      (7434 * (parseFloat(item.nonDim4) || 0)) +
      (8054 * (parseFloat(item.remote) || 0)) +
      (3098 * (parseFloat(item.remoteMini) || 0)) +
      (6195 * (parseFloat(item.remoteWired) || 0)) +
      (7434 * (parseFloat(item.remotePlus) || 0)) +
      (12390 * (parseFloat(item.remotePro) || 0)) +
      (6600 * (parseFloat(item.powerModule) || 0)) +
      (8437 * (parseFloat(item.curtain2) || 0)) +
      (12980 * (parseFloat(item.curtain4) || 0)) +
      (3528 * (parseFloat(item.ledStrip) || 0)) +
      (7080 * (parseFloat(item.dryContact) || 0)) +
      ((MAPType === "glass" && customizedText === "yes") ? 500 : 0) +
      ((MAPType === "veneer" && customizedText === "yes") ? 750 : 0) +
      ((MAPType === "stone" && customizedText === "yes") ? 750 : 0) +
      ((MAPType === "glass" && customizedIcon2 === "yes") ? 1000 : 0) +
      ((MAPType === "polycarbonate" && customizedIcon2 === "yes") ? 1000 : 0) +
      ((MAPType === "polycarbonate" && customizedIcon11 === "yes") ? 2000 : 0) +
      ((MAPType === "glass" && customizedIcon11 === "yes") ? 2000 : 0) +
      ((borderColor === "yes") ? 5000 : 0) +
      ((customMaterial === "yes") ? 1500 : 0);


    return total;
  };

  function calculateFrontPlate(item) {
    const type = item.type?.toLowerCase();
    const module = Number(item.module)

    if (module === 2 && (type === "polycarbonate" || type === "glass")) return 5428;
    if (module === 2 && (type === "stone" || type === "veneer")) return 8142;

    if (module === 3 && (type === "polycarbonate" || type === "glass")) return 6107;
    if (module === 3 && (type === "stone" || type === "veneer")) return 9499;

    if (module === 4 && (
      type === "polycarbonate" || type === "glass" ||
      type === "polycarbonate with socket" || type === "glass with socket"
    )) return 6785;
    if (module === 4 && (type === "stone" || type === "veneer")) return 10856;

    if (module === 6 && (
      type === "polycarbonate" || type === "glass" ||
      type === "polycarbonate with socket" || type === "glass with socket"
    )) return 8142;
    if (module === 6 && (type === "stone" || type === "veneer")) return 13570;

    if (module === 8 && (
      type === "polycarbonate" || type === "glass" ||
      type === "polycarbonate with socket" || type === "glass with socket"
    )) return 8821;
    if (module === 8 && (type === "stone" || type === "veneer")) return 16284;

    // Default if no match
    return 0;

  }

  // calculating one room total cost
  const calculateRowTotal = (item) => {
    const back = calculateBackModule(item);
    const front = calculateFrontPlate(item);
    const rowTotal = back + front
    return rowTotal;
  };
  // calculating all rooms front module total (totalFrontProjectCost)
  let totalFrontProjectCost = MAPRooms.reduce((sum, item) => sum + calculateFrontPlate(item), 0);

  // calculating all rooms back module total (totalBackProjectCost)
  let totalBackProjectCost = MAPRooms.reduce((sum, item) => sum + calculateBackModule(item), 0);

  // calculating all rooms total (projectTotalCost)
  // calculating all rooms total (projectTotalCost)
  let totalProjectCost = MAPRooms.reduce((sum, item) => sum + calculateRowTotal(item), 0);

  //form handling 
  //form handling 

  const initialFormData = {
    propertyType: "Residential",
    client: "",
    mobile: "",
    quotationDate: "",
    address: ""
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    // Clear error as user types
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ""
    }));
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.client.trim()) newErrors.client = "Client name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Enter a valid 10-digit number";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    return newErrors;
  };




  // for second table
  // for second table
  // for sec table


  // data send to backend - clientData,
  //  MAPRooms[array of {Front module, back module , total,...},{},...] ,
  // products data units, unitPrice, productTotal,
  //  Grand Total = ProjectsTotal + ProductsTotal ,
  // grand Total  = Grand Total + additional charges + Installation charges  
  // All are stored in  "quotations" state

  console.log(totalProjectCost);

  const handleQuotationSubmit = (totals) => {



    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fill all the fields in the form!');
      return;
    } else {
      toast.success('Products added successfully');

      // Optionally reset form
      setFormData(initialFormData);
      setErrors({});
    }

    const updatedData = {
      ...formData,
      ...totals, // 👈 This spreads all product-related keys directly into main object
      MAPRooms,
      totalProjectCost,
      totalBackProjectCost,
      totalFrontProjectCost,
      productTotal: totals.totalProductsCost, // Still okay to reference for clarity
      grandTotal: totals.grandTotal
    };

    // Save to quotations list

    const newQuotations = [...quotations, updatedData];
    // console.log("New Quotation: ", ...quotations);
    setQuotations(newQuotations);
    setClientData(updatedData);

    setGrandTotal(totals.grandTotal);

    // excel

    const dataToExport = newQuotations.map((q, i) => ({
      Sr: i + 1,
      Client: q.client,
      Mobile: q.mobile,
      Address: q.address,
      Date: q.quotationDate,

      additionalitemsalexaQuantity: q.additionalitemsalexaQuantity,
      additionalitemsalexaUnitPrice: q.additionalitemsalexaUnitPrice,
      totalAdditionalitemsalexa: q.totalAdditionalitemsalexa,

      blindsblindTrackUnitPrice: q.blindsblindTrackUnitPrice,
      blindsblindTrackQuantity: q.blindsblindTrackQuantity,
      totalBlindsCost: q.totalBlindsCost,

      blindsblindMotorUnitPrice: q.blindsblindMotorUnitPrice,
      blindsblindMotorQuantity: q.blindsblindMotorQuantity,
      totalBlindsblindMotor: q.totalBlindsblindMotor,

      additionalitemslightEngineRgbColourTwinkleEffectQuantity: q.additionalitemslightEngineRgbColourTwinkleEffectQuantity,
      additionalitemslightEngineRgbColourTwinkleEffectUnitPrice: q.additionalitemslightEngineRgbColourTwinkleEffectUnitPrice,
      totalAdditionalitemslightEngineRgbColourTwinkleEffect: q.totalAdditionalitemslightEngineRgbColourTwinkleEffect,

      additionalitemsstarPointRatio75mm501mm3015mmQuantity: q.additionalitemsstarPointRatio75mm501mm3015mmQuantity,
      additionalitemsstarPointRatio75mm501mm3015mmUnitPrice: q.additionalitemsstarPointRatio75mm501mm3015mmUnitPrice,
      totalAdditionalitemsstarPointRatio75mm501mm3015mm: q.totalAdditionalitemsstarPointRatio75mm501mm3015mm,


      cablessubwooferCable5mUnitPrice: q.cablessubwooferCable5mUnitPrice,
      cablessubwooferCable5mQuantity: q.cablessubwooferCable5mQuantity,
      totalCablessubwooferCable5m: q.totalCablessubwooferCable5m,

      cableshdmiCable10mQuantity: q.cableshdmiCable10mQuantity,
      cableshdmiCable10mUnitPrice: q.cableshdmiCable10mUnitPrice,
      totalCableshdmiCable10m: q.totalCableshdmiCable10m,

      cablesspeakerCable90mQuantity: q.cablesspeakerCable90mQuantity,
      cablesspeakerCable90mUnitPrice: q.cablesspeakerCable90mUnitPrice,
      totalCablesspeakerCable90m: q.totalCablesspeakerCable90m,

      curtainscurtainMotorUnitPrice: q.curtainscurtainMotorUnitPrice,
      curtainscurtainMotorQuantity: q.curtainscurtainMotorQuantity,
      totalCurtainscurtainMotor: q.totalCurtainscurtainMotor,

      curtainscurtainTrackUnitPrice: q.curtainscurtainTrackUnitPrice,
      curtainscurtainTrackQuantity: q.curtainscurtainTrackQuantity,
      totalCurtainscurtainTrack: q.totalCurtainscurtainTrack,

      driversrgbLedStripControllerQuantity: q.driversrgbLedStripControllerQuantity,
      driversrgbLedStripControllerUnitPrice: q.driversrgbLedStripControllerUnitPrice,
      totalDriversrgbLedStripController: q.totalDriversrgbLedStripController,

      driverstunableDimmableLedDriverQuantity: q.driverstunableDimmableLedDriverQuantity,
      driverstunableDimmableLedDriverUnitPrice: q.driverstunableDimmableLedDriverUnitPrice,
      totalDriverstunableDimmableLedDriver: q.totalDriverstunableDimmableLedDriver,

      gateautomationsystemgateAutomationMotorOneSideOpeningQuantity: q.gateautomationsystemgateAutomationMotorOneSideOpeningQuantity,
      gateautomationsystemgateAutomationMotorOneSideOpeningUnitPrice: q.gateautomationsystemgateAutomationMotorOneSideOpeningUnitPrice,
      totalGateautomationsystemgateAutomationMotorOneSideOpening: q.totalGateautomationsystemgateAutomationMotorOneSideOpening,


      lightingmotionSensorQuantity: q.lightingmotionSensorQuantity,
      lightingmotionSensorUnitPrice: q.lightingmotionSensorUnitPrice,
      totalLightingmotionSensor: q.totalLightingmotionSensor,

      "networking&cctv4mpBulletCamHikvisionColourQuantity": q["networking&cctv4mpBulletCamHikvisionColourQuantity"],
      "networking&cctv4mpBulletCamHikvisionColourUnitPrice": q["networking&cctv4mpBulletCamHikvisionColourUnitPrice"],
      "totalNetworking&cctv4mpBulletCamHikvisionColour": q["totalNetworking&cctv4mpBulletCamHikvisionColour"],

      "networking&cctv6mpPanoramicColorvuBulletCamQuantity": q["networking&cctv6mpPanoramicColorvuBulletCamQuantity"],
      "networking&cctv6mpPanoramicColorvuBulletCamUnitPrice": q["networking&cctv6mpPanoramicColorvuBulletCamUnitPrice"],
      "totalNetworking&cctv6mpPanoramicColorvuBulletCam": q["totalNetworking&cctv6mpPanoramicColorvuBulletCam"],

      "networking&cctv16PortPoeHikvisionQuantity": q["networking&cctv16PortPoeHikvisionQuantity"],
      "networking&cctv16PortPoeHikvisionUnitPrice": q["networking&cctv16PortPoeHikvisionUnitPrice"],
      "totalNetworking&cctv16PortPoeHikvision": q["totalNetworking&cctv16PortPoeHikvision"],

      "networking&cctvaccessPointTpLinkQuantity": q["networking&cctvaccessPointTpLinkQuantity"],
      "networking&cctvaccessPointTpLinkUnitPrice": q["networking&cctvaccessPointTpLinkUnitPrice"],
      "totalNetworking&cctvaccessPointTpLink": q["totalNetworking&cctvaccessPointTpLink"],

      "networking&cctvrj45ConnectorsQuantity": q["networking&cctvrj45ConnectorsQuantity"],
      "networking&cctvrj45ConnectorsUnitPrice": q["networking&cctvrj45ConnectorsUnitPrice"],
      "totalNetworking&cctvrj45Connectors": q["totalNetworking&cctvrj45Connectors"],

      "networking&cctvhardDisk2tbQuantity": q["networking&cctvhardDisk2tbQuantity"],
      "networking&cctvhardDisk2tbUnitPrice": q["networking&cctvhardDisk2tbUnitPrice"],
      "totalNetworking&cctvhardDisk2tb": q["totalNetworking&cctvhardDisk2tb"],

      "networking&cctvpvcBoxesQuantity": q["networking&cctvpvcBoxesQuantity"],
      "networking&cctvpvcBoxesUnitPrice": q["networking&cctvpvcBoxesUnitPrice"],
      "totalNetworking&cctvpvcBoxes": q["totalNetworking&cctvpvcBoxes"],

      "networking&cctvnvrHikvision16ChannelUnitPrice": q["networking&cctvnvrHikvision16ChannelUnitPrice"],
      "networking&cctvnvrHikvision16ChannelQuantity": q["networking&cctvnvrHikvision16ChannelQuantity"],
      "totalNetworking&cctvnvrHikvision16Channel": q["totalNetworking&cctvnvrHikvision16Channel"],

      vdpdoorsystemvdpDoorSystemQuantity: q.vdpdoorsystemvdpDoorSystemQuantity,
      vdpdoorsystemvdpDoorSystemUnitPrice: q.vdpdoorsystemvdpDoorSystemUnitPrice,
      totalVdpdoorsystemvdpDoorSystem: q.totalVdpdoorsystemvdpDoorSystem,

      vdpdoorsystemvdpDoorSystemQuantity: q.vdpdoorsystemvdpDoorSystemQuantity,
      vdpdoorsystemvdpDoorSystemUnitPrice: q.vdpdoorsystemvdpDoorSystemUnitPrice,
      totalVDPDoorSystemCost: q.totalVDPDoorSystemCost,

      totalLightingCost: q.totalLightingCost,
      totalBlindsblindTrack: q.totalBlindsblindTrack,
      totalCurtainsCost: q.totalCurtainsCost,
      totalVDPDoorSystemCost: q.totalVDPDoorSystemCost,
      totalGateAutomationSystemCost: q.totalGateAutomationSystemCost,
      totalDriversCost: q.totalDriversCost,
      "totalNetworking&CCTVCost": q["totalNetworking&CCTVCost"],
      totalCablesCost: q.totalCablesCost,
      totalAdditionalItemsCost: q.totalAdditionalItemsCost,

      totalFrontProjectCost: q.totalFrontProjectCost,
      totalBackProjectCost: q.totalBackProjectCost,

      MAPRooms: q.MAPRooms?.map((room, idx) =>
        `Room ${idx + 1}:\n` +
        Object.entries(room).map(([key, value]) => `${key}: ${value}`).join("\n")
      ).join("\n\n") || "",

      ProjectCost: q.totalProjectCost,
      ProductCost: q.totalProductsCost,
      totalBeforeInstallation: q.totalBeforeInstallation,
      generalInstallationCharges: q.generalInstallationCharges,
      additionalInstallationCharges: q.additionalInstallationCharges,
      GrandTotal: q.grandTotal
    }));
    const lastQuotation = dataToExport[dataToExport.length - 1];
    const worksheet = XLSX.utils.json_to_sheet([lastQuotation]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice");

    XLSX.writeFile(workbook, `Invoice.xlsx`);
    // excel

    // pdf pdf pdf
    // pdf
    // pdf pdf pdf
   // pdf pdf pdf
   const doc = new jsPDF();
   const pageWidth = doc.internal.pageSize.getWidth();
   const headerHeight = 25;

   // 0. Draw orange vertical strip on the left
   doc.setFillColor(238, 128, 26); // #ee801a
   doc.rect(0, 0, 8, doc.internal.pageSize.getHeight(), 'F'); // (x, y, width, height)

   // 1. Insert logo (left top corner)
   const logoBase64 = 'data:image/jpeg;base64,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'; // replace with your actual base64
   doc.addImage(logoBase64, 'PNG', 14, 10, 25, 25); // (x, y, width, height)

   // 2. Add company name & subtitle beside logo
   doc.setFontSize(16);
   doc.setTextColor(33, 37, 41); // dark gray
   doc.text("CHROMATICS", 42, 16);

   doc.setFontSize(10);
   doc.setTextColor(120);
   doc.text("HOME AUTOMATION", 42, 22);
   doc.text("AV SOLUTIONS", 42, 27);

   // 3. Draw orange block on right side
   doc.setFillColor(238, 128, 26); // #ee801a
   doc.rect(pageWidth - 90, 10, 80, headerHeight, 'F'); // (x, y, width, height, style='F' for filled)

   // 4. Add contact details in orange block
   doc.setFontSize(9);
   doc.setTextColor(255); // white text

   doc.text("+91 9209628554", pageWidth - 85, 16);
   doc.text("help@chromatics2024.com", pageWidth - 85, 20);
   doc.text("Plot No. 31, Near Hingna T-point,", pageWidth - 85, 24);
   doc.text("Below Rachna Ring Metro Station,", pageWidth - 85, 28);
   doc.text("Nagpur - 440036", pageWidth - 85, 32);

   doc.setFontSize(11);
   doc.setTextColor(33, 37, 41);

   const lastQuotationpdf = newQuotations[newQuotations.length - 1];
   const leftMargin = 16; // Keeps spacing from the orange strip

   let y = 63;

   doc.setFontSize(12);
   doc.setFont("helvetica");


   const text = "Invoice";
   const textWidth = doc.getTextWidth(text);
   const x = (pageWidth - textWidth) / 2;

   doc.text(text, x, y); // Now centered

   y += 10;

   doc.text(`To,`, leftMargin, y);
   y += 7;

   doc.text(`${lastQuotationpdf.client}`, leftMargin, y);
   y += 7;

   doc.text(`${lastQuotationpdf.mobile}`, leftMargin, y);
   y += 7;

   const splitAddress = doc.splitTextToSize(lastQuotationpdf.address, 80);
   doc.text(splitAddress, leftMargin, y);
   y += splitAddress.length * 6;

   doc.text(`${lastQuotationpdf.quotationDate}`, leftMargin, y);


   const tableColumn = [
     "Project Cost", "Product Cost", "Total Without Installation Charges",
     "Additional Installation Charges", "General Installation Charges", "Grand Total"
   ];



   const formatCurrency = (num) =>
     Number(num).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

   const tableRows = [
     [
       formatCurrency(lastQuotationpdf.totalProjectCost),
       formatCurrency(lastQuotationpdf.totalProductsCost),
       formatCurrency(lastQuotationpdf.totalBeforeInstallation),
       formatCurrency(lastQuotationpdf.additionalInstallationCharges),
       formatCurrency(lastQuotationpdf.generalInstallationCharges),
       formatCurrency(lastQuotationpdf.grandTotal)
     ]
   ];

   autoTable(doc, {
     startY: 115,
     head: [tableColumn],
     body: tableRows,
     styles: {
       font: 'helvetica',
       fontSize: 9,
       cellPadding: 3,
       overflow: 'linebreak',
     },
     headStyles: {
       fillColor: [238, 128, 26], // #ee801a
       textColor: [255, 255, 255], // white text
       fontStyle: 'bold',
     },
     alternateRowStyles: {
       fillColor: [240, 240, 240],
     },
     margin: { top: 30 },
   });

   // Footer

   const pageHeight = doc.internal.pageSize.getHeight();

   const footerY = pageHeight - 20; // 20mm from bottom (adjust as needed)

   // Draw left text
   doc.setFontSize(10);
   doc.setTextColor(50);
   doc.setFont("helvetica", "normal");
   doc.text("Home Automation | AV Solutions", 14, footerY);

   // Draw right orange rectangle
   const rectWidth = 80; // Adjust width
   const rectHeight = 10;
   const rectX = pageWidth - rectWidth - 14; // 14mm padding from right
   const rectY = footerY - rectHeight + 2; // Align with text vertically

   doc.setFillColor(235, 112, 23); // Orange color (adjust if needed)
   doc.rect(rectX, rectY, rectWidth, rectHeight, "F");



   // Save file
   const clientName = lastQuotationpdf.client.replace(/\s+/g, "_");
   doc.save(`Invoice_${clientName}.pdf`);


    // pdf

    // Reset states
    setMAPRooms([{ rooms: "", lights: 0, module: 0 }]);

    // Update grandTotal state and show modal

    // setQuotationsTotal(totals.grandTotal+totalProjectCost);
    console.log("All clients Data with products, projects and totals: ", newQuotations);

  };

  // Show All Quotations Table
  // Show All Quotations Table
  // Show All Quotations Table
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

  const navigate = useNavigate();
  const handleEdit = (id) => {
    // open edit modal or navigate to edit page
    console.log("Edit", id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Invoice?")) {
      // remove the item from state or make API call
      console.log("Delete", id);
    }
  };



  return (
    <>
      {ShowEntryQuotation ? (
        <div className="quotation-wrapper">
          <div>
            <button onClick={() => setShowEntryQuotation(false)} className='submit'>Show All Invoice</button>
            <ToastContainer position="bottom-center" autoClose={3000} />
          </div>
          <div>
            <form className="form-horizontal" >
              <h2 className="form-title">Client Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Property Type</label>
                  <select name="propertyType" value={formData.propertyType} onChange={handleChange}>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Client Name</label>
                  <input type="text" name="client" value={formData.client} onChange={handleChange} />
                  {errors.client && <span className="error">{errors.client}</span>}
                </div>
                <div className="form-group">
                  <label>Mobile</label>
                  <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} maxLength={10} />
                  {errors.mobile && <span className="error">{errors.mobile}</span>}
                </div>
                <div className="form-group">
                  <label>Quotation Date</label>
                  <input type="date" name="quotationDate" value={formData.quotationDate} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group full-width">
                <label>Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} />
                {errors.address && <span className="error">{errors.address}</span>}
              </div>

            </form>

          </div>
          <div className="quotation-container" ref={quotationRef}>
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
                    {MAPRooms.map((item, rowIndex) => (
                      <tr key={rowIndex}>
                        {fieldNames.map((field, i) => (
                          <td key={i}>
                            <input
                              type={textFields.has(field) ? 'text' : 'number'}
                              min={0}
                              value={
                                field === 'Total'
                                  ? item.Total || calculateRowTotal(item)
                                  : field === 'BackModule'
                                    ? item.BackModule || calculateBackModule(item)
                                    : field === 'FrontplateSelected'
                                      ? item.FrontplateSelected || calculateFrontPlate(item)
                                      : item[field] || ''
                              }
                              readOnly={['Total', 'BackModule', 'FrontplateSelected'].includes(field)} // prevent editing calculated fields
                              onChange={(e) => {
                                const newItems = [...MAPRooms];
                                const newValue = textFields.has(field)
                                  ? e.target.value
                                  : parseFloat(e.target.value) || 0;
                                newItems[rowIndex][field] = newValue;
                                // Update calculated fields inside the item object
                                newItems[rowIndex].BackModule = calculateBackModule(newItems[rowIndex]);
                                newItems[rowIndex].FrontplateSelected = calculateFrontPlate(newItems[rowIndex]);
                                newItems[rowIndex].Total = calculateRowTotal(newItems[rowIndex]);
                                setMAPRooms(newItems);
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="summary">
              <p style={{ textAlign: "left", padding: "20px" }}>Total Project Cost: ₹ {totalProjectCost.toFixed(2)}</p>

            </div>
            {/* second table */}
            {/* second table */}
            {/* second table */}
            <br />
            <Iproducts onSubmit={handleQuotationSubmit} totalProjectCost={totalProjectCost} />
          </div>
        </div>
      ) :
        <>
          <div className="quotation-wrapper">
            <div className="showQuotationsHeading">
              <button onClick={() => setShowEntryQuotation(true)} className='submit'>Add New Invoice</button>
              <h1>All Invoice </h1>
            </div>
            <div className='allQuotations'>
              <table>
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Client Name</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Replace with dynamic rows */}
                  {Allinvoice.map((q) => (
                    <tr
                      key={q.id}
                      onClick={() => navigate(`/invoice/${q.id}`)}
                      className="clickable-row"
                    >
                      <td>{q.id}</td>
                      <td>{q.clientName}</td>
                      <td>{q.date}</td>
                      <td>{q.amount}</td>
                      <td>{q.status}</td>
                      <td>
                        <button onClick={() => handleEdit(q.id)} className="action-btn edit">
                          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                            fill="#1f1f1f"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(q.id)} className="action-btn delete">
                          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                            fill="#1f1f1f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                          </svg></button>
                      </td>
                    </tr>
                  ))}
                  {/* More rows */}
                </tbody>
              </table>
            </div>

          </div>
        </>
      }
    </>
  );
};

export default Invoice;