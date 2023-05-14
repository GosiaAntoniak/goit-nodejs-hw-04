const Contact = require('../model/contact');

const listContacts = async (userId, query) => {
  const { sortBy, sortByDesc, filter, limit = 5, offset = 0 } = query;

  const searchOptions = { owner: userId };
  const results = await Contact.paginate(searchOptions, {
    limit,
    offset,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}), // { name: 1 }
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
    select: filter ? filter.split('|').join(' ') : '',
    populate: {
      path: 'owner',
      select: 'name email gender createdAt updatedAt',
    },
  });
  const { docs: contacts } = results;
  delete results.docs;
  return { results, contacts };
};

const getContactById = async (contactId, userId) => {
  const result = await Contact.findOne({
    _id: contactId,
    owner: userId,
  }).populate({
    path: 'owner',
    select: 'name email gender createdAt updatedAt',
  });
  return result;
};

const removeContact = async contactId => {
  const result = await Contact.findByIdAndRemove({ _id: contactId });
  return result;
};

const addContact = async body => {
  const result = await Contact.create(body);
  return result;
};

const updateContact = async (contactId, body) => {
  const result = await Contact.findByIdAndUpdate(
      { _id: contactId },
      { ...body },
      { new: true },
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
