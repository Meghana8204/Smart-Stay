const bookingConfirmationTemplate = (
  userName,
  hotelName,
  roomType,
  checkIn,
  checkOut
) => {
  return `
    <div style="font-family:sans-serif">
    
      <h2>Booking Confirmed</h2>

      <p>Hello ${userName},</p>

      <p>
        Your booking at
        <strong>${hotelName}</strong>
        is confirmed.
      </p>

      <ul>
        <li>
          Room Type:
          ${roomType}
        </li>

        <li>
          Check-In:
          ${checkIn}
        </li>

        <li>
          Check-Out:
          ${checkOut}
        </li>
      </ul>

      <p>
        Thank you for choosing SmartStay.
      </p>
    </div>
  `;
};

const bookingCancelledTemplate = (
  userName,
  hotelName
) => {
  return `
    <div style="font-family:sans-serif">
      <h2>Booking Cancelled</h2>
      <p>Hello ${userName},</p>
      <p>Your booking at <strong>${hotelName}</strong> has been cancelled.</p>
    </div>
  `;
};

module.exports = {
  bookingConfirmationTemplate,
  bookingCancelledTemplate,
};
