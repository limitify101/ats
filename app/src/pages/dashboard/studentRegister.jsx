import React, { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Input,
  Button,
  Select,
  Option,
  Menu,
  MenuHandler,
  MenuList,
  Tooltip,
  MenuItem,
  IconButton
} from "@material-tailwind/react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { StatisticsCard } from '@/widgets/cards';
import {
  UsersIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  XCircleIcon,
  MinusCircleIcon
} from '@heroicons/react/24/solid';
import { UserCircleIcon, UserMinusIcon } from '@heroicons/react/24/outline';
import { useStudentsData } from '@/data';
import { handleAssignCards, handleFileUpload } from '@/utils/ApiUtils';
import { useAuth } from '@/context/AuthContext';

export function StudentRegister() {
  const {
    students,
    activeStudents,
    unassignedStudents,
  } = useStudentsData();
  const { currentUser } = useAuth();

  const [form, setForm] = useState({
    studentID: 'STD-',
    studentName: '',
    gender: '',
    grade: '',
    contact: '',
  });
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.gender)
      try {
        const response = await axios.post("/api/v1/student/create", form, {
          headers: {
            'x-tenant-id': `${currentUser.id}`
          }
        });
        toast(response.data.msg, { type: "success" });
      } catch (error) {
        toast(error.response.data.error, { type: "error" });
      }
    else {
      toast("Fill out all required fields", { type: "error" });
    }
  };
  function handleDownloadTemplate() {
    fetch('/student/download-template') // Replace with your backend URL
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
        a.download = 'Student_Template.csv'; // Set the file name for download
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Error downloading the template:', error);
      });
  }
  const studentOperations = async (status, card, studentID) => {
    if (card && status === "active") {
      try {
        const response = await axios.delete(`/api/v1/student/delete/${studentID}`, {
          headers: {
            "x-tenant-id": `${currentUser.id}`
          }
        });
        if (response.status === 201) {
          toast("Student terminated successfully", { type: "success" });
        } else {
          toast("Failed to terminate student", { type: "warning" });
        }
      } catch (error) {
        toast(error.response?.data?.message || "Error occurred while assigning student", { type: "error" });
      }
    } else if (!card && status === "active") {
      try {
        const response = await axios.post(`/api/v1/rfid/assign-single/${studentID}`, {}, {
          headers: {
            "x-tenant-id": `${currentUser.id}`
          }
        });
        if (response.status === 201) {
          toast("Student assigned successfully", { type: "success" });
        } else {
          toast(response.data.msg, { type: "warning" });
        }
      } catch (error) {
        toast(error.response?.data?.message || "Error occurred while assigning student", { type: "error" });
      }
    }
    else {
      try {
        const response = await axios.delete(`/api/v1/student/delete/${studentID}`, {
          headers: {
            "x-tenant-id": `${currentUser.id}`
          }
        });
        if (response.status === 201) {
          toast("Student terminated successfully", { type: "success" });
        } else {
          toast("Failed to terminate student", { type: "warning" });
        }
      } catch (error) {
        toast(error.response?.data?.message || "Error occurred while assigning student", { type: "error" });
      }
    }
  }
  return (
    <div className='mt-12 mb-8 flex flex-col gap-12'>
      <div className="mb-5 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        <StatisticsCard
          key={1}
          color='teal'
          title="Active Students"
          value={activeStudents ? activeStudents : 0}
          icon={<UsersIcon className="w-6 h-6 text-white" />}
          footer={
            <Typography className="font-normal text-blue-gray-600">
              recent update
            </Typography>
          }
        />
        <StatisticsCard
          key={2}
          color='blue-gray'
          title="Unassigned Students"
          value={unassignedStudents ? unassignedStudents : 0}
          icon={<UserCircleIcon className="w-6 h-6 text-white" />}
          footer={
            <div className='w-full flex justify-between items-center'>
              <Typography className="font-normal text-blue-gray-600">
                updated 2hrs ago
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
                  <MenuItem onClick={() => handleAssignCards(currentUser.id)}>Assign All</MenuItem>
                </MenuList>
              </Menu>
            </div>
          }
        />
        <StatisticsCard
          key={3}
          color='deep-orange'
          title="Ineligible Students"
          value={(students) ? students.length - activeStudents : 0}
          icon={<UserMinusIcon className="w-6 h-6 text-white" />}
          footer={
            <Typography className="font-normal text-blue-gray-600">
              recent update
            </Typography>
          }
        />
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-1 xl:grid-cols-2">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Student Registration
              </Typography>
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Student ID"
                name="studentID"
                value={form.studentID}
                onChange={handleChange}
                required
              />
              <Input
                label="Student Name"
                name="studentName"
                value={form.studentName}
                onChange={handleChange}
                required
              />
              <Select label="Gender" name="gender" value={form.gender} onChange={(value) => setForm({ ...form, gender: value })}>
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
              </Select>
              <Input
                label="Grade"
                name="grade"
                value={form.grade}
                onChange={handleChange}
                required
              />
              <Input
                label="Contact"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                required
              />
              <div className='w-full flex items-center justify-center'><Button type="submit" color="light-blue" className='max-w-sm'>Register Student</Button></div>
            </form>
          </CardBody>
        </Card>
        {/* <div className="flex items-center justify-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div> */}
        <div className="w-full max-w-sm mx-auto flex flex-col items-start gap-4">
          <Typography variant="h6" className="text-sm font-semibold font-['Nunito']">Import students (CSV Format)</Typography>
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
            <Button color="light-blue" onClick={() => handleFileUpload("student/upload", currentUser.id, file)} disabled={!file}>
              Upload
            </Button>
            <Button color="blue-gray" onClick={handleDownloadTemplate()} variant='outlined'>
              Download Template
            </Button>
          </div>
        </div>
      </div>
      <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6"
        >
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-1">
              Students Overview
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <strong>{students?.length}</strong> registered students
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
              <MenuItem>Edit</MenuItem>
              <MenuItem>Print PDF</MenuItem>
            </MenuList>
          </Menu> */}
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 max-h-96">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {['Student ID', 'Student Name', 'Class', 'Assigned', 'Actions'].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(students) && students.map((student, key) => {

                const className = `py-3 px-5 ${key === students.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                return (
                  <tr key={student.studentID} >
                    <td className={className}>
                      <Typography variant="small">{student.studentID}</Typography>
                    </td>
                    <td className={className}>
                      <Typography variant="small">{student.studentName}</Typography>
                    </td>
                    <td className={className}>
                      <Typography variant="small">{student.grade}</Typography>
                    </td>
                    <td className={className}>
                      {student.rfidCard ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        student.status === "active" ? (<MinusCircleIcon className="h-5 w-5 text-gray-500" />) : (<XCircleIcon className="h-5 w-5 text-red-500" />)
                      )}
                    </td>
                    <td className={className}>
                      <Button
                        size="sm"
                        variant="outlined"
                        color={student.rfidCard ? 'blue-gray' : student.status === "active" ? "green" : "red"}
                        onClick={() => studentOperations(student.status, student.rfidCard, student.studentID)}
                      >
                        {student.rfidCard ? "Terminate" : student.status === "active" ? "assign" : "remove"}
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
}

export default StudentRegister;
