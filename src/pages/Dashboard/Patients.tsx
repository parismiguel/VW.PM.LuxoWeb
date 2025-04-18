import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import endpoints from "../../services/endpoints";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/ui/table";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Alert from "../../components/ui/alert/Alert";
import "./Patients.css";
import Button from "../../components/ui/button/Button";
import { GridIcon } from "../../icons";

type Patient = {
  id: number;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  contact: string;
  type: string;
  status: string;
  local: string;
  location: string;
  chartNumber: string;
};

// Helper function to calculate age
const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

// Helper function to format date as MM/DD/yyyy
const formatDate = (dob: string): string => {
  const date = new Date(dob);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export default function Patients() {
  const [data, setData] = useState<Patient[]>([]);
  const [page, setPage] = useState(1);
  const [nameSearch, setNameSearch] = useState(""); // Input for name search
  const [chartNumberSearch, setChartNumberSearch] = useState(""); // Input for chart number search
  const [searchQuery, setSearchQuery] = useState<{
    name?: string;
    chartNumber?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
  } | null>(null);

  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null); // Track which dropdown is open

  const fetchPatients = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(endpoints.patients, {
        params: {
          page,
          limit: 10,
          ...searchQuery,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setAlert({
        variant: "error",
        title: "Error",
        message: "Failed to fetch patients. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchPatients();
  }, [page, fetchPatients]);

  const handleSearch = () => {
    setAlert(null);
    setSearchQuery({
      name: nameSearch || undefined,
      chartNumber: chartNumberSearch || undefined,
    });
  };

  const handlePatientClick = (patient: Patient) => {
    setAlert({
      variant: "info",
      title: "Patient Clicked",
      message: `You clicked on ${patient.lastName}, ${patient.firstName}.`,
    });
  };

  const handleActionChange = (action: string, patientName: string) => {
    setAlert({
      variant: "info",
      title: `Action: ${action}`,
      message: `Performed ${action} for ${patientName}.`,
    });
    setOpenDropdownId(null);
  };

  const renderDropdownItems = (
    patient: Patient,
    handleActionChange: (action: string, patientName: string) => void
  ) => {
    const actions = [
      { label: "Appointment", action: "appointment" },
      { label: "Eligibility/Authorization", action: "eligibility" },
      { label: "Prescription Order", action: "prescription" },
      { label: "Invoice", action: "invoice" },
      { label: "Launch Questionnaire", action: "questionnaire" },
    ];

    return actions.map(({ label, action }) => (
      <DropdownItem
        key={action}
        onItemClick={() =>
          handleActionChange(
            action,
            `${patient.lastName}, ${patient.firstName}`
          )
        }
        className='flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300'
      >
        {label}
      </DropdownItem>
    ));
  };

  const handleReset = () => {
    setAlert(null);
    setNameSearch("");
    setChartNumberSearch("");
    setSearchQuery({});
  };

  return (
    <>
      <PageMeta
        title='Patient Management'
        description='A paginated table of patients.'
      />
      <PageBreadcrumb pageTitle='Patients' />
      <div className='space-y-6'>
        <div className='rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
          <div className='p-5'>
            <div className='search-container'>
              <input
                type='text'
                placeholder='Search by name'
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                className='search-input'
              />
              <input
                type='text'
                placeholder='Search by Chart Number'
                value={chartNumberSearch}
                onChange={(e) => setChartNumberSearch(e.target.value)}
                className='search-input ml-2'
              />
              <button onClick={handleReset} className='reset-button ml-2'>
                Reset
              </button>
              <button onClick={handleSearch} className='search-button'>
                Search
              </button>
            </div>

            {/* Display Alert */}
            {alert && (
              <div className='mb-4'>
                <Alert
                  variant={alert.variant}
                  title={alert.title}
                  message={alert.message}
                />
              </div>
            )}

            {loading ? (
              <div className='loading-container'>
                <div className='loader'></div>
                <p className='loading-text'>Loading...</p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <Table className='patients-table'>
                  <TableHeader className='bg-gray-50 dark:bg-gray-800'>
                    <TableRow>
                      <TableCell
                        isHeader
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Patient
                      </TableCell>
                      <TableCell
                        isHeader
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Date of Birth
                      </TableCell>
                      <TableCell
                        isHeader
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Primary Contact
                      </TableCell>
                      <TableCell
                        isHeader
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Type
                      </TableCell>
                      <TableCell
                        isHeader
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Status
                      </TableCell>
                      <TableCell
                        isHeader
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <button
                            onClick={() => handlePatientClick(patient)}
                            className='text-blue-500 hover:underline'
                            title={`Contact ID: ${patient.id}`}
                          >
                            {`${patient.lastName}, ${
                              patient.firstName
                            } (${calculateAge(patient.dob)}/${patient.gender
                              .charAt(0)
                              .toUpperCase()})`}
                          </button>
                        </TableCell>
                        <TableCell>{formatDate(patient.dob)}</TableCell>
                        <TableCell>{patient.contact}</TableCell>
                        <TableCell>{patient.type}</TableCell>
                        <TableCell>{patient.status}</TableCell>
                        <TableCell>
                          <div className='relative inline-block'>
                            <Button
                              size='md'
                              onClick={() =>
                                setOpenDropdownId(
                                  openDropdownId === patient.id
                                    ? null
                                    : patient.id
                                )
                              }
                            >
                              <GridIcon />
                            </Button>

                            <Dropdown
                              isOpen={openDropdownId === patient.id}
                              onClose={() => setOpenDropdownId(null)}
                              className='w-40 p-2'
                            >
                              {renderDropdownItems(patient, handleActionChange)}
                            </Dropdown>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <div className='pagination-container'>
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className='pagination-button'
              >
                Previous
              </button>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className='pagination-button'
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
