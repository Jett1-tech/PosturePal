import React, { useState, useEffect } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import Card from "./Card";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import toast from "react-hot-toast";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [canceledCount, setCanceledCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [facebook, setFacebook] = useState(0);
  const [googleAds, setGoogleAds] = useState(0);
  const [tiktok, setTiktok] = useState(0);
  const [others, setOthers] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/api/order/orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const fetchedOrders = response.data;
        console.log("fetchedOrders", fetchedOrders);

        setOrders(fetchedOrders);

        let pending = 0;
        let approved = 0;
        let canceled = 0;
        let facebookCount = 0;
        let googleAdsCount = 0;
        let tiktokCount = 0;
        let othersCount = 0;

        let earnings = 0;

        fetchedOrders.forEach((order) => {
          if (order.status === "Pending") pending++;
          if (order.status === "Approved") {
            approved++;
            earnings += order.totalPrice;
          }
            if (order.status === "Rejected") canceled++;
            
          if (order.howYouKnowPosturelPal === "Facebook") facebookCount++;
          if (order.howYouKnowPosturelPal === "GoogleAds") googleAdsCount++;
          if (order.howYouKnowPosturelPal === "Tiktok") tiktokCount++;
          if (order.howYouKnowPosturelPal === "Others") othersCount++;
        });

        setPendingCount(pending);
        setApprovedCount(approved);
          setCanceledCount(canceled);
          setFacebook(facebookCount);
          setGoogleAds(googleAdsCount);
          setTiktok(tiktokCount);
          setOthers(othersCount)
        setTotalEarnings(earnings);
        toast.success("Success to fetching orders");
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Error to fetching orders");
      }
    };

    fetchOrders();
  }, []);
  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
        <a
          href="#"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
        >
          <FontAwesomeIcon
            icon={faDownload}
            style={{ marginRight: "0.25rem", color: "white" }}
          />
          Generate Report
        </a>
      </div>
      <div className="row">
        <Card
          title="Total Earnings"
          value={`${totalEarnings}VND`}
          color="primary"
        />
        <Card title="Orders" value={orders.length} color="info" />
        <Card title="Approved" value={approvedCount} color="success" />
        <Card title="Pending Requests" value={pendingCount} color="warning" />
        <Card title="Rejected" value={canceledCount} color="danger" />
      </div>
      <div className="row">
        <div className="col-xl-4 col-lg-5">
          <Doughnut
            options={{
              plugins: {
                title: {
                  display: true,
                  text: "Revenue Sources",
                },
              },
            }}
            data={{
              labels: ["GoogleAds", "Facebook", "Tiktok", "Others"],
              datasets: [
                {
                  data: [googleAds, facebook, tiktok, others],
                  backgroundColor: [
                    "rgb(255 215 0)",
                    "rgb(67 110 238)",
                    "rgb(54 54 54)",
                    "rgb(122 139 139)",
                  ],
                  hoverOffset: 4,
                },
              ],
            }}
          />
        </div>
        <div className="col-xl-8 col-lg-7">
          <Line
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Earnings Overview",
                },
              },
            }}
            data={{
              labels: [
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
              datasets: [
                {
                  label: "Earnings in VND",
                  data: [0, 10000, totalEarnings],
                  fill: false,
                  borderColor: "rgb(75, 192, 192)",
                  tension: 0.1,
                },
              ],
            }}
          />
          ;
        </div>
      </div>
    </>
  );
}

export default Dashboard;
