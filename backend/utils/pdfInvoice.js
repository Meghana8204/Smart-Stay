const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

// ─── Color Palette ────────────────────────────────────────────────────────────
const C = {
  brand:        "#1a3f6f",
  brandDark:    "#122c50",
  brandLight:   "#eaf1fb",
  brandMid:     "#2e6bb0",
  accent:       "#f59e0b",
  black:        "#0f172a",
  bodyText:     "#1e293b",
  muted:        "#64748b",
  mutedLight:   "#94a3b8",
  border:       "#e2e8f0",
  borderDark:   "#cbd5e1",
  white:        "#ffffff",
  rowAlt:       "#f8fafc",
  rowAlt2:      "#f1f5f9",
  success:      "#15803d",
  successBg:    "#dcfce7",
  danger:       "#b91c1c",
  dangerBg:     "#fee2e2",
  warning:      "#92400e",
  warningBg:    "#fef3c7",
  muted2Bg:     "#f1f5f9",
  dividerBlue:  "#3b82f6",
};

// ─── Layout Constants ─────────────────────────────────────────────────────────
const PAGE_W  = 595;
const PAGE_H  = 842;
const MARGIN  = 44;
const INNER_W = PAGE_W - MARGIN * 2;

// ─── Utilities ────────────────────────────────────────────────────────────────

const fillRect = (doc, x, y, w, h, color) =>
  doc.save().rect(x, y, w, h).fill(color).restore();

const strokeRect = (doc, x, y, w, h, color, lw = 0.5) =>
  doc.save().rect(x, y, w, h).strokeColor(color).lineWidth(lw).stroke().restore();

const hLine = (doc, y, x1 = MARGIN, x2 = PAGE_W - MARGIN, color = C.border, lw = 0.5) =>
  doc.save().moveTo(x1, y).lineTo(x2, y).strokeColor(color).lineWidth(lw).stroke().restore();

const vLine = (doc, x, y1, y2, color = C.border, lw = 0.5) =>
  doc.save().moveTo(x, y1).lineTo(x, y2).strokeColor(color).lineWidth(lw).stroke().restore();

/** Rounded rect fill */
const roundRect = (doc, x, y, w, h, r, color) =>
  doc.save().roundedRect(x, y, w, h, r).fill(color).restore();

const fmt = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

const rupee = (n) =>
  `\u20B9${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const nightCount = (ci, co) =>
  Math.max(1, Math.ceil((new Date(co) - new Date(ci)) / 86_400_000));

const statusBadge = (status) => {
  const val = (status || "pending").toLowerCase();
  const map = {
    paid:      { text: "PAID",     bg: C.successBg, fg: C.success },
    success:   { text: "PAID",     bg: C.successBg, fg: C.success },
    succeeded: { text: "PAID",     bg: C.successBg, fg: C.success },
    completed: { text: "PAID",     bg: C.successBg, fg: C.success },
    pending:   { text: "PENDING",  bg: C.warningBg, fg: C.warning },
    failed:    { text: "FAILED",   bg: C.dangerBg,  fg: C.danger  },
    refunded:  { text: "REFUNDED", bg: C.muted2Bg,  fg: C.muted   },
  };
  return map[val] || { text: (status || "PENDING").toUpperCase(), bg: C.muted2Bg, fg: C.muted };
};

// ─── Section Label Helper ─────────────────────────────────────────────────────
const sectionLabel = (doc, x, y, text) => {
  doc
    .fillColor(C.brand)
    .font("Helvetica-Bold")
    .fontSize(7.5)
    .text(text, x, y);
  hLine(doc, y + 12, x, PAGE_W - MARGIN, C.brand, 0.75);
};

// ─── Key-Value pair helper ────────────────────────────────────────────────────
const kv = (doc, x, y, label, value, labelW = 100) => {
  doc
    .fillColor(C.muted)
    .font("Helvetica")
    .fontSize(8)
    .text(label, x, y, { width: labelW });
  doc
    .fillColor(C.bodyText)
    .font("Helvetica-Bold")
    .fontSize(8.5)
    .text(value || "—", x + labelW, y, { width: INNER_W - labelW });
};

// ─── Main Builder ─────────────────────────────────────────────────────────────
const buildInvoicePdf = (booking) =>
  new Promise((resolve, reject) => {
    try {
      // ── Derived values ─────────────────────────────────────────────────────
      const invoiceNumber = `INV-${String(booking._id || "DEMO0001").toUpperCase().slice(-10)}`;
      const bookingRef    = `BKG-${String(booking._id || "DEMO0001").toUpperCase().slice(-8)}`;
      const checkIn       = new Date(booking.checkInDate  || "2025-03-10");
      const checkOut      = new Date(booking.checkOutDate || "2025-03-14");
      const nights        = nightCount(checkIn, checkOut);
      const totalPrice    = Number(booking.totalPrice || 0);
      const taxRate       = 0.12;
      const subtotal      = parseFloat((totalPrice / (1 + taxRate)).toFixed(2));
      const cgst          = parseFloat(((totalPrice - subtotal) / 2).toFixed(2));
      const sgst          = cgst;
      const tax           = cgst + sgst;
      const payStatus     = booking.paymentStatus || booking.paymentInfo?.status || booking.status || "pending";
      const badge         = statusBadge(payStatus);

      const guestName    = booking.user?.name    || "Valued Guest";
      const guestEmail   = booking.user?.email   || "guest@example.com";
      const guestPhone   = booking.user?.phone   || "+91 98765 43210";
      const guestAddress = booking.user?.address || "123, Main Street, Bengaluru, Karnataka - 560001";
      const guestGST     = booking.user?.gstin   || null;

      const hotelName    = booking.hotel?.hotelName    || "SmartStay Grand";
      const hotelAddr    = booking.hotel?.address      || "456 Luxury Avenue, New Delhi - 110001";
      const hotelGST     = booking.hotel?.gstin        || "07AABCS1234N1Z5";
      const hotelPhone   = booking.hotel?.phone        || "+91 11 4567 8900";
      const hotelEmail   = booking.hotel?.email        || "reservations@smartstay.com";
      const hotelState   = booking.hotel?.state        || "Delhi";
      const hotelSAC     = "996311"; // SAC code for accommodation services

      const roomType     = booking.room?.roomType   || "Deluxe King Room";
      const roomNumber   = booking.room?.roomNumber || "302";
      const bedType      = booking.room?.bedType    || "King Bed";
      const floor        = booking.room?.floor      || "3rd Floor";
      const guests       = booking.guests           || 2;
      const inclusions   = booking.inclusions       || ["Complimentary Breakfast", "Wi-Fi", "Airport Transfer"];
      const payMethod    = booking.paymentMethod    || "Online (UPI / Card)";
      const txnId        = booking.paymentInfo?.transactionId || booking.paymentInfo?.razorpay_payment_id || "TXN-NA";
      const issueDate    = new Date();
      const ratePerNight = nights > 0 ? subtotal / nights : subtotal;

      // ── Document ───────────────────────────────────────────────────────────
      const doc     = new PDFDocument({ margin: 0, size: "A4", info: {
        Title:   `Invoice ${invoiceNumber}`,
        Author:  "SmartStay Hotels",
        Subject: "Hotel Booking Invoice",
      }});
      const bufs = [];
      doc.on("data", (c) => bufs.push(c));
      doc.on("end",  () => resolve(Buffer.concat(bufs)));
      doc.on("error", reject);

      // ════════════════════════════════════════════════════════════════════════
      // 1. HEADER BAND
      // ════════════════════════════════════════════════════════════════════════
      const HDR_H = 90;
      fillRect(doc, 0, 0, PAGE_W, HDR_H, C.brand);

      // Subtle diagonal stripes for depth
      doc.save().opacity(0.05);
      for (let i = -HDR_H; i < PAGE_W + HDR_H; i += 18) {
        doc.moveTo(i, 0).lineTo(i + HDR_H, HDR_H).strokeColor(C.white).lineWidth(6).stroke();
      }
      doc.restore();

      // Logo placeholder / Brand
      const logoPath = path.join(__dirname, "assets/logo.png");
      let textStartX = MARGIN;
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, MARGIN, 19, { height: 52 });
        textStartX = MARGIN + 60;
      }

      doc
        .fillColor(C.white)
        .font("Helvetica-Bold")
        .fontSize(24)
        .text("SmartStay", textStartX, 18);
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor("rgba(255,255,255,0.65)")
        .text("Premium Luxury Hotels & Resorts", textStartX, 47)
        .text(`${hotelAddr}`, textStartX, 58)
        .text(`GSTIN: ${hotelGST}  ·  SAC: ${hotelSAC}`, textStartX, 69);

      // Right side — TAX INVOICE label + invoice number
      doc
        .fillColor(C.accent)
        .font("Helvetica-Bold")
        .fontSize(18)
        .text("TAX INVOICE", 0, 20, { align: "right", width: PAGE_W - MARGIN });
      doc
        .fillColor("rgba(255,255,255,0.9)")
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(invoiceNumber, 0, 46, { align: "right", width: PAGE_W - MARGIN });
      doc
        .fillColor("rgba(255,255,255,0.6)")
        .font("Helvetica")
        .fontSize(8)
        .text(`Booking Ref: ${bookingRef}`, 0, 59, { align: "right", width: PAGE_W - MARGIN })
        .text(`Date: ${fmt(issueDate)}`, 0, 71, { align: "right", width: PAGE_W - MARGIN });

      // ════════════════════════════════════════════════════════════════════════
      // 2. ORANGE ACCENT BAR
      // ════════════════════════════════════════════════════════════════════════
      fillRect(doc, 0, HDR_H, PAGE_W, 4, C.accent);

      // ════════════════════════════════════════════════════════════════════════
      // 3. INFO ROW — Billed To  |  Stay Details  |  Payment Status
      // ════════════════════════════════════════════════════════════════════════
      const INFO_Y = HDR_H + 4 + 14;
      const COL1_X = MARGIN;
      const COL2_X = MARGIN + 175;
      const COL3_X = MARGIN + 360;
      const COL_H  = 100;

      // Col 1 — Billed To
      doc.fillColor(C.muted).font("Helvetica-Bold").fontSize(7.5).text("BILLED TO", COL1_X, INFO_Y);
      hLine(doc, INFO_Y + 11, COL1_X, COL2_X - 12, C.borderDark, 0.5);
      doc
        .fillColor(C.black).font("Helvetica-Bold").fontSize(11)
        .text(guestName, COL1_X, INFO_Y + 16, { width: 160 });
      doc.fillColor(C.muted).font("Helvetica").fontSize(8)
        .text(guestAddress, COL1_X, INFO_Y + 32, { width: 160, lineGap: 2 })
        .text(guestEmail,   COL1_X, INFO_Y + 62, { width: 160 })
        .text(guestPhone,   COL1_X, INFO_Y + 74, { width: 160 });
      if (guestGST) {
        doc.text(`GSTIN: ${guestGST}`, COL1_X, INFO_Y + 86, { width: 160 });
      }

      // Vertical divider
      vLine(doc, COL2_X - 10, INFO_Y, INFO_Y + COL_H, C.borderDark, 0.5);

      // Col 2 — Stay Details
      doc.fillColor(C.muted).font("Helvetica-Bold").fontSize(7.5).text("STAY DETAILS", COL2_X, INFO_Y);
      hLine(doc, INFO_Y + 11, COL2_X, COL3_X - 12, C.borderDark, 0.5);

      const stayRows = [
        ["Hotel",      hotelName],
        ["Room Type",  roomType],
        ["Room No.",   `#${roomNumber} · ${floor}`],
        ["Bed Type",   bedType],
        ["Check-in",   fmt(checkIn)],
        ["Check-out",  fmt(checkOut)],
        ["Duration",   `${nights} Night${nights > 1 ? "s" : ""} · ${guests} Guest${guests > 1 ? "s" : ""}`],
      ];
      stayRows.forEach(([l, v], i) => {
        doc
          .fillColor(C.muted).font("Helvetica").fontSize(7.5)
          .text(l, COL2_X, INFO_Y + 18 + i * 11, { width: 70 })
          .fillColor(C.bodyText).font("Helvetica-Bold").fontSize(7.5)
          .text(v, COL2_X + 68, INFO_Y + 18 + i * 11, { width: 100 });
      });

      // Vertical divider
      vLine(doc, COL3_X - 10, INFO_Y, INFO_Y + COL_H, C.borderDark, 0.5);

      // Col 3 — Payment Info + Status badge
      doc.fillColor(C.muted).font("Helvetica-Bold").fontSize(7.5).text("PAYMENT DETAILS", COL3_X, INFO_Y);
      hLine(doc, INFO_Y + 11, COL3_X, PAGE_W - MARGIN, C.borderDark, 0.5);

      // Status pill
      const pillW = 80, pillH = 20;
      roundRect(doc, COL3_X, INFO_Y + 16, pillW, pillH, 4, badge.bg);
      doc
        .fillColor(badge.fg).font("Helvetica-Bold").fontSize(8.5)
        .text(badge.text, COL3_X, INFO_Y + 21, { width: pillW, align: "center" });

      const payRows = [
        ["Method",   payMethod],
        ["Txn. ID",  txnId],
        ["Amount",   rupee(totalPrice)],
        ["Invoice",  invoiceNumber],
        ["Issued",   fmt(issueDate)],
      ];
      payRows.forEach(([l, v], i) => {
        doc
          .fillColor(C.muted).font("Helvetica").fontSize(7.5)
          .text(l, COL3_X, INFO_Y + 42 + i * 11, { width: 48 })
          .fillColor(C.bodyText).font("Helvetica-Bold").fontSize(7.5)
          .text(v, COL3_X + 48, INFO_Y + 42 + i * 11, { width: 99 });
      });

      // ════════════════════════════════════════════════════════════════════════
      // 4. LINE ITEMS TABLE
      // ════════════════════════════════════════════════════════════════════════
      const TBL_Y = INFO_Y + COL_H + 18;
      sectionLabel(doc, MARGIN, TBL_Y, "ITEMISED CHARGES");

      const TBL_HDR_Y = TBL_Y + 18;
      const TBL_HDR_H = 22;

      // Header background
      fillRect(doc, MARGIN, TBL_HDR_Y, INNER_W, TBL_HDR_H, C.brand);

      // Column definitions
      const COLS = {
        sno:    { x: MARGIN + 6,        w: 24,  align: "center" },
        desc:   { x: MARGIN + 30,       w: 165, align: "left"   },
        hsn:    { x: MARGIN + 195,      w: 50,  align: "center" },
        qty:    { x: MARGIN + 245,      w: 50,  align: "center" },
        rate:   { x: MARGIN + 295,      w: 65,  align: "right"  },
        tax:    { x: MARGIN + 360,      w: 50,  align: "center" },
        amount: { x: MARGIN + 410,      w: 85,  align: "right"  },
      };

      const thLabels = [
        ["#",          COLS.sno],
        ["DESCRIPTION",COLS.desc],
        ["SAC",        COLS.hsn],
        ["NIGHTS×GUESTS", COLS.qty],
        ["RATE/NIGHT", COLS.rate],
        ["GST",        COLS.tax],
        ["AMOUNT",     COLS.amount],
      ];

      const thY = TBL_HDR_Y + 7;
      thLabels.forEach(([label, col]) => {
        doc
          .fillColor(C.white).font("Helvetica-Bold").fontSize(7)
          .text(label, col.x, thY, { width: col.w, align: col.align });
      });

      // Data rows
      const lineItems = [
        {
          desc:       `${hotelName} — ${roomType}`,
          subDesc:    `Room #${roomNumber} · ${bedType} · ${floor}`,
          sac:        hotelSAC,
          qty:        `${nights}×${guests}`,
          rate:       ratePerNight,
          taxLabel:   "12%",
          amount:     subtotal,
        },
      ];

      let rowY = TBL_HDR_Y + TBL_HDR_H;

      lineItems.forEach((item, idx) => {
        const ROW_H = 36;
        fillRect(doc, MARGIN, rowY, INNER_W, ROW_H, idx % 2 === 0 ? C.white : C.rowAlt);

        doc
          .fillColor(C.muted).font("Helvetica").fontSize(8)
          .text(String(idx + 1), COLS.sno.x, rowY + 12, { width: COLS.sno.w, align: "center" });
        doc
          .fillColor(C.black).font("Helvetica-Bold").fontSize(8.5)
          .text(item.desc, COLS.desc.x, rowY + 7, { width: COLS.desc.w });
        doc
          .fillColor(C.muted).font("Helvetica").fontSize(7.5)
          .text(item.subDesc, COLS.desc.x, rowY + 20, { width: COLS.desc.w });
        doc
          .fillColor(C.muted).font("Helvetica").fontSize(8)
          .text(item.sac, COLS.hsn.x, rowY + 13, { width: COLS.hsn.w, align: "center" });
        doc
          .fillColor(C.bodyText).font("Helvetica").fontSize(8)
          .text(item.qty, COLS.qty.x, rowY + 13, { width: COLS.qty.w, align: "center" });
        doc
          .fillColor(C.bodyText).font("Helvetica").fontSize(8)
          .text(rupee(item.rate.toFixed(2)), COLS.rate.x, rowY + 13, { width: COLS.rate.w, align: "right" });
        doc
          .fillColor(C.muted).font("Helvetica").fontSize(8)
          .text(item.taxLabel, COLS.tax.x, rowY + 13, { width: COLS.tax.w, align: "center" });
        doc
          .fillColor(C.black).font("Helvetica-Bold").fontSize(9)
          .text(rupee(item.amount), COLS.amount.x, rowY + 13, { width: COLS.amount.w, align: "right" });

        rowY += ROW_H;
      });

      // Add-ons row (inclusions)
      if (inclusions && inclusions.length > 0) {
        const ROW_H = 26;
        fillRect(doc, MARGIN, rowY, INNER_W, ROW_H, C.rowAlt2);
        doc
          .fillColor(C.muted).font("Helvetica").fontSize(8)
          .text("2", COLS.sno.x, rowY + 8, { width: COLS.sno.w, align: "center" });
        doc
          .fillColor(C.black).font("Helvetica-Bold").fontSize(8)
          .text("Complimentary Inclusions", COLS.desc.x, rowY + 5);
        doc
          .fillColor(C.muted).font("Helvetica").fontSize(7)
          .text(inclusions.join("  ·  "), COLS.desc.x, rowY + 15, { width: 320 });
        doc
          .fillColor(C.success).font("Helvetica-Bold").fontSize(8)
          .text("COMPLIMENTARY", COLS.amount.x, rowY + 9, { width: COLS.amount.w, align: "right" });
        rowY += ROW_H;
      }

      // Table bottom border
      hLine(doc, rowY, MARGIN, PAGE_W - MARGIN, C.borderDark, 1);

      // ════════════════════════════════════════════════════════════════════════
      // 5. TOTALS BLOCK + GST BREAKUP SIDE BY SIDE
      // ════════════════════════════════════════════════════════════════════════
      const TOT_Y = rowY + 14;

      // --- Left: GST Breakup Table (Amazon/Flipkart style) ---
      const GST_X = MARGIN;
      const GST_W = 240;
      sectionLabel(doc, GST_X, TOT_Y, "TAX BREAKUP");

      const GST_HDR_Y = TOT_Y + 18;
      fillRect(doc, GST_X, GST_HDR_Y, GST_W, 18, C.brandLight);
      doc.fillColor(C.brand).font("Helvetica-Bold").fontSize(7);
      ["DESCRIPTION", "TAXABLE AMT", "CGST @6%", "SGST @6%", "TOTAL TAX"].forEach((h, i) => {
        const cws = [80, 40, 35, 35, 40];
        const cx  = GST_X + cws.slice(0, i).reduce((a, b) => a + b, 6);
        doc.text(h, cx, GST_HDR_Y + 5, { width: cws[i], align: i > 0 ? "right" : "left" });
      });

      const gstRows = [
        ["Accommodation", subtotal, cgst, sgst, tax],
      ];
      gstRows.forEach(([desc, taxable, c, s, total], i) => {
        const gy = GST_HDR_Y + 18 + i * 16;
        fillRect(doc, GST_X, gy, GST_W, 16, i % 2 === 0 ? C.white : C.rowAlt);
        const cws = [80, 40, 35, 35, 40];
        const vals = [desc, rupee(taxable), rupee(c), rupee(s), rupee(total)];
        vals.forEach((v, j) => {
          const cx = GST_X + cws.slice(0, j).reduce((a, b) => a + b, 6);
          doc.fillColor(j === 0 ? C.bodyText : C.black)
            .font(j === 0 ? "Helvetica" : "Helvetica-Bold")
            .fontSize(7.5)
            .text(v, cx, gy + 4, { width: cws[j], align: j > 0 ? "right" : "left" });
        });
      });

      strokeRect(doc, GST_X, GST_HDR_Y, GST_W, 18 + gstRows.length * 16, C.borderDark, 0.5);

      // ── GST Note
      doc
        .fillColor(C.mutedLight).font("Helvetica").fontSize(6.5)
        .text("* GST charged as per applicable rates. GSTIN of supplier above.", GST_X, GST_HDR_Y + 18 + gstRows.length * 16 + 5, { width: GST_W });

      // --- Right: Totals summary ---
      const SUM_X = MARGIN + 278;
      const SUM_W = INNER_W - 278;

      sectionLabel(doc, SUM_X, TOT_Y, "SUMMARY");

      const sumItems = [
        { label: "Room Charges (excl. tax)", value: rupee(subtotal),    bold: false },
        { label: `CGST @ 6%`,               value: rupee(cgst),        bold: false },
        { label: `SGST @ 6%`,               value: rupee(sgst),        bold: false },
        { label: "Discounts / Offers",       value: rupee(0),           bold: false, muted: true },
      ];

      let sy = TOT_Y + 18;
      sumItems.forEach(({ label, value, muted: isMuted }) => {
        hLine(doc, sy, SUM_X, PAGE_W - MARGIN, C.border, 0.4);
        doc
          .fillColor(isMuted ? C.mutedLight : C.muted)
          .font("Helvetica").fontSize(8.5)
          .text(label, SUM_X, sy + 4, { width: SUM_W * 0.62 });
        doc
          .fillColor(isMuted ? C.mutedLight : C.bodyText)
          .font("Helvetica-Bold").fontSize(8.5)
          .text(value, SUM_X, sy + 4, { width: SUM_W, align: "right" });
        sy += 18;
      });

      // Grand total bar
      fillRect(doc, SUM_X, sy, SUM_W, 32, C.brand);
      doc
        .fillColor("rgba(255,255,255,0.7)").font("Helvetica-Bold").fontSize(8.5)
        .text("TOTAL AMOUNT PAYABLE", SUM_X + 8, sy + 8);
      doc
        .fillColor(C.accent).font("Helvetica-Bold").fontSize(15)
        .text(rupee(totalPrice), SUM_X, sy + 6, { width: SUM_W - 8, align: "right" });

      // Amount in words
      doc
        .fillColor(C.mutedLight).font("Helvetica").fontSize(7)
        .text(
          `(Inclusive of all taxes)`,
          SUM_X, sy + 37, { width: SUM_W }
        );

      // ════════════════════════════════════════════════════════════════════════
      // 6. POLICIES & TERMS (Amazon/Flipkart style info box)
      // ════════════════════════════════════════════════════════════════════════
      const POL_Y = sy + 56;
      sectionLabel(doc, MARGIN, POL_Y, "POLICIES & INFORMATION");

      const POL_BOX_Y = POL_Y + 18;
      const POL_BOX_H = 72;
      fillRect(doc, MARGIN, POL_BOX_Y, INNER_W, POL_BOX_H, C.brandLight);
      strokeRect(doc, MARGIN, POL_BOX_Y, INNER_W, POL_BOX_H, C.brand + "40", 0.5);

      const policies = [
        ["Check-in / Check-out",  "Check-in: 2:00 PM onwards  ·  Check-out: by 12:00 PM noon  ·  Early/late subject to availability"],
        ["Cancellation",          "Free cancellation up to 48 hrs before check-in. 1-night charge applies for late cancellations."],
        ["Identification",        "Govt-issued photo ID mandatory at check-in. International guests must present a valid passport."],
        ["GST Compliance",        `This is a computer-generated tax invoice under CGST/SGST Act, 2017. No signature required.`],
      ];

      const polCol1 = MARGIN + 10;
      const polCol2 = MARGIN + 126;

      policies.forEach(([head, body], i) => {
        const py = POL_BOX_Y + 8 + i * 16;
        doc
          .fillColor(C.brand).font("Helvetica-Bold").fontSize(7.5)
          .text(head, polCol1, py, { width: 110 });
        doc
          .fillColor(C.muted).font("Helvetica").fontSize(7.5)
          .text(body, polCol2, py, { width: INNER_W - 120 });
      });

      // ════════════════════════════════════════════════════════════════════════
      // 7. SUPPORT & CONTACT ROW
      // ════════════════════════════════════════════════════════════════════════
      const SUPP_Y = POL_BOX_Y + POL_BOX_H + 16;
      sectionLabel(doc, MARGIN, SUPP_Y, "NEED HELP?");

      const suppItems = [
        { icon: "✉", label: "Email",   value: hotelEmail },
        { icon: "☎", label: "Phone",   value: hotelPhone },
        { icon: "⊙", label: "Website", value: "www.smartstay.com" },
        { icon: "⊡", label: "Address", value: hotelAddr },
      ];

      const SIC_W = INNER_W / suppItems.length;
      const SUPP_BOX_Y = SUPP_Y + 18;

      suppItems.forEach(({ icon, label, value }, i) => {
        const sx = MARGIN + i * SIC_W;
        fillRect(doc, sx, SUPP_BOX_Y, SIC_W - 4, 38, i % 2 === 0 ? C.brandLight : C.white);
        doc
          .fillColor(C.brand).font("Helvetica-Bold").fontSize(12)
          .text(icon, sx + 8, SUPP_BOX_Y + 4);
        doc
          .fillColor(C.muted).font("Helvetica").fontSize(7)
          .text(label.toUpperCase(), sx + 26, SUPP_BOX_Y + 6);
        doc
          .fillColor(C.bodyText).font("Helvetica-Bold").fontSize(7.5)
          .text(value, sx + 26, SUPP_BOX_Y + 17, { width: SIC_W - 34 });
      });

      // ════════════════════════════════════════════════════════════════════════
      // 8. FOOTER
      // ════════════════════════════════════════════════════════════════════════
      const FTR_Y = PAGE_H - 38;
      fillRect(doc, 0, FTR_Y, PAGE_W, 38, C.brand);
      hLine(doc, FTR_Y, 0, PAGE_W, C.accent, 2);

      doc
        .fillColor(C.white).font("Helvetica-Bold").fontSize(8.5)
        .text("Thank you for choosing SmartStay — we hope to welcome you back soon!", 0, FTR_Y + 7, {
          align: "center", width: PAGE_W,
        });
      doc
        .fillColor("rgba(255,255,255,0.5)").font("Helvetica").fontSize(7)
        .text(
          `${invoiceNumber}  ·  This invoice is valid only for the stay period mentioned above.  ·  Generated on ${fmt(issueDate)}`,
          0, FTR_Y + 22, { align: "center", width: PAGE_W }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });

module.exports = buildInvoicePdf;