const express = require('express')
const router = express.Router()

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");


router.get('/', async (req, res) => {
  try{
    const contacts = await listContacts()
    res.json ({
      status: "success",
      code: 200,
      data: contacts
    })
  } catch (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "Bad request"
    })
  }
})

router.get('/:contactId', async (req, res) => {
  try {
    const {contactId} = req.params;
    const contact = await getContactById(contactId)
    res.json ({
      status: "success",
      code: 200,
      data: contact,
      message: "Your contact has been found"
    })
  }   catch (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "Bad request"
    })
  }
  
})

router.post('/', async (req, res) => {
  try {
    const body = req.body
    const contact = await addContact(body)
    res.json({
      status: "success",
      code: 201,
      data: contact,
      message: "You just added a new contact",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "Bad Request",
    });
  }
})

router.delete('/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await removeContact(contactId);
    res.json({
      status: "success",
      code: 200,
      data: contact,
      message: "You deleted contact from your list",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "Bad Request",
    });
  }
})

router.put('/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;
    const body = req.body;
    const contact = await updateContact(contactId, body);
    res.json({
      status: "success",
      code: 200,
      data: contact,
      message: "You updated contact",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "Bad Request",
    });
  }
})

module.exports = router
