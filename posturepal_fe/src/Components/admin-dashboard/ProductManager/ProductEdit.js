import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, Upload, message, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ColorTags from "./ColorTags";
import SizeTags from "./SizeTags";
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function ProductEdit() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/api/products/${id}`);
        const productData = response.data;
        setProduct(productData);

        // Set form values
        form.setFieldsValue({
          name: productData.name,
          price: productData.price,
          imageAlt: productData.imageAlt,
          rating: productData.rating || 0,
          reviewCount: productData.reviewCount || 0,
        });

        // Set initial image file
        setFileList([
          {
            uid: "-1",
            name: "current-image.png",
            status: "done",
            url: `${BASE_API_URL}${productData.imageSrc}`,
          },
        ]);

        // Set initial colors and sizes
        setColors(JSON.parse(productData.colors || "[]"));
        setSizes(JSON.parse(productData.sizes || "[]"));
      } catch (error) {
        console.error(error);
      }
    };
    getProduct();
  }, [id, form]);

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

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("imageSrc", fileList[0].originFileObj || product.imageSrc); // Chỉ upload ảnh nếu có ảnh mới
    formData.append("imageAlt", values.imageAlt);
    formData.append("colors", colorsJson);
    formData.append("sizes", sizesJson);
    formData.append("rating", values.rating || 0);
    formData.append("reviewCount", values.reviewCount || 0);

    try {
      await axios.put(`${BASE_API_URL}/api/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      message.success("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      message.error("Failed to update product");
      console.error(error);
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
      <h1>Edit Product</h1>
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

        {/* Truyền danh sách colors và sizes đã có từ product */}
        <Form.Item label="Colors">
          <ColorTags onChange={handleColorChange} defaultColors={colors} />
        </Form.Item>
        <Form.Item label="Sizes">
          <SizeTags onChange={handleSizeChange} defaultSizes={sizes} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Product
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

export default ProductEdit;
