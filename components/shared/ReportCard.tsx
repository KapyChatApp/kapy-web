"use client";
import { CreateReportDTO } from "@/lib/DTO/report";
import { createReport } from "@/lib/services/report";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "@/hooks/use-toast";
const categorizedReportOptions = [
  {
    category: "CRIMINAL BEHAVIOR AND VIOLENCE",
    options: [
      "Criminal behavior and violence",
      "Collusion to cause harm and incite crimes",
      "Dangerous individuals and organizations"
    ]
  },
  {
    category: "SAFETY",
    options: [
      "Fraud, deception, and scams",
      "Restricted goods and services",
      "Violence and incitement"
    ]
  },
  {
    category: "OBJECTIONABLE CONTENT",
    options: [
      "Objectionable content",
      "Sexual activities and adult nudity",
      "Sexual solicitation and explicit language"
    ]
  },
  {
    category: "INTEGRITY AND AUTHENTICITY",
    options: [
      "Account integrity",
      "Commitment to real identity",
      "Cybersecurity"
    ]
  },
  {
    category: "RESPECT FOR INTELLECTUAL PROPERTY RIGHTS",
    options: [
      "Violation of third-party intellectual property rights",
      "Use of Meta's intellectual property and licenses"
    ]
  },
  {
    category: "CONTENT-RELATED REQUESTS AND DECISIONS",
    options: ["User requests", "Misinformation", "Spam"]
  }
];
//Post Message Comment User
const ReportCard = ({
  onClose,
  type,
  reportedId
}: {
  onClose: () => void;
  type: string;
  reportedId: string;
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    console.log(token, "tokennn");
    const userId = localStorage.getItem("userId");
    if (!token) {
      setError("Authentication is required");
      return;
    }

    try {
      const reportPayload: CreateReportDTO = {
        title: "Report Details",
        content: selectedOption,
        targetId: reportedId || "",
        targetType: type
      };
      const res = await createReport(reportPayload);
      toast({
        title: `Send Report Successfully`,
        className:
          "border-none rounded-lg bg-primary-200 text-primary-500 paragraph-regular items-center justify-center "
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error creating repost");
      toast({
        title: `Error in sending report`,
        description: err instanceof Error ? err.message : "Unknown error",
        className:
          "border-none rounded-lg bg-accent-red text-light-900 paragraph-regular items-center justify-center "
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 background-light900_dark100 opacity-20"
        onClick={onClose}
      ></div>

      <div className="no-scrollbar background-light900_dark200 text-dark100_light900 relative z-10 h-[80vh] w-[50vw] overflow-y-auto shadow-lg md:w-[30vw] rounded-lg ">
        <div className="flex size-full flex-col">
          <div className="flex items-center justify-between px-4 py-2 pl-0">
            <span className="rounded-lg rounded-l-none p-2 px-4 text-center text-sm md:text-base">
              Details
            </span>
            <Icon
              icon="iconoir:cancel"
              width={24}
              height={24}
              className="mb-2 cursor-pointer text-dark100_light900"
              onClick={onClose}
            />
          </div>

          {/* Danh sách nội dung */}
          <div className="px-4 py-2">
            {categorizedReportOptions.map((category, catIndex) => (
              <div key={catIndex} className="mb-4">
                {/* Tiêu đề mục lớn */}
                <h3 className="text-sm font-bold text-primary-500 md:text-base">
                  {category.category}
                </h3>

                {/* Các tùy chọn bên trong */}
                {category.options.map((option, optIndex) => (
                  <label
                    key={optIndex}
                    className="flex items-center gap-2 py-1 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="reportOption"
                      value={option}
                      checked={selectedOption === option}
                      onChange={() => setSelectedOption(option)} // Lưu giá trị đã chọn vào state
                      className="cursor-pointer"
                    />
                    <span className="text-sm md:text-base">{option}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>

          {/* Nút xác nhận */}
          <div className="text-dark100_light500 flex items-center justify-between gap-4 px-8 py-4">
            <Button
              onClick={onClose}
              className="h-[35px] w-32 background-light700_dark400 text-xs shadow-md md:text-sm hover:background-light700_dark400 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit} // Truyền giá trị đã chọn
              disabled={!selectedOption} // Vô hiệu hóa nếu chưa chọn mục
              className="h-[35px] w-32 bg-primary-500 text-xs text-light-900 shadow-md md:text-sm hover:bg-primary-500 rounded-lg"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
