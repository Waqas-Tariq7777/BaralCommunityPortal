import React from "react";

const ResolvedComplaintPrint = (complaint) => {
  if (!complaint) return null;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    const totalCost =
      complaint.resources?.reduce(
        (sum, r) => sum + Number(r.cost || 0),
        0
      ) || 0;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Resolved Complaint Report</title>
  <style>
    body {
      font-family: "Segoe UI", Tahoma, sans-serif;
      padding: 40px;
      color: #1e293b;
      background: #f8fafc;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #748dff;
      margin-bottom: 30px;
      padding-bottom: 15px;
    }
    .header h1 {
      margin: 0;
      color: #748dff;
      font-size: 24px;
    }
    .header p {
      margin-top: 6px;
      font-size: 13px;
      color: #475569;
    }
    .section {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 25px;
    }
    .title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 12px;
      color: #748dff;
      border-left: 4px solid #748dff;
      padding-left: 10px;
    }
    .row {
      display: flex;
      margin-bottom: 8px;
    }
    .label {
      width: 160px;
      font-weight: 600;
      color: #334155;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 14px;
    }

    th, td {
      border: 1px solid #e5e7eb;
      padding: 12px;
      text-align: left;
    }

    th {
      background: #eef2ff;
      color: #4338ca;
      font-weight: 600;
    }

    tbody tr:nth-child(even) {
      background: #f9fafb;
    }

    .total {
      margin-top: 15px;
      text-align: right;
      font-size: 18px;
      font-weight: bold;
      color: #16a34a;
    }
  </style>
</head>

<body>

  <div class="header">
    <h1>Baral WAPDA Community Portal – MANGLA</h1>
    <p>Generated on ${new Date().toLocaleString()}</p>
  </div>

  <div class="section">
    <div class="title">User Information</div>
    <div class="row"><div class="label">Name:</div>${complaint.userId?.userName || "—"}</div>
    <div class="row"><div class="label">Email:</div>${complaint.userId?.email || "—"}</div>
    <div class="row"><div class="label">Mobile:</div>${complaint.userId?.mobileNumber || "—"}</div>
    <div class="row"><div class="label">House No:</div>${complaint.userId?.houseNumber || "—"}</div>
  </div>

  <div class="section">
    <div class="title">Complaint Details</div>
    <div class="row"><div class="label">Type:</div>${complaint.complaintType}</div>
    <div class="row"><div class="label">Status:</div>Resolved</div>
    <div class="row"><div class="label">Submitted:</div>${formatDate(complaint.createdAt)}</div>
    <div class="row">
  <div class="label">Resolved On:</div>
  ${formatDate(complaint.updatedAt)}
</div>

    <div class="row"><div class="label">Reason:</div>${complaint.reason || "—"}</div>
    <div class="row">
  <div class="label">Message:</div>
  <div style="word-break: break-word; overflow-wrap: anywhere;">
    ${complaint.message || "—"}
  </div>
</div>

  </div>

  ${complaint.resources?.length
        ? `
  <div class="section">
    <div class="title">Resources & Cost</div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Resource</th>
          <th>Cost</th>
        </tr>
      </thead>
      <tbody>
        ${complaint.resources
          .map(
            (r, i) =>
              `<tr>
                <td>${i + 1}</td>
                <td>${r.name}</td>
                <td>${formatCurrency(r.cost)}</td>
              </tr>`
          )
          .join("")}
      </tbody>
    </table>
    <div class="total">Total Cost: ${formatCurrency(totalCost)}</div>
  </div>`
        : ""
      }

</body>
</html>
`;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return { handlePrint };
};

export default ResolvedComplaintPrint;
