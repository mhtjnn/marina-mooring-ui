import React, { useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { FiMinus } from "react-icons/fi";
import { FaCalendar } from "react-icons/fa";
import { BsFileCheckFill } from "react-icons/bs";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import StatCard from "../StatCard/StatCard";

const Accordion = () => {
  const [accordion, setAccordion] = useState("faq1");
  const [billsData, setBillsData] = useState([
    {
      workOrderNo: "B0210",
      customerName: "Suncatcher",
      assignedTo: "John Smith",
      date: "15, March 2024",
    },
    {
      workOrderNo: "B0210",
      customerName: "Suncatcher",
      assignedTo: "John Smith",
      date: "15, March 2024",
    },
    {
      workOrderNo: "B0210",
      customerName: "Suncatcher",
      assignedTo: "John Smith",
      date: "15, March 2024",
    },
    {
      workOrderNo: "B0210",
      customerName: "Suncatcher",
      assignedTo: "John Smith",
      date: "15, March 2024",
    },
  ]);

  const statCardsData = [
    [
      { title: "Total Customers", percentage: 17, count: 42324 },
      { title: "Total Customers", percentage: 17, count: 43324 },
      { title: "Total Customers", percentage: 17, count: 44324 },
      { title: "Total Customers", percentage: 17, count: 58765 },
      { title: "Total Customers", percentage: 17, count: 42324 },
      { title: "Total Customers", percentage: 17, count: 46789 },
    ],
  ];

  const handleToggle = (id: string) => {
    setAccordion((prevState) => (prevState === id ? "" : id));
  };

  return (
    <div className="wrapper">
      <div className="tab px-4 py-2 bg-[#F8F8F8] border-[1px] border-[#D1D1D1] relative mb-8 rounded-md w-[34vw]">
        <label
          htmlFor="faq1"
          className="flex items-center cursor-pointer font-semibold text-lg after:absolute after:right-5 after:text-2xl after:text-gray-400 hover:after:text-gray-950 peer-checked:after:transform peer-checked:after:rotate-45 h-10"
          onClick={() => handleToggle("faq1")}
        >
          <div className="flex mt-3 gap-2 p-1">
            <div className="mt-[0.30rem]">
              <FaCalendar style={{ fontSize: "1rem" }} />
            </div>

            <div>
              <h1 className="w-40">Calendar</h1>
            </div>

            <div className="ml-[20rem] mt-1">
              {accordion === "faq1" ? <FiMinus /> : <IoAddOutline />}
            </div>
          </div>
        </label>
        <div
          className={`content mt-5 transition-all ease-in-out duration-500 overflow-hidden ${
            accordion === "faq1" ? "" : "hidden"
          }`}
        >
          helllooo
        </div>
      </div>
      <div className="tab px-5 relative mb-4 rounded-md  bg-white border-[1px] border-[#D1D1D1]   w-[34vw]">
        <label
          htmlFor="faq2"
          className=" cursor-pointer   flex text-center after:absolute peer-checked:after:transform peer-checked:after:rotate-45 h-14"
          onClick={() => handleToggle("faq2")}
        >
          <div className="flex mt-3 gap-2 p-1">
            <div className="mt-1">
              <BsFileCheckFill style={{ fontSize: "1rem" }} />
            </div>
            <div>
              <h1 className="w-40 text-black font-extrabold">
                Open Work Orders
              </h1>
            </div>
            <div className="ml-[20rem] mt-1">
              {accordion === "faq2" ? <FiMinus /> : <IoAddOutline />}
            </div>
          </div>
        </label>
        <label
          htmlFor="faq3"
          className={`content mt-5 transition-all ease-in-out duration-500 overflow-hidden ${
            accordion === "faq2" ? "" : "hidden"
          }`}
        >
          <div className="">
            <DataTable
              value={billsData}
              header={""}
              tableStyle={{
                fontSize: "0.60rem",
                fontWeight: "bold",
              }}
              scrollable={true}
            >
              <Column
                style={{ width: "7vw" }}
                field="workOrderNo"
                header="Order "
              ></Column>
              <Column
                style={{ width: "7vw" }}
                field="workOrderNo"
                header="Mooring ID"
              ></Column>
              <Column
                style={{ width: "8vw" }}
                field="customerName"
                header="Customer Name"
              ></Column>
              <Column
                style={{ width: "8vw" }}
                field="assignedTo"
                header="Assigned To"
              ></Column>
              <Column
                style={{ width: "7vw" }}
                field="date"
                header="Date"
              ></Column>

              <Column
                header=""
                body={() => (
                  <div className="flex gap-4">
                    <span className="text-black underline cursor-pointer">
                      View
                    </span>
                  </div>
                )}
              ></Column>
            </DataTable>
          </div>
        </label>
      </div>

      <div className="tab px-5 py-2 bg-white border-[1px] border-[#D1D1D1] relative mb-2 rounded-md w-[34vw]">
        <label
          htmlFor="faq3"
          className="cursor-pointer font-semibold text-lg after:absolute after:right-5 after:text-2xl after:text-gray-400 hover:after:text-gray-950 peer-checked:after:transform peer-checked:after:rotate-45 h-8"
          onClick={() => handleToggle("faq3")}
        >
          <div className="flex mt-3 gap-2 p-1">
            <span className="">
              <img alt="icon" src="/assets/images/ship.png" style={{ width: "23px" }} />
            </span>

            <div>
              <h1 className="w-44 ">Total Moorings</h1>
            </div>

            <div className="ml-[18.50rem]">
              {accordion === "faq3" ? <FiMinus /> : <IoAddOutline />}
            </div>
          </div>
        </label>
        <div
          className={`content mt-5 transition-all ease-in-out duration-500 overflow-hidden ${
            accordion === "faq3" ? "" : "hidden"
          }`}
        >
          <div>
            {statCardsData.map((items) => (
              <StatCard key={items[0].title} items={items} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
