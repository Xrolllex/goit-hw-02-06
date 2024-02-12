const { readFile, writeFile } = require("fs/promises");
const Joi = require("joi");
const path = require("path");
const { v4: uuidv4 } = require("uuid");


const fileName = "contacts.json";
const contactsPath = path.join(__dirname, fileName);

const getContactsArray = async () => {
  return await readFile(contactsPath, "utf-8")
    .then((data) => JSON.parse(data))
    .catch((error) => console.log(error.message));
};

const saveContactsArray = async (contacts) => {
  await writeFile(contactsPath, JSON.stringify(contacts, null, 2), (error) => {
    if (error) {
      console.error(error.message);
    }
  });
};

const listContacts = async () => {
  try {
    const contacts = await getContactsArray();
    return contacts;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

const getContactById = async (contactId) => {
  try {
    const contacts = await getContactsArray();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      throw new Error(`The contact with this id:${contactId} does not exist`);
    } else {
      return contacts[index];
    }
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

const removeContact = async (contactId) => {
  try {
    const contacts = await getContactsArray();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      throw new Error(`The contact with this id:${contactId} does not exist`);
    } else {
      const deleteContact = contacts.splice(index, 1)
      saveContactsArray(contacts)
      return deleteContact[0]
    }
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

const addContact = async (body) => {
  try {
    const { name, email, phone } = body;
    const contacts = await getContactsArray();
    const findContact = contacts.findIndex(
      (contact) => contact.email === email || contact.phone === phone
    );
    const validate = person.validate({
      id: uuidv4(),
      name,
      email,
      phone,
    });
    if (findContact !== -1) {
      throw new Error("Contact with this data already exists");
    } else if (validate.error) {
      throw new Error("Contact details are filled in incorrectly");
    } else {
      contacts.push(validate.value);
      saveContactsArray(contacts);
      return contacts[contacts.length - 1];
    }
  } catch (error) {
    console.log(error.message.red);
    throw error;
  }
}

const updateContact = async (contactId, body) => {
  try {
    const { name, email, phone } = body;
    const validate = person.validate({
      id: contactId,
      name,
      email,
      phone,
    });
    const contacts = await getContactsArray();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      contacts.push(validate.value);
      saveContactsArray(contacts);
      return contacts[contacts.length - 1];
    } else if (validate.error) {
      throw new Error("Contact details are filled in incorrectly");
    } else {
      contacts.splice(index, 1, validate.value);
      saveContactsArray(contacts);
      return contacts[index];
    }
  } catch (error) {
    console.log(error.message.red);
    throw error;
  }
}


const person = Joi.object({
  id: Joi.string(),
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().required(),
  phone: Joi.string().min(9).max(15).required(),
});

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
