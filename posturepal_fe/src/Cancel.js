import { Button, Typography, Result } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
const BASE_FE_URL = process.env.REACT_APP_BASE_FE_URL;

export default function PaymentCanceled() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 px-4 md:px-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
        <Result
          icon={
            <CloseCircleOutlined style={{ color: "red", fontSize: "48px" }} />
          }
          title={
            <Typography.Title
              level={3}
              className="text-gray-900 dark:text-gray-50"
            >
              Payment Canceled
            </Typography.Title>
          }
          subTitle={
            <div className="space-y-2 text-center">
              <Typography.Text className="!text-gray-600 dark:text-gray-400">
                Order #12345 | $99.99 | Visa ending in 1234
              </Typography.Text>
              <br />
              <Typography.Text className="!text-gray-600 dark:text-gray-400">
                Your payment has been canceled. If this was a mistake, you can
                retry the payment.
              </Typography.Text>
            </div>
          }
          extra={
            <Button
              color="default"
              href={`${BASE_FE_URL}/`}
              variant="solid"
              className="dark:bg-gray-50 dark:text-gray-900"
            >
              Go to Homepage
            </Button>
          }
        />
      </div>
    </div>
  );
}
