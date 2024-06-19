const { getCrowdinConnection } = require('../_shared');

const perform = async (z, bundle) => {
  //it's crowdin.com
  if (!bundle.authData.domain) {
    return [{ id: 0, title: 'Default for crowdin.com' }]
  }

  const { vendorsApi } = await getCrowdinConnection(z, bundle);

  return (await vendorsApi.withFetchAll().listVendors()).data.map((obj) => obj.data)
};

module.exports = {
  operation: { perform: perform },
  key: 'list_vendors',
  noun: 'Vendor',
  display: {
    label: 'List Vendors',
    description: 'Returns a list of organization vendors.',
    hidden: true,
  }
}