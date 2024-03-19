const validateJson = require('./validateJSON');
const {getData} = require('./data.js');
/**
 * Builds the html file to render the invoice and returns it.
 * @param {*} data
 * @return {html}
 */
function generateHtml(data) {
  const id = data['cbc:ID'] ?? '';
  const issueDate = data['cbc:IssueDate'] ?? '';
  const dueDate = data['cbc:DueDate'] ?? '';
  const billingReferenceId = data['cac:BillingReference']?.[0]?.['cac:InvoiceDocumentReference']?.[0]?.['cbc:ID']?.[0] ?? '';
  const billingReferenceIssueDate = data['cac:BillingReference']?.[0]?.['cac:InvoiceDocumentReference']?.[0]?.['cbc:IssueDate']?.[0] ?? '';
  const buyerReference = data['cbc:BuyerReference'] ?? '';
  const sellerName = data['cac:AccountingSupplierParty']?.[0]?.['cac:Party']?.[0]?.['cac:PartyName']?.[0]?.['cbc:Name'] ?? '';
  const sellerStreetName = data['cac:AccountingSupplierParty']?.[0]?.['cac:Party']?.[0]?.['cac:PostalAddress']?.[0]?.['cbc:StreetName'] ?? '';
  const sellerCityName = data['cac:AccountingSupplierParty']?.[0]?.['cac:Party']?.[0]?.['cac:PostalAddress']?.[0]?.['cbc:CityName'] ?? '';
  const sellerPostalZone = data['cac:AccountingSupplierParty']?.[0]?.['cac:Party']?.[0]?.['cac:PostalAddress']?.[0]?.['cbc:PostalZone'] ?? '';
  const sellerCountryCode =
    data['cac:AccountingSupplierParty']?.[0]?.['cac:Party']?.[0]?.['cac:PostalAddress']?.[0]?.['cac:Country']?.[0]?.['cbc:IdentificationCode']?.[0]?.['_'] ??
    data['cac:AccountingSupplierParty']?.[0]?.['cac:Party']?.[0]?.['cac:PostalAddress']?.[0]?.['cac:Country']?.[0]?.['cbc:IdentificationCode']?.[0] ??
    '';
  const sellerAbn = data['cac:AccountingSupplierParty']?.[0]?.['cac:Party']?.[0]?.['cac:PartyLegalEntity']?.[0]?.['cbc:CompanyID']?.[0]?.['_'] ?? 'Not applicable';
  const buyerName = data['cac:AccountingCustomerParty']?.[0]?.['cac:Party']?.[0]?.['cac:PartyName']?.[0]?.['cbc:Name'] ?? '';
  const buyerStreetName = data['cac:AccountingCustomerParty']?.[0]?.['cac:Party']?.[0]?.['cac:PostalAddress']?.[0]?.['cbc:StreetName'] ?? '';
  const buyerCityName = data['cac:AccountingCustomerParty']?.[0]?.['cac:Party']?.[0]?.['cac:PostalAddress']?.[0]?.['cbc:CityName'] ?? '';
  const buyerPostalZone = data['cac:AccountingCustomerParty']?.[0]?.['cac:Party']?.[0]?.['cac:PostalAddress']?.[0]?.['cbc:PostalZone'] ?? '';
  const buyerCountryCode =
    data['cac:AccountingCustomerParty']?.[0]?.['cac:Party']?.[0]?.['cac:PostalAddress']?.[0]?.['cac:Country']?.[0]?.['cbc:IdentificationCode']?.[0]?.['_'] ??
    data['cac:AccountingCustomerParty']?.[0]?.['cac:Party']?.[0]?.['cac:PostalAddress']?.[0]?.['cac:Country']?.[0]?.['cbc:IdentificationCode']?.[0] ??
    '';
  const buyerAbn = data['cac:AccountingCustomerParty']?.[0]?.['cac:Party']?.[0]?.['cac:PartyLegalEntity']?.[0]?.['cbc:CompanyID']?.[0]?.['_'] ?? 'Not applicable';
  const paymentMeansName = data['cac:PaymentMeans']?.[0]?.['cbc:PaymentMeansCode']?.[0]?.['$']?.['name'] ?? '';
  const paymentId = data['cac:PaymentMeans']?.[0]?.['cbc:PaymentID']?.[0] ?? '';
  const payeeAccountNumber = data['cac:PaymentMeans']?.[0]?.['cac:PayeeFinancialAccount']?.[0]?.['cbc:ID']?.[0] ?? '';
  const payeeAccountName = data['cac:PaymentMeans']?.[0]?.['cac:PayeeFinancialAccount']?.[0]?.['cbc:Name']?.[0] ?? '';
  const payeeBsbNumber = data['cac:PaymentMeans']?.[0]?.['cac:PayeeFinancialAccount']?.[0]?.['cac:FinancialInstitutionBranch']?.[0]?.['cbc:ID']?.[0] ?? '';
  const paymentTermsNote = data['cac:PaymentTerms']?.[0]?.['cbc:Note']?.[0] ?? '';
  let itemsHtml = '';
  data['cac:InvoiceLine']?.forEach((item) => {
    const description = item['cac:Item']?.[0]?.['cbc:Description'] ?? '';
    const itemName = item['cac:Item']?.[0]?.['cbc:Name'] ?? '';
    const priceAmount = item['cac:Price']?.[0]?.['cbc:PriceAmount']?.[0]?.['_'] ?? '';
    const invoicedQuantity = item['cbc:InvoicedQuantity']?.[0]?.['_'] ?? '';
    const lineExtensionAmount = item['cbc:LineExtensionAmount']?.[0]?.['_'] ?? '';
    const taxScheme =
      item['cac:Item']?.[0]?.['cac:ClassifiedTaxCategory']?.[0]?.['cac:TaxScheme']?.[0]?.['cbc:ID']?.[0]?.['_'] ??
      item['cac:Item']?.[0]?.['cac:ClassifiedTaxCategory']?.[0]?.['cac:TaxScheme']?.[0]?.['cbc:ID']?.[0] ??
      '';
    itemsHtml += `
      <tr>
        <td>${itemName}</td>
        <td>${description}</td>
        <td>${priceAmount}</td>
        <td>${invoicedQuantity}</td>
        <td>${lineExtensionAmount}</td>
        <td>${taxScheme}</td>
      </tr>`;
  });
  const legalMonetaryTotal = data['cac:LegalMonetaryTotal']?.[0];
  const taxExclusiveAmount = legalMonetaryTotal?.['cbc:TaxExclusiveAmount']?.[0]?.['_'] ?? '';
  const taxInclusiveAmount = legalMonetaryTotal?.['cbc:TaxInclusiveAmount']?.[0]?.['_'] ?? '';
  const payableAmount = legalMonetaryTotal?.['cbc:PayableAmount']?.[0]?.['_'] ?? '';
  const prepaidAmount = legalMonetaryTotal?.['cbc:PrepaidAmount']?.[0]?.['_'] ?? '';
  const deliveryParty = data['cac:Delivery']?.[0]?.['cac:DeliveryParty']?.[0];
  const deliveryName = deliveryParty?.['cac:PartyName']?.[0]?.['cbc:Name'] ?? '';
  const deliveryAddress = data['cac:Delivery']?.[0]?.['cac:DeliveryLocation']?.[0];
  const deliveryStreetName = deliveryAddress?.['cac:Address']?.[0]?.['cbc:StreetName'] ?? '';
  const deliveryAdditionalStreetName = deliveryAddress?.['cac:Address']?.[0]?.['cbc:AdditionalStreetName'] ?? '';
  const deliveryCityName = deliveryAddress?.['cac:Address']?.[0]?.['cbc:CityName'] ?? '';
  const deliveryPostalZone = deliveryAddress?.['cac:Address']?.[0]?.['cbc:PostalZone'] ?? '';
  const deliveryCountrySubentity = deliveryAddress?.['cac:Address']?.[0]?.['cbc:CountrySubentity'] ?? '';
  const deliveryAddressLine = deliveryAddress?.['cac:Address']?.[0]?.['cac:AddressLine']?.[0]?.['cbc:Line'] ?? '';
  const deliveryCountryCode = deliveryAddress?.['cac:Address']?.[0]?.['cac:Country']?.[0]?.['cbc:IdentificationCode']?.[0] ?? '';
  const actualDeliveryDate = data['cac:Delivery']?.[0]?.['cbc:ActualDeliveryDate']?.[0] ?? '';
  const missingFields = validateJson(data);
  console.log(missingFields);
  const missingFieldsMessage = missingFields.length > 0 ?
    '<p style="color: red;">Our service has detected there are fields missing in the invoice.</p>' :
    '<div></div>';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice</title>
      <style>
        body {
          font-family: Verdana, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }
        h1 {
          color: darkblue;
        }
        h2 {
          color: darkblue;
        }
        .divBox {
          margin-top: 20px;
          width: 100%;
          max-width: 800px;
          border: 1px solid #ccc;
          padding: 10px;
          border-radius: 5px;
        }
        .divBox h3 {
          margin-top: 0;
          color: darkblue;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #F0FFFF;
        }
      </style>
    </head>
    <body>
      <h1>NightOwls Invoice Rendering Service</h1>
      <div class="divBox">
        <h2>Invoice Details</h2>
        <div><strong>ID:</strong> ${id}</div>
        <div><strong>Issue Date:</strong> ${issueDate}</div>
        <div><strong>Due Date:</strong> ${dueDate}</div>
        <div><strong>Buyer Reference:</strong> ${buyerReference}</div>
        <div><strong>Billing Reference ID:</strong> ${billingReferenceId}</div>
        <div><strong>Billing Reference Issue Date:</strong> ${billingReferenceIssueDate}</div>
      </div>
  
      <div class="divBox">
        <h3>Seller</h3>
        <div><strong>Name:</strong> ${sellerName}</div>
        <div><strong>Address:</strong> ${sellerStreetName} ${sellerCityName} ${sellerPostalZone} ${sellerCountryCode}</div>
        <div><strong>ABN:</strong> ${sellerAbn}</div>
      </div>
      <div class="divBox">
        <h3>Buyer</h3>
        <div><strong>Name:</strong> ${buyerName}</div>
        <div><strong>Address:</strong> ${buyerStreetName} ${buyerCityName} ${buyerPostalZone} ${buyerCountryCode}</div>
        <div><strong>ABN:</strong> ${buyerAbn}</div>
      </div>
      <div class="divBox">
        <h3>Delivery Details</h3>
        <div><strong>Name:</strong> ${deliveryName}</div>
        <div><strong>Address:</strong> ${deliveryStreetName} ${deliveryAdditionalStreetName} ${deliveryCityName} ${deliveryPostalZone} ${deliveryCountrySubentity}</div>
        <div><strong>Address Extra Line:</strong> ${deliveryAddressLine}</div>
        <div><strong>Country Code:</strong> ${deliveryCountryCode}</div>
        <div><strong>Actual Delivery Date:</strong> ${actualDeliveryDate}</div>
      </div>
      <div class="divBox">
        <h3>Payment Details</h3>
        <div><strong>Payment Means:</strong> ${paymentMeansName}</div>
        <div><strong>Payment ID:</strong> ${paymentId}</div>
        <div><strong>Payee Account Number:</strong> ${payeeAccountNumber}</div>
        <div><strong>Payee Account Name:</strong> ${payeeAccountName}</div>
        <div><strong>Payee BSB Number:</strong> ${payeeBsbNumber}</div>
        <div><strong>Payment Terms Note:</strong> ${paymentTermsNote}</div>
      </div>
      <div class="divBox">
        <h3>Products sold</h3>
        <table>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Tax Scheme</th>
          </tr>
          ${itemsHtml}
        </table>
      </div>
      <div class="divBox">
        <h3>Payment summary</h3>
        <table>
          <tr>
            <th>Tax Exclusive Amount</th>
            <th>Tax Inclusive Amount</th>
            <th>Prepaid Amount</th>
            <th>Payable Amount</th>
          </tr>
          <tr>
            <td>${taxExclusiveAmount}</td>
            <td>${taxInclusiveAmount}</td>
            <td>${prepaidAmount}</td>
            <td>${payableAmount}</td>
          </tr>
        </table>
      </div>
      ${missingFieldsMessage}
    </body>
    </html>        
    `;
  return html;
}
/**
 * This is a validation check to make sure that the user
 * sending requests is currently in an active session.
 * @param {*} userId
 * @param {*} token
 * @return {-1} if token is invalid
 * @return {userId} if token is valid
 */
function isTokenValid(userId, token) {
  const data = getData();
  const validUser = data.users.find((user) => user.userId === userId);
  if (!validUser) {
    return -1;
  }
  const validToken = validUser.tokens.find((item) => item.id === token.id && token.active === true);
  if (!validToken) {
    return -1;
  }
  return userId;
}
module.exports = {generateHtml, isTokenValid};
