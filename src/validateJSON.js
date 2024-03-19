/**
 * Checks for missing fields in the invoice.
 * @param {*} data
 * @return {missingFields} list
 */
function validateJson(data) {
  const id = data['cbc:ID'] ?? '';
  const issueDate = data['cbc:IssueDate'] ?? '';
  const dueDate = data['cbc:DueDate'] ?? '';
  const sellerStreetName = (data['cac:AccountingSupplierParty']?.[0]?.['cac:Party']?.[0]?.['cac:PostalAddress']?.[0]?.['cbc:StreetName'] ?? '') ?? '';
  const sellerCityName = data['cac:AccountingSupplierParty']?.[0]?.['cac:Party']?.[0]?.['cac:PostalAddress']?.[0]?.['cbc:CityName'] ?? '';
  const sellerPostalZone = data['cac:AccountingSupplierParty']?.[0]?.['cac:Party']?.[0]?.['cac:PostalAddress']?.[0]?.['cbc:PostalZone'] ?? '';
  const sellerCountryCode =
    data['cac:AccountingSupplierParty']?.[0]?.['cac:Party']?.[0]?.['cac:PostalAddress']?.[0]?.['cac:Country']?.[0]?.['cbc:IdentificationCode']?.[0]?.['_'] ??
    data['cac:AccountingSupplierParty']?.[0]?.['cac:Party']?.[0]?.['cac:PostalAddress']?.[0]?.['cac:Country']?.[0]?.['cbc:IdentificationCode']?.[0] ??
    '';
  const sellerAbn = (data['cac:AccountingSupplierParty']?.[0]?.['cac:Party']?.[0]?.['cac:PartyLegalEntity']?.[0]?.['cbc:CompanyID']?.[0]?.['_'] ?? '') ?? 'Not applicable';
  const buyerName = data['cac:AccountingCustomerParty']?.[0]?.['cac:Party']?.[0]?.['cac:PartyName']?.[0]?.['cbc:Name'] ?? '';
  const buyerStreetName = data['cac:AccountingCustomerParty']?.[0]?.['cac:Party']?.[0]?.['cac:PostalAddress']?.[0]?.['cbc:StreetName'] ?? '';
  const buyerCityName = data['cac:AccountingCustomerParty']?.[0]?.['cac:Party']?.[0]?.['cac:PostalAddress']?.[0]?.['cbc:CityName'] ?? '';
  const buyerPostalZone = data['cac:AccountingCustomerParty']?.[0]?.['cac:Party']?.[0]?.['cac:PostalAddress']?.[0]?.['cbc:PostalZone'] ?? '';
  const buyerCountryCode =
    data['cac:AccountingCustomerParty']?.[0]?.['cac:Party']?.[0]?.['cac:PostalAddress']?.[0]?.['cac:Country']?.[0]?.['cbc:IdentificationCode']?.[0]?.['_'] ??
    data['cac:AccountingCustomerParty']?.[0]?.['cac:Party']?.[0]?.['cac:PostalAddress']?.[0]?.['cac:Country']?.[0]?.['cbc:IdentificationCode']?.[0] ??
    '';
  const buyerAbn = (data['cac:AccountingCustomerParty']?.[0]?.['cac:Party']?.[0]?.['cac:PartyLegalEntity']?.[0]?.['cbc:CompanyID']?.[0]?.['_'] ?? '') ?? 'Not applicable';
  const paymentMeansName = data['cac:PaymentMeans']?.[0]?.['cbc:PaymentMeansCode']?.[0]?.['$']?.['name'] ?? '';
  const paymentID = data['cac:PaymentMeans']?.[0]?.['cbc:PaymentID']?.[0] ?? '';
  const payeeAccountNumber = data['cac:PaymentMeans']?.[0]?.['cac:PayeeFinancialAccount']?.[0]?.['cbc:ID']?.[0] ?? '';
  const payeeAccountName = data['cac:PaymentMeans']?.[0]?.['cac:PayeeFinancialAccount']?.[0]?.['cbc:Name']?.[0] ?? '';
  const payeeBSBNumber = data['cac:PaymentMeans']?.[0]?.['cac:PayeeFinancialAccount']?.[0]?.['cac:FinancialInstitutionBranch']?.[0]?.['cbc:ID']?.[0] ?? '';
  const paymentTermsNote = data['cac:PaymentTerms']?.[0]?.['cbc:Note']?.[0] ?? '';
  const missingFields = [];
  if (!id) missingFields.push('ID');
  if (!issueDate) missingFields.push('IssueDate');
  if (!dueDate) missingFields.push('DueDate');
  if (!sellerStreetName) missingFields.push('SellerStreetName');
  if (!sellerCityName) missingFields.push('SellerCityName');
  if (!sellerPostalZone) missingFields.push('SellerPostalZone');
  if (!sellerCountryCode) missingFields.push('SellerCountryCode');
  if (!sellerAbn) missingFields.push('SellerABN');
  if (!buyerName) missingFields.push('BuyerName');
  if (!buyerStreetName) missingFields.push('BuyerStreetName');
  if (!buyerCityName) missingFields.push('BuyerCityName');
  if (!buyerPostalZone) missingFields.push('BuyerPostalZone');
  if (!buyerCountryCode) missingFields.push('BuyerCountryCode');
  if (!buyerAbn) missingFields.push('BuyerABN');
  if (!paymentMeansName) missingFields.push('PaymentMeansName');
  if (!paymentID) missingFields.push('PaymentID');
  if (!payeeAccountNumber) missingFields.push('PayeeAccountNumber');
  if (!payeeAccountName) missingFields.push('PayeeAccountName');
  if (!payeeBSBNumber) missingFields.push('PayeeBSBNumber');
  if (!paymentTermsNote) missingFields.push('PaymentTermsNote');

  return missingFields;
}

module.exports = validateJson;
