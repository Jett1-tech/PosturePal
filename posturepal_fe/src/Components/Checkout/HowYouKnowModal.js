import React, { useState } from "react";
import { Modal } from "antd";
import toast from "react-hot-toast";

const HowYouKnowModal = ({ visible, onConfirm, onCancel }) => {
  const [selection, setSelection] = useState("");

  const options = ["Facebook", "GoogleAds", "Tiktok", "Others"];

  const handleConfirm = () => {
    if (selection) {
      onConfirm(selection);
    } else {
      toast.error("Please select your option!");
    }
  };

  return (
    <Modal
      title="How did you know PosturePal?"
      visible={visible}
      onOk={handleConfirm}
      onCancel={onCancel}
      className="max-w-lg mx-auto"
    >
      <div className="p-4 flex flex-col">
        {" "}
        {options.map((option, index) => (
          <div key={index} className="flex items-center mb-3">
            {" "}
            <input
              type="radio"
              value={option}
              checked={selection === option}
              onChange={() => setSelection(option)}
              className="form-radio text-blue-600 focus:ring-blue-500"
            />
            <label className="ml-2 text-lg cursor-pointer">
              {" "}
              {option}
            </label>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default HowYouKnowModal;
