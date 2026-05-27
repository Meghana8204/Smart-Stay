import { Toaster } from "react-hot-toast";

export default function Toast() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        style: {
          fontFamily: "'Poppins', sans-serif",
          fontSize: "14px",
          fontWeight: 500,
          borderRadius: "10px",
          padding: "12px 16px",
        },
        success: {
          style: {
            background: "#f0fdf4",
            color: "#15803d",
            border: "1px solid #86efac",
          },
          iconTheme: {
            primary: "#15803d",
            secondary: "#f0fdf4",
          },
        },
        error: {
          style: {
            background: "#fdf2f2",
            color: "#b91c1c",
            border: "1px solid #fecaca",
          },
          iconTheme: {
            primary: "#b91c1c",
            secondary: "#fdf2f2",
          },
        },
      }}
    />
  );
}