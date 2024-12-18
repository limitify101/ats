import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
  IconButton,
  Tooltip,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from '@material-tailwind/react';
import { CheckCircleIcon, XCircleIcon, CpuChipIcon, CreditCardIcon, MinusCircleIcon } from '@heroicons/react/24/solid';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { StatisticsCard } from '@/widgets/cards';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from "@/context/AuthContext";
import { useRfidData } from '@/data';
import { handleAssignCards, handleFileUpload } from '@/utils/ApiUtils';
import Processing from '@/components/Processing';

function RFID() {
  const {
    rfidCards,
    activeCards,
    unassignedCards
  } = useRfidData();

  // Sample data and state for RFID management
  const { currentUser } = useAuth();
  const [corsOrigin, setCorsOrigin] = useState("");
  const [newRFID, setNewRFID] = useState("");
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null);


  const handleFileChange = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
  };

  const handleAddCorsOrigin = () => {
    // Handle CORS origin logic
  };
  function handleDownloadTemplate() {
    fetch(`${import.meta.env.APP_URL}/card/download-template`) // Replace with your backend URL
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to download template');
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'Card_Template.csv'; // Set the file name for download
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Error downloading the template:', error);
      });
  }

  const handleRegisterRFID = async () => {
    if (newRFID !== "") {
      try {

        const response = await axios.post("/api/v1/rfid/set", { rfid_ID: newRFID }, {
          headers: {
            'x-tenant-id': `${currentUser.id}`
          }
        });

        setNewRFID("");
        toast(response.data.msg, { type: "success" });
      } catch (error) {
        toast(error.response.data.error, { type: "error" });
      }
    }
  };

  const handleRFID = async (id, active, student) => {
    if (id && active) {
      try {

        const response = await axios.post(`/api/v1/rfid/deactivate/${id}`, {}, {
          headers: {
            "x-tenant-id": `${currentUser.id}`
          }
        });

        if (response.status === 201) {
          toast("Card deactivated successfully", { type: "success" });
        } else {
          toast("Failed to deactivate card", { type: "warning" });
        }

      } catch (error) {
        toast(error.response?.data?.message || "Error occurred while deactivating card", { type: "error" });
      }
    }
    else if (!active && student) {
      try {

        const response = await axios.post(`/api/v1/rfid/activate/${id}`, {}, {
          headers: {
            "x-tenant-id": `${currentUser.id}`
          }
        });

        if (response.status === 201) {
          toast("Card activated successfully", { type: "success" });
        } else {
          toast("Failed to activate card", { type: "warning" });
        }
      } catch (error) {
        toast(error.response?.data?.message || "Error occurred while activating card", { type: "error" });
      }
    }
    else if (!student) {
      try {

        const response = await axios.delete(`/api/v1/rfid/delete/${id}`, {
          headers: {
            "x-tenant-id": `${currentUser.id}`
          }
        });

        if (response.status === 201) {
          toast("Card deleted successfully", { type: "success" });
        } else {
          toast("Failed to delete card", { type: "warning" });
        }
      } catch (error) {
        toast(error.response?.data?.message || "Error occurred while deleting card", { type: "error" });
      }
    }
  };
  if (loading) {
    return <Processing />
  }
  return (
    <div className="mt-12">
      <div className="mb-5 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        <StatisticsCard
          key={1}
          color='teal'
          title="Active Cards"
          value={activeCards}
          icon={<CpuChipIcon className="w-6 h-6 text-white" />}
          footer={
            <Typography className="font-normal text-blue-gray-600">
              recent update
            </Typography>
          }
        />
        <StatisticsCard
          key={2}
          color='blue-gray'
          title="Unassigned Cards"
          value={unassignedCards}
          icon={<CreditCardIcon className="w-6 h-6 text-white" />}
          footer={
            <div className='w-full flex justify-between items-center'>
              <Typography className="font-normal text-blue-gray-600">
                recent update
              </Typography>
              <Menu placement="left-start">
                <MenuHandler>
                  <IconButton size="sm" variant="text" color="blue-gray">
                    <EllipsisVerticalIcon
                      strokeWidth={3}
                      fill="currenColor"
                      className="h-6 w-6"
                    />
                  </IconButton>
                </MenuHandler>
                <MenuList>
                  <MenuItem onClick={async () => {
                    try {
                      setLoading(true)
                      await handleAssignCards(currentUser.id)
                      setLoading(false)
                    } catch (error) {
                      throw error
                    }
                  }}>Assign All</MenuItem>
                </MenuList>
              </Menu>
            </div>
          }
        />
      </div>
      {/* CORS Settings Section */}
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-1 xl:grid-cols-2">
        {/* <Card>
        <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 flex items-center justify-between p-6"
            >
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-1">
                  Allowed CORS Settings
                </Typography>
              </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                label="Allowed CORS Origin"
                value={corsOrigin}
                onChange={(e) => setCorsOrigin(e.target.value)}
                placeholder="https://example.com"
              />
              <Button color="light-blue" onClick={handleAddCorsOrigin} className='min-w-32'>
                Add Origin
              </Button>
            </div>
            <div>
              <p className='font-light font-["Nunito"] text-sm italic text-orange-400'>
              " The Allowed CORS Origin setting specifies which external domains or sources are permitted to make requests to this application's API."
              </p>
            </div>
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Allowed CORS Origins
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600 opacity-50"
              >
                e.g. {"http://192.168.34:3000/"}
              </Typography>
            </div>
          </CardBody>
        </Card> */}
        <Card>
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Card Management
              </Typography>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4">
              {/* Register New Card */}
              <div className="flex-1 space-y-4">
                <Typography variant="h6" className="mb-4 font-semibold font-['Nunito']">
                  Register New Card
                </Typography>
                <Input
                  label="Card ID"
                  value={newRFID}
                  onChange={(e) => setNewRFID(e.target.value)}
                  placeholder="Enter Card ID"
                />
                <Button color="light-blue" onClick={handleRegisterRFID}>
                  Register Card
                </Button>
              </div>

              {/* Deactivate Cards */}
              <div className="w-full max-w-sm flex flex-col items-start gap-4">
                <Typography variant="h6" className="text-sm font-semibold font-['Nunito']">Import cards (CSV Format)</Typography>
                <label className="w-full">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-input"
                  />
                  <Input
                    label='Select File'
                    variant="outlined"
                    placeholder="example.csv"
                    value={file ? file.name : ""}
                    readOnly
                    onClick={() => document.getElementById("file-input").click()}
                  />
                </label>
                <div className='w-full flex items-center gap-2'>
                  <Button color="light-blue" onClick={() => handleFileUpload("rfid/upload", currentUser.id, file)} disabled={!file}>
                    Upload
                  </Button>
                  <Button color="blue-gray" onClick={() => handleDownloadTemplate()} variant='outlined'>
                    Download Template
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* RFID Cards Section */}
      <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6"
        >
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-1">
              Cards Overview
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <strong>{rfidCards?.length}</strong> registered cards
            </Typography>
          </div>
          {/* <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>Assign</MenuItem>
                <MenuItem>Print PDF</MenuItem>
              </MenuList>
            </Menu> */}
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 max-h-96">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {['RFID ID', 'Assigned To', 'Class', 'Status', 'Actions'].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(rfidCards) && rfidCards.map((card, key) => {

                const className = `py-3 px-5 ${key === rfidCards.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                return (
                  <tr key={card.rfid_ID} >
                    <td className={className}>
                      <Typography variant="small">{card.rfid_ID}</Typography>
                    </td>
                    <td className={className}>
                      <Typography variant="small">{card.assignedTo !== null ? card.assignedTo : 'N/A'}</Typography>
                    </td>
                    <td className={className}>
                      <Typography variant="small">{card.student ? card.student.grade : 'N/A'}</Typography>
                    </td>
                    <td className={className}>
                      {card.activated ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) :
                        (<XCircleIcon className="h-5 w-5 text-red-500" />)
                      }
                    </td>
                    <td className={`${className} `}>
                      <Button
                        size="sm"
                        variant="outlined"
                        color={card.activated ? 'amber' : (card.student ? ('green') : ('red'))}
                        onClick={() => handleRFID(card.rfid_ID, card.activated, card.student)}

                      >
                        {card.activated ? "Deactivate" : (
                          (card.student ? ("Activate") : ("Remove"))
                        )}
                      </Button>
                    </td>
                  </tr>
                )
              })}

            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default RFID;
