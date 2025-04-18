import {
    useReactTable,
    createColumnHelper,
    getCoreRowModel,
  } from "@tanstack/react-table";
  import PageMeta from "../../components/common/PageMeta";
  import PageBreadcrumb from "../../components/common/PageBreadCrumb";
  import { MoreDotIcon } from "../../icons";
  
  // Define a type for the patient data
  type Patient = {
    id: number;
    patient: string;
    dob: string;
    contact: string;
    type: string;
    status: string;
    local: string;
    location: string;
  };
  
  const data: Patient[] = [
    {
      id: 1,
      patient: "John Doe",
      dob: "1990-01-01",
      contact: "Email",
      type: "New",
      status: "Active",
      local: "Yes",
      location: "New York",
    },
    {
      id: 2,
      patient: "Jane Smith",
      dob: "1985-05-15",
      contact: "Phone",
      type: "Returning",
      status: "Inactive",
      local: "No",
      location: "Los Angeles",
    },
    // Add more rows as needed
  ];
  
  const columnHelper = createColumnHelper<Patient>();
  
  const columns = [
    columnHelper.accessor("patient", {
      header: "Patient",
    }),
    columnHelper.accessor("dob", {
      header: "Date of Birth",
    }),
    columnHelper.accessor("contact", {
      header: "Primary Contact Method",
    }),
    columnHelper.accessor("type", {
      header: "Type",
    }),
    columnHelper.accessor("status", {
      header: "Status",
    }),
    columnHelper.accessor("local", {
      header: "Local",
    }),
    columnHelper.accessor("location", {
      header: "Preferred Location",
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: () => (
        <div className="relative">
          <button className="dropdown-toggle" title="More actions">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <ul className="py-1">
              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                Appointment
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                Eligibility/Authorization
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                Prescription Order
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                Invoice
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                Launch Questionnaire
              </li>
            </ul>
          </div>
        </div>
      ),
    }),
  ];
  
  export default function Patients() {
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });
  
    return (
      <>
        <PageMeta
          title="Patient Management"
          description="A paginated table of patients."
        />
        <PageBreadcrumb pageTitle="Patients" />
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Patients
            </h3>
            <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-800">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="border border-gray-200 px-4 py-2 text-left dark:border-gray-800"
                      >
                        {header.isPlaceholder
                          ? null
                          : typeof header.column.columnDef.header === "function"
                          ? header.column.columnDef.header(header.getContext())
                          : header.column.columnDef.header}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="border border-gray-200 px-4 py-2 dark:border-gray-800"
                      >
                        {cell.renderValue() as React.ReactNode}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }