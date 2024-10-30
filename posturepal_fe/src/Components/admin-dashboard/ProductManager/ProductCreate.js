
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Upload, message, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ColorTags from "./ColorTags";
import SizeTags from "./SizeTags";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

function ProductCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const handleImageUpload = async (file) => {
    setFileList([file]);
    return false; // Prevent auto upload
  };

  const handleColorChange = (selectedColors) => {
    setColors(selectedColors || []);
    console.log("Colors updated:", selectedColors);
  };

  const handleSizeChange = (sizes) => {
    setSizes(sizes || []);
    console.log("Sizes updated:", sizes);
  };

  const handleSubmit = async (values) => {
    // Log form values to verify
    console.log("Form Values:", values);
    console.log("Colors:", colors);
    console.log("Sizes:", sizes);

    // Validate colors and sizes selection
    if (colors.length === 0 || sizes.length === 0) {
      message.error("Please select at least one color and one size.");
      return;
    }
    if (fileList.length === 0) {
      message.error("Please upload an image.");
      return;
    }

    const colorsJson = JSON.stringify(colors);
    const sizesJson = JSON.stringify(sizes);

    // Prepare FormData to submit image and product details
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("imageSrc", fileList[0].originFileObj);
    formData.append("imageAlt", values.imageAlt);
    formData.append("colors", colorsJson); // Convert to JSON string
    formData.append("sizes", sizesJson); // Convert to JSON string
    formData.append("rating", values.rating || 0); // Include rating
    formData.append("reviewCount", values.reviewCount || 0); // Include review count

    try {
      // Submit form data
      await axios.post(
        `${BASE_API_URL}/api/products/create-product`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      message.success("Product created successfully");
      navigate("/admin/products");
    } catch (error) {
      message.error("Failed to create product");
      console.log(
        "Create product failed:",
        error.response?.data || error.message || error
      );
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div>
      <h1>Create Product</h1>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please input the product name!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Price"
          name="price"
          rules={[
            { required: true, message: "Please input the product price!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Image" name="imageSrc">
          <Upload
            listType="picture-card"
            fileList={fileList}
            customRequest={({ file, onSuccess }) => {
              handleImageUpload(file).then(() => onSuccess(file));
            }}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item label="Image Alt" name="imageAlt">
          <Input />
        </Form.Item>
        <Form.Item label="Rating" name="rating">
          <Input type="number" min={0} max={5} />
        </Form.Item>
        <Form.Item label="Review Count" name="reviewCount">
          <Input type="number" min={0} />
        </Form.Item>
        <Form.Item label="Colors">
          <ColorTags onChange={handleColorChange} />
        </Form.Item>
        <Form.Item label="Sizes">
          <SizeTags onChange={handleSizeChange} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Product
          </Button>
        </Form.Item>
      </Form>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
}

export default ProductCreate;
